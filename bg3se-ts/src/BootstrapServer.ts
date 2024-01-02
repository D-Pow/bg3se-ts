// @ts-nocheck

/*
 * All spells: https://pastebin.com/xnbqjUJT
 */

const require = Ext.Require;

/** @noSelf **/
declare interface Ext {
    Require(module: string): unknown;
    Dump(arg: unknown): void;
    Entity: Entity;
    Stats: Stats;
    GetStats(): string[];
}

/** @noSelf **/
declare interface Entity {
    Get(character: unknown): {
        GetAllComponents(this: any): Record<string, unknown>;
    };

    GetHostCharacter(): unknown;
}

/** @noSelf **/
declare interface Stats {
    GetStats(stat: string): Stat;
    Get(charStat: string): Stat;
}

/** @noSelf **/
declare interface Stat {
    UseCosts: string;
    Sync(this: any): void;
}
declare const Stat: Stat;

declare function _D(arg): void;
declare function _P(arg): void;




function log(...args) {
    // console.log(util.inspect(sortedTable, { depth: undefined, showHidden: true, colors: true }));
    args.forEach(arg => {
        Ext.Dump(arg);
    });
}

// https://stackoverflow.com/questions/55108794/what-is-the-difference-between-pairs-and-ipairs-in-lua
// https://stackoverflow.com/questions/640642/how-do-you-copy-a-lua-table-by-value/640645#640645
function deepCopy(orig) {
    let copy = {};

    if (typeof orig === 'table') {
        for (const [ k, v ] of Object.entries(orig)) {
            copy[deepCopy(k)] = deepCopy(v);
        }

        // https://www.lua.org/pil/13.html
        setmetatable(copy, deepcopy(getmetatable(orig)));
    } else {
        copy = orig;
    }

    return copy;
}

// https://stackoverflow.com/questions/48188718/lua-sort-string-array-with-varying-casing/48189296#48189296
function sortTable(t, {
    caseInsensitive = true,
}= {}) {
    // const sortedTable = Object.entries(table)
    //     .sort(([ k1, v1 ], [ k2, v2 ]) => k1.localeCompare(k2))
    //     .reduce((obj, [ key, val ]) => {
    //         obj[key] = val;
    //
    //         return obj;
    //     }, {});

    if (caseInsensitive) {
        table.sort(t, (a, b) => string.upper(a) < string.upper(b));
    } else {
        table.sort(t);
    }

    return t;
}

function printTable(table) {
    const sortedTable = sortTable(table);

    log(sortedTable);

    return sortedTable;
}

function findInTable(t, word) {
    const filteredTable = {};

    for (const [ k, v ] of Object.entries(t)) {
        if (string.gmatch(k, "\b" + word + "\b")) {
            filteredTable[k] = v;
        }
    }

    return filteredTable;
}


function getSpells() {
    const char = Ext.Entity.Get(GetHostCharacter());
    const charComponents = char.GetAllComponents();

    const spells = {};

    Object.entries(charComponents.SpellContainer.Spells).forEach(([i, spellInfo]) => {
        spells[spellInfo.SpellId.OriginatorPrototype] = spellInfo;
    });

    log(spells);

    return spells;
}


function getAllSpells() {
    return Ext.Stats.GetStats("SpellData");
}


function setSpellSlotCost(spellName, slotCost = 0) {
    const spell = Ext.Stats.Get(spellName);
    const { UseCosts } = spell;
    // const spellLevel = UseCosts.match(/(?<=:)\d+$/)[0];
    const spellLevel = string.gsub(UseCosts, ".*:(%d+)$", "%1");

    if (slotCost > 0) {
        spell.UseCosts = `ActionPoint:1;SpellSlotsGroup:${slotCost}:${slotCost}:${spellLevel}`;
    } else {
        spell.UseCosts = 'ActionPoint:1';
    }

    Ext.Stats.Get(spellName):Sync();
}


function addSpell(spellName) {
    AddSpell(GetHostCharacter(), spellName, 0, 1)
}


function addItem(itemUuid, quantity = 1) {
    // e.g. Gold (itemName=LOOT_Gold_A):
    //  addItem("1c3c9c74-34a1-4685-989e-410dc080be6f", 7000)
    TemplateAddTo(itemUuid, GetHostCharacter(), quantity);
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


// Mod commands are persisted between game loads but not when the game reboots

function runModsOnSessionLoaded() {
    // _P("runModsOnSessionLoaded");
    // Ext.RegisterConsoleCommand("log", log);
    // Ext.RegisterConsoleCommand("getSpells", getSpells);
    // Ext.RegisterConsoleCommand("getAllSpells", getAllSpells);
    // Ext.RegisterConsoleCommand("setSpellSlotCost", setSpellSlotCost);
    // Ext.RegisterConsoleCommand("addSpell", addSpell);
    // Ext.RegisterConsoleCommand("getCharSpellAttributes", getCharSpellAttributes);
    // Ext.RegisterConsoleCommand("getCharSpells", getCharSpells);
    // Ext.RegisterConsoleCommand("sortTable", sortTable);
    // Ext.RegisterConsoleCommand("printTable", printTable);

    [
        'Projectile_Fireball_4',
        'Projectile_Fireball_5',
        'Projectile_Fireball_6',
        'Target_MistyStep_3',
        'Projectile_GuidingBolt',
        'Projectile_GuildingBolt_2',
        'Projectile_MagicMissile',
        'Projectile_MagicMissile_2',
        'Projectile_MagicMissile_3',
        'Projectile_MagicMissile_4',

        'Target_HealingWord',
        'Target_HealingWord_2',
        'Target_HealingWord_3',
        'Target_HealingWord_4',
        'Target_HealingWord_5',
        'Target_HealingWord_6',
        'Target_CreateDestroyWater',
        'Target_CreateWater',
        'Target_CreateWater_2',
        'Target_DestroyWater',
        'Target_DestroyWater_2',

        'Target_GaseousForm',

        'Target_FogCloud',
        'Target_FogCloud_2',
        'Target_FogCloud_3',
        'Target_FogCloud_4',
        'Target_FogCloud_5',
        'Target_FogCloud_6',

        "Target_FindFamiliar",
        "Target_FindFamiliar_2",
        "Target_FindFamiliar_3",
        "Target_FindFamiliar_4",
        "Target_FindFamiliar_5",
        "Target_FindFamiliar_6",
        "Target_FindFamiliar_Boo",
        "Target_FindFamiliar_Cat",
        "Target_FindFamiliar_Cat_2",
        "Target_FindFamiliar_Cat_3",
        "Target_FindFamiliar_Cat_4",
        "Target_FindFamiliar_Cat_5",
        "Target_FindFamiliar_Cat_6",
        "Target_FindFamiliar_Cat_Ritual",
        "Target_FindFamiliar_Crab",
        "Target_FindFamiliar_Crab_2",
        "Target_FindFamiliar_Crab_3",
        "Target_FindFamiliar_Crab_4",
        "Target_FindFamiliar_Crab_5",
        "Target_FindFamiliar_Crab_6",
        "Target_FindFamiliar_Crab_Ritual",
        "Target_FindFamiliar_Dog",
        "Target_FindFamiliar_Dog_Ritual",
        "Target_FindFamiliar_Frog",
        "Target_FindFamiliar_Frog_2",
        "Target_FindFamiliar_Frog_3",
        "Target_FindFamiliar_Frog_4",
        "Target_FindFamiliar_Frog_5",
        "Target_FindFamiliar_Frog_6",
        "Target_FindFamiliar_Frog_Ritual",
        "Target_FindFamiliar_NPC",
        "Target_FindFamiliar_Rat",
        "Target_FindFamiliar_Rat_2",
        "Target_FindFamiliar_Rat_3",
        "Target_FindFamiliar_Rat_4",
        "Target_FindFamiliar_Rat_5",
        "Target_FindFamiliar_Rat_6",
        "Target_FindFamiliar_Rat_Ritual",
        "Target_FindFamiliar_Raven",
        "Target_FindFamiliar_Raven_2",
        "Target_FindFamiliar_Raven_3",
        "Target_FindFamiliar_Raven_4",
        "Target_FindFamiliar_Raven_5",
        "Target_FindFamiliar_Raven_6",
        "Target_FindFamiliar_Raven_NPC",
        "Target_FindFamiliar_Raven_Ritual",
        "Target_FindFamiliar_Ritual",
        "Target_FindFamiliar_Spider",
        "Target_FindFamiliar_Spider_2",
        "Target_FindFamiliar_Spider_3",
        "Target_FindFamiliar_Spider_4",
        "Target_FindFamiliar_Spider_5",
        "Target_FindFamiliar_Spider_6",
        "Target_FindFamiliar_Spider_NPC",
        "Target_FindFamiliar_Spider_Ritual",

        'Projectile_ChromaticOrb',
        'Projectile_ChromaticOrb_Acid',
        'Projectile_ChromaticOrb_Acid_2',
        'Projectile_ChromaticOrb_Acid_3',
        'Projectile_ChromaticOrb_Acid_4',
        'Projectile_ChromaticOrb_Acid_5',
        'Projectile_ChromaticOrb_Acid_6',
        'Projectile_ChromaticOrb_Acid_BookOfAncientSecrets',
        'Projectile_ChromaticOrb_Acid_Monk',
        'Projectile_ChromaticOrb_BookOfAncientSecrets',
        'Projectile_ChromaticOrb_Cold',
        'Projectile_ChromaticOrb_Cold_2',
        'Projectile_ChromaticOrb_Cold_3',
        'Projectile_ChromaticOrb_Cold_4',
        'Projectile_ChromaticOrb_Cold_5',
        'Projectile_ChromaticOrb_Cold_6',
        'Projectile_ChromaticOrb_Cold_BookOfAncientSecrets',
        'Projectile_ChromaticOrb_Cold_Monk',
        'Projectile_ChromaticOrb_Fire',
        'Projectile_ChromaticOrb_Fire_2',
        'Projectile_ChromaticOrb_Fire_3',
        'Projectile_ChromaticOrb_Fire_4',
        'Projectile_ChromaticOrb_Fire_5',
        'Projectile_ChromaticOrb_Fire_6',
        'Projectile_ChromaticOrb_Fire_BookOfAncientSecrets',
        'Projectile_ChromaticOrb_Fire_Monk',
        'Projectile_ChromaticOrb_IceMephit',
        'Projectile_ChromaticOrb_Lightning',
        'Projectile_ChromaticOrb_Lightning_2',
        'Projectile_ChromaticOrb_Lightning_3',
        'Projectile_ChromaticOrb_Lightning_4',
        'Projectile_ChromaticOrb_Lightning_5',
        'Projectile_ChromaticOrb_Lightning_6',
        'Projectile_ChromaticOrb_Lightning_BookOfAncientSecrets',
        'Projectile_ChromaticOrb_Lightning_Monk',
        'Projectile_ChromaticOrb_Monk',
        'Projectile_ChromaticOrb_Poison',
        'Projectile_ChromaticOrb_Poison_2',
        'Projectile_ChromaticOrb_Poison_3',
        'Projectile_ChromaticOrb_Poison_4',
        'Projectile_ChromaticOrb_Poison_5',
        'Projectile_ChromaticOrb_Poison_6',
        'Projectile_ChromaticOrb_Poison_BookOfAncientSecrets',
        'Projectile_ChromaticOrb_Poison_Monk',
        'Projectile_ChromaticOrb_Thunder',
        'Projectile_ChromaticOrb_Thunder_2',
        'Projectile_ChromaticOrb_Thunder_3',
        'Projectile_ChromaticOrb_Thunder_4',
        'Projectile_ChromaticOrb_Thunder_5',
        'Projectile_ChromaticOrb_Thunder_6',
        'Projectile_ChromaticOrb_Thunder_BookOfAncientSecrets',
        'Projectile_ChromaticOrb_Thunder_Monk',
    ].forEach(spellName => {
        setSpellSlotCost(spellName);
    });

    // addSpell("Target_MistyStep_3");
    // addSpell("Target_HealingWord_6");
}

// Add item(s) to inventory.
// See:
//  - https://www.reddit.com/r/BaldursGate3/comments/15w6b72/help_need_to_find_item_uuid/
// TemplateAddTo("UUID", GetHostCharacter(), quantity);
// TemplateAddTo("LOOT_Camp_Pack", GetHostCharacter(), 4);

runModsOnSessionLoaded();

// Ext.Events.SessionLoaded:Subscribe(runModsOnSessionLoaded);
// _P("Yay my mod!");

// Ext.Utils.PrintWarning("testing???")
//
// Ext.Osiris.RegisterListener("MessageBoxYesNoClosed", 3, "after", function (char, msgbox, option)
//     Ext.Utils.PrintWarning("Selected option: " .. option)
// end)
//
// Ext.Osiris.RegisterListener("TurnEnded", 1, "after", function (char)
//     if string.sub(char, -36) == GetHostCharacter() then
//         Ext.Utils.PrintWarning("TurnEnded")
//         Osi.OpenMessageBoxYesNo(Osi.GetHostCharacter(), "Is this thing working?")
//     end
// end)


/*
Ext.Stats.GetStats("SpellData")
function foo() {
    function parseFourth()
        for k,v in pairs(Ext.Entity.Get(GetHostCharacter())) do
            return k, v
        end
    end

    function parseThird(a)
        if (a == 2) then
            return parseFourth()
        end
    end

    function parseSecond(x)
        for k1,v1 in pairs(x) do
            for k2,v2 in pairs(v1) do
                for k3,v3 in pairs(v2) do
                    for k4 in pairs(k3) do
                        return parseThird(k4)
                    end
                end
            end
        end
    end

    // https://github.com/Norbyte/bg3se/blob/main/Docs/API.md#extstatsgetstat-type-level-statentry
    function parseFirst()
        for k,v in pairs() do
            if (k == "SpellModificationContainer" or k == "SpellContainer" or k == "CCPrepareSpell" or k == "AddedSpells") then
                if (string.len(k) > 0) then
                    if (type(pairs(v)) ~= "function") then
                        return parseSecond(pairs(v))
                    end
                end
            end
        end
    end

    Ext.Entity.Get(GetHostCharacter()):GetAllComponents()

    print(parseFirst())
}
*/
