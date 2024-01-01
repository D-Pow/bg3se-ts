#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';


const rootDir = path.normalize(path.resolve(
    childProcess
        .execSync('npm prefix')
        .toString()
        .replace(/\n/g, ''),
));

const buildOutputDir = path.normalize(path.resolve(
    rootDir,
    process.env.npm_package_config_buildOutputDir,
));


export function stripLuaComments(str) {
    return str.replace(/(?<=^|\n)--[^\n]*\n/g, '');
}

export function stripNewlines(str, {
    statementsOnSeparateLines = true,
} = {}) {
    if (statementsOnSeparateLines) {
        return str.replace(/\n(\s+|end)/g, ' $1');
    }

    return str.replace(/\n/g, ' ');
}

export function toOneLineCmdString(str) {
    return patchTsToLuaBugs(stripNewlines(stripLuaComments(str)));
}


export function patchTsToLuaBugs(str) {
    let fixedFileContent = str;

    fixedFileContent = fixedFileContent.replace(/\s+(Sync\(\))/g, ':$1');
    fixedFileContent = fixedFileContent.replace(/\s*\.(GetAllComponents\(\))/g, ':$1');
    fixedFileContent = fixedFileContent.replace(/(?<=^|\n)local /g, '');
    fixedFileContent = fixedFileContent.replace(/____ = Ext\.Events\.SessionLoaded\nSubscribe\(([^,]+), ?([^\)]+)\)/, 'Ext.Events.SessionLoaded:Subscribe($2);');
    fixedFileContent = fixedFileContent.replace(/____ = Ext\.Events\.SessionLoaded\nSubscribe\(([^\)]+)\)/, 'Ext.Events.SessionLoaded:Subscribe($1);');

    return fixedFileContent;
}


export function findLuaFiles(dir = buildOutputDir) {
    const allFilesInDir = fs.readdirSync(dir);
    const allLuaFilesInDir = allFilesInDir.filter(filename => filename.match(/\.lua$/));
    const allLuaFilesPathsInDir = allLuaFilesInDir.map(filename => path.resolve(dir, filename));

    return allLuaFilesPathsInDir;
}

export default function main(procArgs = process.argv) {
    const [
        nodeExecutable,
        scriptPath,
        ...args
    ] = procArgs;

    const outputFiles = findLuaFiles(buildOutputDir);

    outputFiles.forEach(filename => {
        const filePath = path.resolve(buildOutputDir, filename);
        const fileContents = fs.readFileSync(filePath).toString();

        fs.writeFileSync(filePath, toOneLineCmdString(fileContents));
    });
}

main();
