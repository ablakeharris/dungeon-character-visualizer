import type { AbilityKey, CharacterClass, Proficiency, SkillKey } from "./character";

export const ABILITY_NAMES: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

export const SKILL_ABILITY: Record<SkillKey, AbilityKey> = {
  Athletics: "str",
  Acrobatics: "dex",
  SleightOfHand: "dex",
  Stealth: "dex",
  Arcana: "int",
  History: "int",
  Investigation: "int",
  Nature: "int",
  Religion: "int",
  AnimalHandling: "wis",
  Insight: "wis",
  Medicine: "wis",
  Perception: "wis",
  Survival: "wis",
  Deception: "cha",
  Intimidation: "cha",
  Performance: "cha",
  Persuasion: "cha",
};

/** "SleightOfHand" -> "Sleight of Hand" */
export function skillLabel(skill: SkillKey): string {
  return skill.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/ Of /g, " of ");
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function totalLevel(classes: CharacterClass[] | null | undefined): number {
  return (classes ?? []).reduce((sum, c) => sum + (c.level || 0), 0);
}

export function proficiencyBonus(level: number): number {
  return 2 + Math.floor((Math.max(level, 1) - 1) / 4);
}

/** Skills and saves may be `true` or a numeric override; either means proficient. */
export function isProficient(value: Proficiency | undefined): boolean {
  return typeof value === "number" ? value !== 0 : Boolean(value);
}
