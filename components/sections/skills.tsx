"use client";

import { SKILL_KEYS } from "@/lib/character";
import {
  SKILL_ABILITY,
  abilityModifier,
  formatModifier,
  isProficient,
  proficiencyBonus,
  skillLabel,
  totalLevel,
} from "@/lib/rules";
import { CheckboxInput, Section } from "../fields";
import type { SectionProps } from "./types";

export function SkillsSection({ character, onChange }: SectionProps) {
  const skills = character.skills ?? {};
  const prof = proficiencyBonus(totalLevel(character.classes));

  return (
    <Section title="Skills" description="Checked skills add the proficiency bonus.">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SKILL_KEYS.map((skill) => {
          const ability = SKILL_ABILITY[skill];
          const proficient = isProficient(skills[skill]);
          const bonus = abilityModifier(character.ability_scores[ability]) + (proficient ? prof : 0);
          return (
            <CheckboxInput
              key={skill}
              isSelected={proficient}
              onChange={(value) => onChange({ skills: { ...skills, [skill]: value } })}
              label={
                <span className="flex gap-2">
                  <span className="w-8 font-mono">{formatModifier(bonus)}</span>
                  <span>{skillLabel(skill)}</span>
                  <span className="text-muted uppercase">{ability}</span>
                </span>
              }
            />
          );
        })}
      </div>
    </Section>
  );
}
