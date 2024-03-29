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




function getChar() {
    // for i,v in pairs(Ext.Entity.GetAllEntitiesWithUuid()) do local ccs = Ext.Entity.Get(i):GetAllComponents() if ccs ~= nil and ccs.CharacterCreationStats ~= nil and ccs.CharacterCreationStats.Name == "DextreBeDextre" then local uuid = ccs.Uuid.EntityUuid local me = Ext.Entity.Get(uuid):GetAllComponents() _D(me) end end
    let me = GetHostCharacter();

    // TODO - Determine if client vs server and return character from that
    for (const [ k, v ] of Object.entries(Ext.Entity.GetAllEntitiesWithUuid())) {
        const ccs = Ext.Entity.Get(k).GetAllComponents();
        // Ext.Entity.Get(GetHostCharacter()).Uuid.EntityUuid
        const uuid = ccs.Uuid.EntityUuid;

        if (ccs?.CharacterCreationStats?.Name == 'DextreBeDextre' || ccs?.CharacterCreationStats?.Name == 'Raziel') {
            // me = Ext.Entity.Get(uuid).GetAllComponents();
        }
    }

    return me;
}

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
    const char = Ext.Entity.Get(getChar());
    const charComponents = char.GetAllComponents();

    const spells = {};

    Object.entries(charComponents.SpellContainer.Spells).forEach(([i, spellInfo]) => {
        spells[spellInfo.SpellId.OriginatorPrototype] = spellInfo;
    });

    log(spells);

    return spells;
}

// Ext.Stats.GetStats("PassiveData")
// AddPassive(GetHostCharacter(), "FastHands")
// AddPassive(GetHostCharacter(), "ModeratelyArmored")

function getAllSpells() {
    return Ext.Stats.GetStats("SpellData");
}


function setSpellSlotCost(spellName, slotCost = 0) {
    const spell = Ext.Stats.Get(spellName);
    const { UseCosts } = spell;
    // const spellLevel = UseCosts.match(/(?<=:)\d+$/)[0];
    const spellLevel = string.gsub(UseCosts, ".*:(%d+)$", "%1");
    const spellActionCost = string.gsub(UseCosts, "^([^:]+).*$", "%1");

    if (slotCost > 0) {
        spell.UseCosts = `${spellActionCost}:1;SpellSlotsGroup:${slotCost}:${slotCost}:${spellLevel}`;
    } else {
        spell.UseCosts = `${spellActionCost}:1`;
    }

    Ext.Stats.Get(spellName):Sync();
}


function addSpell(spellName) {
    AddSpell(getChar(), spellName, 0, 1)
}


function addItem(itemUuid, quantity = 1) {
    // e.g. Gold (itemName=LOOT_Gold_A):
    //  addItem("1c3c9c74-34a1-4685-989e-410dc080be6f", 7000)
    TemplateAddTo(itemUuid, getChar(), quantity);
}


function getCharSpellAttributes() {
    let spells = {};

    Object.entries(Ext.Entity.Get(getChar()).SpellBook).forEach(([ k1, v1 ]) => {
        Object.entries(v1).forEach(([ k2, v2 ]) => {
            spells = v2;
        });
    });

    log(spells);

    return spells;
}


function getCharSpells() {
    const spellBook = Ext.Entity.Get(getChar()).SpellBook;

    Object.entries(spellBook).forEach(([ key, val ]) => {
        log(key, val);
    });
}


// Mod commands are persisted between game loads but not when the game reboots

// Split spells we want to remove spell-slot cost from in separate statements
// because the console doesn't allow pasting super long lines

const modSpellsToRemoveCost = [];
modSpellsToRemoveCost.push(
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
    'Projectile_WitchBolt',
    'Projectile_WitchBolt_2',
    'Projectile_WitchBolt_3',
    'Projectile_WitchBolt_4',
    'Projectile_WitchBolt_5',
    'Projectile_WitchBolt_6',
    'Projectile_WitchBolt_Trap',
    'Target_InflictWounds',
    'Target_InflictWounds_2',
    'Target_InflictWounds_3',
    'Target_InflictWounds_4',
    'Target_InflictWounds_5',
    'Target_InflictWounds_6',
);
modSpellsToRemoveCost.push(
    'Target_HealingWord',
    'Target_HealingWord_2',
    'Target_HealingWord_3',
    'Target_HealingWord_4',
    'Target_HealingWord_5',
    'Target_HealingWord_6',
    'Target_LesserRestoration',
    'Target_CreateDestroyWater',
    'Target_CreateWater',
    'Target_CreateWater_2',
    'Target_DestroyWater',
    'Target_DestroyWater_2',
    'Target_GaseousForm',
    'Target_CharmPerson',
    'Target_CharmPerson_2',
    'Target_SpeakWithDead',
    'Target_AnimateDead',
    'Shout_FalseLife_2',
);
modSpellsToRemoveCost.push(
    'Target_FogCloud',
    'Target_FogCloud_2',
    'Target_FogCloud_3',
    'Target_FogCloud_4',
    'Target_FogCloud_5',
    'Target_FogCloud_6',
    'Target_Sleep',
    'Target_Sleep_2',
    'Target_Sleep_2_AI',
    'Target_Sleep_3',
    'Target_Sleep_3_AI',
    'Target_Sleep_4',
    'Target_Sleep_4_AI',
    'Target_Sleep_5',
    'Target_Sleep_5_AI',
    'Target_Sleep_6',
    'Target_Sleep_6_AI',
    'Target_Sleep_AI',
);
modSpellsToRemoveCost.push(
    'Target_FindFamiliar',
    'Target_FindFamiliar_2',
    'Target_FindFamiliar_3',
    'Target_FindFamiliar_4',
    'Target_FindFamiliar_5',
    'Target_FindFamiliar_6',
    'Target_FindFamiliar_Boo',
    'Target_FindFamiliar_Cat',
    'Target_FindFamiliar_Cat_2',
    'Target_FindFamiliar_Cat_3',
    'Target_FindFamiliar_Cat_4',
    'Target_FindFamiliar_Cat_5',
    'Target_FindFamiliar_Cat_6',
    'Target_FindFamiliar_Cat_Ritual',
    'Target_FindFamiliar_Crab',
    'Target_FindFamiliar_Crab_2',
    'Target_FindFamiliar_Crab_3',
    'Target_FindFamiliar_Crab_4',
    'Target_FindFamiliar_Crab_5',
    'Target_FindFamiliar_Crab_6',
    'Target_FindFamiliar_Crab_Ritual',
    'Target_FindFamiliar_Dog',
    'Target_FindFamiliar_Dog_Ritual',
    'Target_FindFamiliar_Frog',
    'Target_FindFamiliar_Frog_2',
    'Target_FindFamiliar_Frog_3',
    'Target_FindFamiliar_Frog_4',
    'Target_FindFamiliar_Frog_5',
    'Target_FindFamiliar_Frog_6',
    'Target_FindFamiliar_Frog_Ritual',
    'Target_FindFamiliar_NPC',
    'Target_FindFamiliar_Rat',
    'Target_FindFamiliar_Rat_2',
    'Target_FindFamiliar_Rat_3',
    'Target_FindFamiliar_Rat_4',
    'Target_FindFamiliar_Rat_5',
    'Target_FindFamiliar_Rat_6',
    'Target_FindFamiliar_Rat_Ritual',
    'Target_FindFamiliar_Raven',
    'Target_FindFamiliar_Raven_2',
    'Target_FindFamiliar_Raven_3',
    'Target_FindFamiliar_Raven_4',
    'Target_FindFamiliar_Raven_5',
    'Target_FindFamiliar_Raven_6',
    'Target_FindFamiliar_Raven_NPC',
    'Target_FindFamiliar_Raven_Ritual',
    'Target_FindFamiliar_Ritual',
    'Target_FindFamiliar_Spider',
    'Target_FindFamiliar_Spider_2',
    'Target_FindFamiliar_Spider_3',
    'Target_FindFamiliar_Spider_4',
    'Target_FindFamiliar_Spider_5',
    'Target_FindFamiliar_Spider_6',
    'Target_FindFamiliar_Spider_NPC',
    'Target_FindFamiliar_Spider_Ritual',
);
modSpellsToRemoveCost.push(
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
);
modSpellsToRemoveCost.push(
    'Target_Command_Approach',
    'Target_Command_Approach_2',
    'Target_Command_Approach_2_AI',
    'Target_Command_Approach_3',
    'Target_Command_Approach_3_AI',
    'Target_Command_Approach_4',
    'Target_Command_Approach_4_AI',
    'Target_Command_Approach_5',
    'Target_Command_Approach_5_AI',
    'Target_Command_Approach_6',
    'Target_Command_Approach_6_AI',
    'Target_Command_Container',
    'Target_Command_Container_2',
    'Target_Command_Container_3',
    'Target_Command_Container_4',
    'Target_Command_Container_5',
    'Target_Command_Container_6',
    'Target_Command_Drop',
    'Target_Command_Drop_2',
    'Target_Command_Drop_2_AI',
    'Target_Command_Drop_3',
    'Target_Command_Drop_3_AI',
    'Target_Command_Drop_4',
    'Target_Command_Drop_4_AI',
    'Target_Command_Drop_5',
    'Target_Command_Drop_5_AI',
    'Target_Command_Drop_6',
    'Target_Command_Drop_6_AI',
    'Target_Command_Flee',
    'Target_Command_Flee_2',
    'Target_Command_Flee_2_AI',
    'Target_Command_Flee_3',
    'Target_Command_Flee_3_AI',
    'Target_Command_Flee_4',
    'Target_Command_Flee_4_AI',
    'Target_Command_Flee_5',
    'Target_Command_Flee_5_AI',
    'Target_Command_Flee_6',
    'Target_Command_Flee_6_AI',
    'Target_Command_Grovel',
    'Target_Command_Grovel_2',
    'Target_Command_Grovel_2_AI',
    'Target_Command_Grovel_3',
    'Target_Command_Grovel_3_AI',
    'Target_Command_Grovel_4',
    'Target_Command_Grovel_4_AI',
    'Target_Command_Grovel_5',
    'Target_Command_Grovel_5_AI',
    'Target_Command_Grovel_6',
    'Target_Command_Grovel_6_AI',
    'Target_Command_Grovel_NPC',
    'Target_Command_Halt',
    'Target_Command_Halt_2',
    'Target_Command_Halt_2_AI',
    'Target_Command_Halt_3',
    'Target_Command_Halt_3_AI',
    'Target_Command_Halt_4',
    'Target_Command_Halt_4_AI',
    'Target_Command_Halt_5',
    'Target_Command_Halt_5_AI',
    'Target_Command_Halt_6',
    'Target_Command_Halt_6_AI',
    'Target_Command_Halt_NPC',
);
modSpellsToRemoveCost.push(
    'Target_Sanctuary',
    'Target_Sanctuary_2',
    'Shout_DisguiseSelf',
    'Shout_DisguiseSelf_Cancel',
    'Shout_DisguiseSelf_Dragonborn_Female',
    'Shout_DisguiseSelf_Dragonborn_Female_MOMF',
    'Shout_DisguiseSelf_Dragonborn_Male',
    'Shout_DisguiseSelf_Dragonborn_Male_MOMF',
    'Shout_DisguiseSelf_Drow_Female',
    'Shout_DisguiseSelf_Drow_Female_MOMF',
    'Shout_DisguiseSelf_Drow_Male',
    'Shout_DisguiseSelf_Drow_Male_MOMF',
    'Shout_DisguiseSelf_Drow_Strong_Female',
    'Shout_DisguiseSelf_Drow_Strong_Female_MOMF',
    'Shout_DisguiseSelf_Drow_Strong_Male',
    'Shout_DisguiseSelf_Drow_Strong_Male_MOMF',
    'Shout_DisguiseSelf_Dwarf_Female',
    'Shout_DisguiseSelf_Dwarf_Female_MOMF',
    'Shout_DisguiseSelf_Dwarf_Male',
    'Shout_DisguiseSelf_Dwarf_Male_MOMF',
    'Shout_DisguiseSelf_Elf_Female',
    'Shout_DisguiseSelf_Elf_Female_MOMF',
    'Shout_DisguiseSelf_Elf_Male',
    'Shout_DisguiseSelf_Elf_Male_MOMF',
    'Shout_DisguiseSelf_Elf_Strong_Female',
    'Shout_DisguiseSelf_Elf_Strong_Female_MOMF',
    'Shout_DisguiseSelf_Elf_Strong_Male',
    'Shout_DisguiseSelf_Elf_Strong_Male_MOMF',
    'Shout_DisguiseSelf_Githyanki_Female',
    'Shout_DisguiseSelf_Githyanki_Female_MOMF',
    'Shout_DisguiseSelf_Githyanki_Male',
    'Shout_DisguiseSelf_Githyanki_Male_MOMF',
    'Shout_DisguiseSelf_Gnome_Female',
    'Shout_DisguiseSelf_Gnome_Female_MOMF',
    'Shout_DisguiseSelf_Gnome_Male',
    'Shout_DisguiseSelf_Gnome_Male_MOMF',
    'Shout_DisguiseSelf_HalfElf_Female',
    'Shout_DisguiseSelf_HalfElf_Female_MOMF',
    'Shout_DisguiseSelf_HalfElf_Male',
    'Shout_DisguiseSelf_HalfElf_Male_MOMF',
    'Shout_DisguiseSelf_HalfElf_Strong_Female',
    'Shout_DisguiseSelf_HalfElf_Strong_Female_MOMF',
    'Shout_DisguiseSelf_HalfElf_Strong_Male',
    'Shout_DisguiseSelf_HalfElf_Strong_Male_MOMF',
    'Shout_DisguiseSelf_HalfOrc_Female',
    'Shout_DisguiseSelf_HalfOrc_Female_MOMF',
    'Shout_DisguiseSelf_HalfOrc_Male',
    'Shout_DisguiseSelf_HalfOrc_Male_MOMF',
    'Shout_DisguiseSelf_Halfling_Female',
    'Shout_DisguiseSelf_Halfling_Female_MOMF',
    'Shout_DisguiseSelf_Halfling_Male',
    'Shout_DisguiseSelf_Halfling_Male_MOMF',
    'Shout_DisguiseSelf_Human_Female',
    'Shout_DisguiseSelf_Human_Female_MOMF',
    'Shout_DisguiseSelf_Human_Male',
    'Shout_DisguiseSelf_Human_Male_Doppelganger',
    'Shout_DisguiseSelf_Human_Male_MOMF',
    'Shout_DisguiseSelf_Human_Strong_Female',
    'Shout_DisguiseSelf_Human_Strong_Female_MOMF',
    'Shout_DisguiseSelf_Human_Strong_Male',
    'Shout_DisguiseSelf_Human_Strong_Male_MOMF',
    'Shout_DisguiseSelf_MaskOfManyFaces',
    'Shout_DisguiseSelf_Tiefling_Female',
    'Shout_DisguiseSelf_Tiefling_Female_MOMF',
    'Shout_DisguiseSelf_Tiefling_Male',
    'Shout_DisguiseSelf_Tiefling_Male_MOMF',
    'Shout_DisguiseSelf_Tiefling_Strong_Female',
    'Shout_DisguiseSelf_Tiefling_Strong_Female_MOMF',
    'Shout_DisguiseSelf_Tiefling_Strong_Male',
    'Shout_DisguiseSelf_Tiefling_Strong_Male_MOMF',
    'Shout_Dismiss_Self',
);

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

    // addSpell("Target_MistyStep_3");
    // addSpell("Target_HealingWord_6");

    modSpellsToRemoveCost.forEach(spellName => {
        setSpellSlotCost(spellName);
    });
}

// Add item(s) to inventory.
// See:
//  - https://www.reddit.com/r/BaldursGate3/comments/15w6b72/help_need_to_find_item_uuid/
// TemplateAddTo("UUID", getChar(), quantity);
// TemplateAddTo("LOOT_Camp_Pack", getChar(), 4);

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
//     if string.sub(char, -36) == char then
//         Ext.Utils.PrintWarning("TurnEnded")
//         Osi.OpenMessageBoxYesNo(Osi.GetHostCharacter(), "Is this thing working?")
//     end
// end)


/*
Ext.Stats.GetStats("SpellData")
function foo() {
    function parseFourth()
        for k,v in pairs(Ext.Entity.Get(getChar())) do
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

    Ext.Entity.Get(getChar()):GetAllComponents()

    print(parseFirst())
}
*/
