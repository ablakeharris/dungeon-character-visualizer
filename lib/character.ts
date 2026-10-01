// TypeScript mirror of the `DD5ECharacter` Pydantic model produced by the
// dungeon-master-helper character creator agent
// (dnd_agent/generated_models/Character_schema.py and its imports).

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export const ABILITY_KEYS: readonly AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];

export const SIZES = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"] as const;
export type Size = (typeof SIZES)[number];

export const HIT_DIE_SIDES = [1, 2, 4, 6, 8, 10, 12, 20] as const;
export const DICE_SIDES = [1, 4, 6, 8, 10, 12, 20, 100] as const;

export const SPELL_COMPONENTS = ["V", "S", "M", "F", "DF", "XP"] as const;
export type SpellComponent = (typeof SPELL_COMPONENTS)[number];

export const SKILL_KEYS = [
  "Athletics",
  "Acrobatics",
  "SleightOfHand",
  "Stealth",
  "Arcana",
  "History",
  "Investigation",
  "Nature",
  "Religion",
  "AnimalHandling",
  "Insight",
  "Medicine",
  "Perception",
  "Survival",
  "Deception",
  "Intimidation",
  "Performance",
  "Persuasion",
] as const;
export type SkillKey = (typeof SKILL_KEYS)[number];

export const SENSE_KEYS = ["Blindsight", "Darkvision", "Tremorsense", "Truesight"] as const;
export type SenseKey = (typeof SENSE_KEYS)[number];

/** Skills and saving throws accept `true`/`false` or a numeric bonus. */
export type Proficiency = boolean | number | null;

export interface Source {
  text: string;
  note?: string | null;
  href?: string | null;
}

export interface Dice {
  sides?: number | null;
  count?: number | null;
  mod?: number | null;
}

export interface Feature {
  name: string;
  description?: string | null;
  source?: Source | null;
}

export interface CreatureAction {
  name: string;
  description: string;
  attack_bonus?: number | null;
  damage_dice?: Dice | null;
  damage_bonus?: number | null;
  legendary?: boolean | null;
  reaction?: boolean | null;
  source?: Source | null;
}

export type Senses = Partial<Record<SenseKey, boolean | string | null>>;

export interface Speed {
  Walk?: number | null;
  Burrow?: number | boolean | null;
  Climb?: number | boolean | null;
  Fly?: number | boolean | null;
  Hover?: boolean | null;
  Swim?: number | boolean | null;
}

export interface HitPoints {
  max?: number | null;
  current?: number | null;
  temporary?: number | null;
  dice?: Dice[] | null;
  description?: string | null;
}

export type AbilityScores = Record<AbilityKey, number>;
export type SavingThrows = Partial<Record<AbilityKey, Proficiency>>;
export type Skills = Partial<Record<SkillKey, Proficiency>>;

export interface ArmorClass {
  value?: number | null;
  description?: string | null;
}

export interface Image {
  uri?: string | null;
  alt: string;
  caption?: string | null;
  source?: Source | null;
}

export interface Player {
  name: string;
  id?: string | null;
}

export interface Race {
  name: string;
  subtype?: string | null;
  size?: Size | null;
  traits?: Feature[] | null;
  actions?: CreatureAction[] | null;
  senses?: Senses | null;
  source?: Source | null;
}

export interface CharacterClass {
  name: string;
  level: number;
  subtype?: string | null;
  hit_die?: number | null;
  spellcasting?: AbilityKey | "" | null;
  features?: Feature[] | null;
  source?: Source | null;
}

export interface Background {
  name: string;
  option?: string | null;
  description?: string | null;
  source?: Source | null;
}

export interface Details {
  age?: number | null;
  eyes?: string | null;
  hair?: string | null;
  skin?: string | null;
  weight?: number | null;
  height?: string | null;
  personality?: string | null;
  ideal?: string | null;
  bond?: string | null;
  flaw?: string | null;
  backstory?: string | null;
  physical?: string | null;
}

export interface Spell {
  name: string;
  description: string;
  higher_level?: string | null;
  level: string;
  casting_time: string;
  range_area: string;
  components: SpellComponent[];
  material?: string | null;
  ritual?: boolean | null;
  concentration?: boolean | null;
  duration: string;
  school?: string | null;
  attack_save?: string | null;
  damage_effect?: string | null;
  tags?: string[] | null;
  source?: Source | null;
}

export interface PhysicalItem {
  name: string;
  weight?: number | null;
  description?: string | null;
  magic?: boolean | null;
  source?: Source | null;
}

export interface Equipment extends PhysicalItem {
  quantity?: number | null;
}

export interface Weapon extends PhysicalItem {
  category?: string | null;
  damage: { dice?: Dice | null; type?: string | null };
  versatile_damage?: { dice?: Dice | null } | null;
  range?: { normal?: number | null; long?: number | null } | null;
  throw_range?: { normal?: number | null; long?: number | null } | null;
  properties?: Record<string, boolean | string | null> | null;
  equipped?: boolean | null;
}

export interface Treasure {
  pp?: number | null;
  ep?: number | null;
  gp?: number | null;
  sp?: number | null;
  cp?: number | null;
}

export interface DD5ECharacter {
  // DD5ECreature
  name: string;
  alignment?: string | null;
  speed: Speed;
  hit_points: HitPoints;
  inspiration?: string | null;
  skills?: Skills | null;
  languages?: string[] | null;
  ability_scores: AbilityScores;
  saving_throws?: SavingThrows | null;
  senses?: Senses | null;
  description?: string | null;
  armor_class: ArmorClass;
  shield?: boolean | null;
  conditions?: Record<string, boolean | null> | null;
  condition_immunities?: string[] | null;
  damage_immunities?: string[] | null;
  damage_resistances?: string[] | null;
  damage_vulnerabilities?: string[] | null;
  image?: Image | null;
  source?: Source | null;
  // DD5ECharacter
  nickname?: string | null;
  player: Player;
  xp?: number | null;
  race: Race;
  classes?: CharacterClass[] | null;
  background?: Background | null;
  details?: Details | null;
  weapon_proficiencies?: string[] | null;
  armor_proficiencies?: string[] | null;
  tool_proficiencies?: string[] | null;
  feats?: Feature[] | null;
  spells?: Spell[] | null;
  weapons?: Weapon[] | null;
  equipment?: Equipment[] | null;
  treasure?: Treasure | null;
}

export function emptyCharacter(): DD5ECharacter {
  return {
    name: "",
    speed: { Walk: 30 },
    hit_points: { max: 0, current: 0 },
    ability_scores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    armor_class: { value: 10, description: "Unarmored" },
    player: { name: "" },
    race: { name: "", size: "Medium" },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates the fields the Pydantic model marks as required and returns the
 * parsed character. Optional fields are passed through untouched.
 */
export function parseCharacter(text: string): DD5ECharacter {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(`Invalid JSON: ${(err as Error).message}`);
  }
  if (!isRecord(data)) {
    throw new Error("Expected a JSON object at the top level.");
  }

  const problems: string[] = [];
  if (typeof data.name !== "string") problems.push("`name` must be a string");
  for (const key of ["speed", "hit_points", "armor_class", "player", "race"]) {
    if (!isRecord(data[key])) problems.push(`\`${key}\` must be an object`);
  }
  if (isRecord(data.race) && typeof data.race.name !== "string") {
    problems.push("`race.name` must be a string");
  }
  if (isRecord(data.ability_scores)) {
    for (const key of ABILITY_KEYS) {
      if (typeof data.ability_scores[key] !== "number") {
        problems.push(`\`ability_scores.${key}\` must be a number`);
      }
    }
  } else {
    problems.push("`ability_scores` must be an object");
  }

  if (problems.length > 0) {
    throw new Error(`Not a DD5ECharacter: ${problems.join("; ")}.`);
  }
  return data as unknown as DD5ECharacter;
}
