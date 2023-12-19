function foo()
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

    -- https://github.com/Norbyte/bg3se/blob/main/Docs/API.md#extstatsgetstat-type-level-statentry
    function parseFirst()
        for k,v in pairs(Ext.Entity.Get(GetHostCharacter()):GetAllComponents()) do
            if (k == "SpellModificationContainer" or k == "SpellContainer" or k == "CCPrepareSpell" or k == "AddedSpells") then
                if (string.len(k) > 0) then
                    if (type(pairs(v)) ~= "function") then
                        return parseSecond(pairs(v))
                    end
                end
            end
        end
    end

    print(parseFirst())
end

function getSpells()
    for k,v in pairs(Ext.Entity.Get(GetHostCharacter()):GetAllComponents()) do
        if (k == "SpellModificationContainer") then
            for i,j in pairs(v) do
                for x,y in pairs(j) do
                    for s1, s2 in pairs(y) do
                        printTable(s2)
                    end
                end
            end
        end
    end
end

function getCharSpellAttributes()
    local x = 0
    for k,v in pairs(Ext.Entity.Get(GetHostCharacter()).SpellBook) do
        if (x == 0) then
        else
            for i,j in ipairs(v) do
                printTable(j)
            end
        end

        x = x + 1
    end
end

function getCharSpellCosts()
    for k,v in pairs(Ext.Entity.Get(GetHostCharacter()).SpellBook) do
        if (k == "Spells") then
            for i,spell in pairs(v) do
                spellName = spell.Id.OriginatorPrototype
                spellCost = Ext.Stats.Get(spellName).UseCosts

                print(spellCost)
            end
        end
    end
end

function findKey(table)
    for k,v in pairs(table) do
        for word in string.gmatch(k, "\bos\b") do
            print(k)
        end
    end
end


-- https://stackoverflow.com/questions/55108794/what-is-the-difference-between-pairs-and-ipairs-in-lua
function sortTable(table)
    local sortedTable = {}

    for k,v in pairs(table) do
        sortedTable[k] = v
    end

    return sortedTable
end


function printTable(table)
    for k,v in pairs(table) do
        print(k, v)
    end
end



-- https://stackoverflow.com/a/73135351/5771107
-- function getSourceCode(f)
--     local t = debug.getinfo (f)

--     if t.linedefined < 0 then
--         print("source",t.source)

--         return
--     end

--     local name = t.source:gsub("^@","")
--     local i = 0
--     local text = {}

--     for line in io.lines(name) do
--         i=i+1

--         if i >= t.linedefined then
--             text[#text+1] = line
--         end

--         if i >= t.lastlinedefined then
--             break
--         end
--     end

--     return table.concat(text,"\n")
-- end



-- -- Doesn't work
-- function _getAllData(t, prevData)
--     local data = prevData or {}

--     for k, v in pairs(t) do
--         data[k] = data[k] or v
--     end

--     local mt = getmetatable(t)

--     if type(mt) ~ = 'table' then
--         return data
--     end

--     local index = mt._index

--     if type(index) ~ = 'table' then
--         return data
--     end

--     return _getAllData(index, data)
-- end



-- -- Doesn't work
-- function _printTable(table, indent)
--     local indent = indent or 0;
--     local keys = {};

--     for k in pairs(table) do
--         keys[#keys+1] = k;
--         table.sort(keys, function(a, b)
--             local ta, tb = type(a), type(b);

--             if (ta ~= tb) then
--                 return ta < tb;
--             else
--                 return a < b;
--             end
--         end);
--     end

--     print(string.rep('  ', indent)..'{');

--     indent = indent + 1;

--     for k, v in pairs(table) do

--         local key = k;

--         if (type(key) == 'string') then
--             if not (string.match(key, '^[A-Za-z_][0-9A-Za-z_]*$')) then
--                 key = "['"..key.."']";
--             end
--         elseif (type(key) == 'number') then
--             key = "["..key.."]";
--         end

--         if (type(v) == 'table') then
--             if (next(v)) then
--                 printf("%s%s =", string.rep('  ', indent), tostring(key));
--                 _printTable(v, indent);
--             else
--                 printf("%s%s = {},", string.rep('  ', indent), tostring(key));
--             end
--         elseif (type(v) == 'string') then
--             printf("%s%s = %s,", string.rep('  ', indent), tostring(key), "'"..v.."'");
--         else
--             printf("%s%s = %s,", string.rep('  ', indent), tostring(key), tostring(v));
--         end
--     end

--     indent = indent - 1;

--     print(string.rep('  ', indent)..'}');
-- end
