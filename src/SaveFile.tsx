export const creatureAdd = (
  file: SaveFile,
  creatureData: CreatureData,
  template: CreatureTemplate,
  creatureName: string,
  personality: Personality) =>
{
  // stashed creature count; if there is no creatures in stash then == 0;
  const creatureCounterValue = getPairValue(file, "NumStaCrits");
  if (creatureCounterValue === "0")
  {
    try
    {
      return creaturePartyAdd(file, creatureData, template, creatureName, personality);
    } catch (error)
    {
      if (error instanceof NoSpaceInPartyError)
      {
        return creatureStashAdd(file, creatureData, template, creatureName, personality);
      } else
      {
        console.error(`Caught an unexpected error: ${error}`);
        throw error;
      }
    }
  } else
  {
    return creatureStashAdd(file, creatureData, template, creatureName, personality);
  }
}

const creatureStashAdd = (
  file: SaveFile,
  creatureData: CreatureData,
  template: CreatureTemplate,
  creatureName: string,
  personality: Personality) =>
{
  // insert anchor for template
  const staCritPattern = /\[StaCrit(\d+)\]\n/
  const staCritMatch = file.contentNew.match(staCritPattern);
  if (!staCritMatch)
  {
    throw new Error('stacritMatch no match found.');
  }
  const creatureCounterValue = getPairValue(file, "NumStaCrits");
  const guidValue = getPairValue(file, "GUID");
  const creatureId = getCreatureId(creatureData, creatureName);

  // first key:value pair must be StaCrit or CurCrit
  const creatureObject = {
    StaCrit: addNumber(staCritMatch[1], 1),
    ...template,
    Personality: personality,
    Nickname: creatureName,
    Constant: creatureId,
    GUID: addNumber(guidValue, 1),
    Slot: "100"
  };

  const creatureComplete = formatTemplateToString(creatureObject) + staCritMatch[0];

  const contentCounterPlus = changeValueByKey(
    file,
    "NumStaCrits",
    addNumber(creatureCounterValue, 1)
  );
  const contentNew = contentCounterPlus.contentNew.replace(
    staCritPattern,
    creatureComplete
  );
  return file.copyWith({ contentNew: contentNew });
}

const creaturePartyAdd = (
  file: SaveFile,
  creatureData: CreatureData,
  template: CreatureTemplate,
  creatureName: string,
  personality: Personality) =>
{
  // insert anchor for template
  const curCritPattern = /\[CurCrit(\d+)\]\n/
  const curCritMatch = file.contentNew.match(curCritPattern);
  if (!curCritMatch)
  {
    throw new Error('stacritMatch no match found.');
  }

  const guidValue = getPairValue(file, "GUID");
  const slotValue = getPairValue(file, "Slot");
  if (parseInt(slotValue, 10) >= 6)
  {
    throw new NoSpaceInPartyError('No free slots in party for new creature.');
  }
  const creatureId = getCreatureId(creatureData, creatureName);

  // first key:value pair must be StaCrit or CurCrit
  const creatureObject = {
    CurCrit: addNumber(curCritMatch[1], 1),
    ...template,
    Personality: personality,
    Nickname: creatureName,
    Constant: creatureId,
    GUID: addNumber(guidValue, 1),
    Slot: addNumber(slotValue, 1)
  };

  const creatureComplete = formatTemplateToString(creatureObject);
  const stringToInsert = creatureComplete + curCritMatch[0];
  const contentNew = file.contentNew.replace(curCritPattern, stringToInsert);
  return file.copyWith({ contentNew: contentNew });
}

const getPairValue = (file: SaveFile, key: string) =>
{
  return splitPairLine(getPairByKey(file, key))[1];
}

class NoSpaceInPartyError extends Error
{
  constructor(message: string)
  {
    super(message);
    this.name = 'NoSpaceInPartyError';
  }
}

const addNumber = (base: string, value: number): string =>
{
  const baseNumber = parseInt(base, 10);
  if (Number.isNaN(baseNumber))
  {
    throw new Error(`base number is invalide: ${base}.`)
  }
  const baseNew = String(baseNumber + value);
  return baseNew;
}

function formatTemplateToString(obj: { [key: string]: string }): string
{
  const entries = Object.entries(obj);

  if (entries.length === 0)
  {
    return '';
  }

  const [firstKey, firstValue] = entries[0];
  const firstEntry = `[${firstKey}${firstValue}]`;

  const restEntries = entries.slice(1)
    .map(([key, value]) => `${key}="${value}"`);

  return [firstEntry, ...restEntries].join('\n') + '\n';
}

export type CreatureTemplate = Record<string, string | null>;

export const addSummon = (
  file: SaveFile,
  creatureData: CreatureData,
  creatureName: string): SaveFile =>
{
  const creatureId = getCreatureId(creatureData, creatureName);
  const [lineKey, lineValue] = splitPairLine(getPairByKey(file, "Summon"));
  const summonArray = lineValue.split(',');
  const summonArrayNew = updateValueAtIndex(
    summonArray,
    parseInt(creatureId, 10),
    "100"
  );
  
  const fileNew = changeValueByKey(file, lineKey, summonArrayNew.join(","));
  return fileNew;
}

const updateValueAtIndex = (arr: any[], index: number, newValue: string): any[] =>
  arr.map((item, i) => (i === index ? newValue : item));

export const addKnowledge = (
  file: SaveFile,
  creatureData: CreatureData,
  creatureName: string,
  knowledge: Knowledge): SaveFile =>
{
  const regexPattern = /\[Knowledge2\]\nArray="(.*)"\n/;
  const matchKnowledge = file.contentNew.match(regexPattern);
  if (matchKnowledge === null)
  {
    throw new Error("Knowledge part was not found.");
  }
  console.log(matchKnowledge);
  const creatureId = getCreatureId(creatureData, creatureName);
  const knowledgeArray = matchKnowledge[1];
  const creaturePatter = new RegExp(`(${creatureId},\\d+),\?`);
  const matchCreature = knowledgeArray.match(creaturePatter);

  const knowledgeArrayNew = matchCreature
    ? knowledgeArray.replace(matchCreature[1], `${creatureId},${knowledge}`)
    : knowledgeArray + `,${creatureId},${knowledge}`;
  const contentNew = file.contentNew.replace(
    regexPattern,
    `[Knowledge2]\nArray="${knowledgeArrayNew}"\n`
  );
  return file.copyWith({ contentNew: contentNew });
}

export type CreatureData = {
  [creatureName: string]: string | null;
};

const getCreatureId = (data: CreatureData, creatureName: string): string =>
{
  const creatureId = data[creatureName];
  if (creatureId === null)
  {
    throw new Error('Data about this creature is missing.')
  }
  return creatureId;
};

export const changeValueByKey = (
  file: SaveFile,
  key: string,
  value: string): SaveFile =>
{
  const regexPattern = new RegExp(`${key}="(.*)"\\n`);
  console.log(file.contentNew.match(regexPattern));
  const contentNew = file.contentNew.replace(
    regexPattern,
    `${key}="${value}"\n`
  );
  return file.copyWith({ contentNew: contentNew });
}

const getPairByKey = (file: SaveFile, key: string): string =>
{
  const regexPattern = new RegExp(`(${key}=".*")\\n`);
  const match = file.contentNew.match(regexPattern);
  if (!match)
  {
    throw new Error('No match found.');
  }
  return match[1];
}

function* getPairAllByKeyGenerator(file: SaveFile, key: string
  ): Generator<RegExpMatchArray, void, unknown>
{
  const regexPattern = new RegExp(`(${key}=".*")\\n`, 'g');
  const matches = file.contentNew.matchAll(regexPattern);

  if (!matches)
  {
    throw new Error('No match found.');
  }

  for (const match of matches)
  {
    yield match;
  }
}

/**
 * key:MaterialQuantity - for materials
 * 
 * key:DustQuantity - for dust
 */
export const replaceValuesByKey = (
  file: SaveFile,
  key: string,
  value: string): SaveFile =>
{
  const fileNew = file.contentNew.replaceAll(
    new RegExp(`${key}="(\\d+)"`, 'g'),
    `${key}="${value}"`
  )
  return file.copyWith({ contentNew: fileNew });
}

export const encodeFile = (file: SaveFile): SaveFile =>
{
  const text: string[] = splitLines(file.contentNew);
  const output: string[] = text
    .map((line: string) =>
    {
      return convertLine(
        line,
        checkLineType(line),
        ConvertType.ENCODE
      )
    })
    .filter((el) => el !== null) as string[];

  return file.copyWith({ contentNew: output.join('\n') });
};

export const decodeFile = (file: SaveFile): SaveFile =>
{
  const text: string[] = splitLines(file.contentNew);
  const output: string[] = text
    .map((line: string) =>
    {
      return convertLine(
        line,
        checkLineType(line),
        ConvertType.DECODE
      )
    })
    .filter((el) => el !== null) as string[];
  return file.copyWith({ contentNew: output.join('\n') });
};

enum ConvertType
{
  ENCODE = "ENCODE",
  DECODE = "DECODE"
}

enum LineType
{
  BLOCK = "BLOCK",
  PAIR = "PAIR",
  NULL = "NULL"
}

export enum Knowledge
{
  "S" = "10000",
  "A" = "5000",
  "B" = "2000",
  "C" = "1000",
  "D" = "100",
  "E" = "10",
  "F" = "1",
}
/**
 *
  H - health
  A - attack
  D - defense
  I - intelligence
  S - speed
 */
export enum Personality
{
  "HA" = "0",
  "HD" = "1",
  "HI" = "2",
  "HS" = "3",
  "AH" = "4",
  "AD" = "5",
  "AI" = "6",
  "AS" = "7",
  "DH" = "8",
  "DA" = "9",
  "DI" = "10",
  "DS" = "11",
  "IH" = "12",
  "IA" = "13",
  "ID" = "14",
  "IS" = "15",
  "SH" = "16",
  "SA" = "17",
  "SD" = "18",
  "SI" = "19",
  "NULL" = "20",
}

export const isFileEncoded = (file: string) =>
{
  if (file.includes('\x9a'))
  {
    return true;
  } else
  {
    return false;
  }
}

const checkLineType = (line: string): LineType =>
{
  if (line[0] === "[")
  {
    return LineType.BLOCK;
  } else if (line[line.length - 1] === '"')
  {
    return LineType.PAIR;
  } else
  {
    return LineType.NULL;
  }
}

function convertLine(
  line: string,
  lineType: LineType,
  encode: ConvertType): string | null
{
  let lineNew: string;
  let lineConverted: string;

  switch (lineType)
  {
    case LineType.BLOCK:
      lineNew = line.slice(1, -1);
      lineConverted = encryption(lineNew, encode);
      lineConverted = `[${lineConverted}]`
      break;

    case LineType.PAIR:
      let [lineKey, lineValue] = splitPairLine(line);
      let lineKeyConverted = encryption(lineKey, encode);
      let lineValueConverted = encryption(lineValue, encode);
      lineConverted = makePairLine(lineKeyConverted, lineValueConverted);
      break;

    default:
      return null;
  }
  return lineConverted;
}

const ENCRYPTION_KEY = "QWERTY";
const encryption = (line: string, type: ConvertType): string =>
{
  if (line.length === 0)
  {
    return '';
  }

  const KEY_MAX_INDEX = ENCRYPTION_KEY.length;

  const output: string[] = Array.from(line).map((char, i) =>
  {
    const codePointInput = char.charCodeAt(0);
    const keyChar = ENCRYPTION_KEY[i % KEY_MAX_INDEX];
    if (keyChar === undefined)
    {
      throw new Error('keyChar is undefined');
    }
    const codePointKey = keyChar.codePointAt(0);
    if (codePointKey === undefined)
    {
      throw new Error('codePointKey is undefined');
    }

    if (type === ConvertType.ENCODE)
    {
      return String.fromCodePoint(codePointInput + codePointKey);
    } else if (type === ConvertType.DECODE)
    {
      return String.fromCodePoint(codePointInput - codePointKey);
    } else
    {
      throw new Error("Wrong transformation type.");
    }
  });

  return output.join('');
};

const splitPairLine = (line: string): string[] =>
{
  const lineSplited = line.split("=");
  const lineKey = lineSplited[0];
  const lineValue = lineSplited[1].slice(1, -1);
  if (lineValue[-1] === '"')
  {
    throw new Error('Maybe line with new line at the end?');
  }
  return [lineKey, lineValue];
}

const makePairLine = (key: string, value: string): string =>
{
  if (value[0] === '"' || value[-1] === '"')
  {
    throw new Error('value has double quotes at the start/end.');
  }
  return `${key}="${value}"`;
}

const splitLines = (text: string): string[] => text.split(/\r?\n/);

interface CopyWithProps
{
  name?: string | null;
  contentOriginal?: string | null;
  contentNew?: string | null;
}

export class SaveFile
{
  public name: string;
  public contentOriginal: string;
  public contentNew: string;

  constructor(name: string, contentOriginal: string, contentNew: string)
  {
    this.name = name;
    this.contentOriginal = contentOriginal;
    this.contentNew = contentNew;
  }

  /**
   * copyWith -- used to create new instance of the object SaveFile 
   * with updated values provided to the method
   */
  public copyWith({ name, contentOriginal, contentNew }: CopyWithProps): SaveFile
  {
    const updatedName = name ?? this.name;
    const updatedOriginal = contentOriginal ?? this.contentOriginal;
    const updatedNew = contentNew ?? this.contentNew;

    return new SaveFile(updatedName, updatedOriginal, updatedNew);
  }
}