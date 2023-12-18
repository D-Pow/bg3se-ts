const require = Ext.Require;

/** @noSelf **/
declare interface Ext {
    Entity: Entity;
    Require(module: string): unknown;
    Dump(arg: unknown): void;
}
declare const Ext: Ext;

/** @noSelf **/
declare interface Entity {
    Get(character: unknown): {
        GetAllComponents(): Record<string, unknown>;
    };

    GetHostCharacter(): unknown;
}
declare const Entity: Entity;



function log(...args) {
    // console.log(util.inspect(sortedTable, { depth: undefined, showHidden: true, colors: true }));

    args.forEach(arg => print(Ext.Dump(arg)));
}


function getSpells() {
    const charComponents = Ext.Entity.Get(GetHostCharacter()).GetAllComponents();

    let spells = {};

    Object.entries(charComponents['SpellModificationContainer']).forEach(([ k1, v1 ]) => {
        Object.entries(v1).forEach(([ k2, v2 ]) => {
            Object.entries(v2).forEach(([ k3, v3 ]) => {
                spells = v3;
            });
        });
    });

    log(spells);

    return spells;
}


function getCharSpellAttributes() {
    let spells = {};

    Object.entries(Ext.Entity.Get(GetHostCharacter()).SpellBook).forEach(([ k1, v1 ]) => {
        Object.entries(v1).forEach(([ k2, v2 ]) => {
            spells = v2;
        });
    });

    log(spells);

    return spells;
}


function getCharSpells() {
    const spellBook = Ext.Entity.Get(GetHostCharacter()).SpellBook;

    Object.entries(spellBook).forEach(([ key, val ]) => {
        log(key, val);
    });
}


function sortTable(table) {
    const sortedTable = Object.entries(table)
        .sort(([ k1, v1 ], [ k2, v2 ]) => k1.localeCompare(k2))
        .reduce((obj, [ key, val ]) => {
            obj[key] = val;

            return obj;
        }, {});

    return sortedTable;
}


function printTable(table) {
    const sortedTable = sortTable(table);

    log(sortedTable);

    return sortedTable;
}


// Ext.Stats.GetStats("SpellData")

// function foo() {
//     function parseFourth()
//         for k,v in pairs(Ext.Entity.Get(GetHostCharacter())) do
//             return k, v
//         end
//     end
//
//     function parseThird(a)
//         if (a == 2) then
//             return parseFourth()
//         end
//     end
//
//     function parseSecond(x)
//         for k1,v1 in pairs(x) do
//             for k2,v2 in pairs(v1) do
//                 for k3,v3 in pairs(v2) do
//                     for k4 in pairs(k3) do
//                         return parseThird(k4)
//                     end
//                 end
//             end
//         end
//     end
//
//     -- https://github.com/Norbyte/bg3se/blob/main/Docs/API.md#extstatsgetstat-type-level-statentry
//     function parseFirst()
//         for k,v in pairs() do
//             if (k == "SpellModificationContainer" or k == "SpellContainer" or k == "CCPrepareSpell" or k == "AddedSpells") then
//                 if (string.len(k) > 0) then
//                     if (type(pairs(v)) ~= "function") then
//                         return parseSecond(pairs(v))
//                     end
//                 end
//             end
//         end
//     end
//
//     Ext.Entity.Get(GetHostCharacter()):GetAllComponents()
//
//     print(parseFirst())
// }
