"use client";

import { Section, StringListInput } from "../fields";
import type { SectionProps } from "./types";

export function ProficienciesSection({ character, onChange }: SectionProps) {
  return (
    <Section title="Proficiencies & Languages">
      <StringListInput
        label="Languages"
        values={character.languages}
        onChange={(languages) => onChange({ languages })}
      />
      <StringListInput
        label="Weapons"
        values={character.weapon_proficiencies}
        onChange={(weapon_proficiencies) => onChange({ weapon_proficiencies })}
      />
      <StringListInput
        label="Armor"
        values={character.armor_proficiencies}
        onChange={(armor_proficiencies) => onChange({ armor_proficiencies })}
      />
      <StringListInput
        label="Tools"
        values={character.tool_proficiencies}
        onChange={(tool_proficiencies) => onChange({ tool_proficiencies })}
      />
    </Section>
  );
}
