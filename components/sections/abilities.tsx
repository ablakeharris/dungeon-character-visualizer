"use client";

import { ABILITY_KEYS } from "@/lib/character";
import {
  ABILITY_NAMES,
  abilityModifier,
  formatModifier,
  isProficient,
  proficiencyBonus,
  totalLevel,
} from "@/lib/rules";
import { CheckboxInput, NumberInput, Section } from "../fields";
import type { SectionProps } from "./types";

export function AbilitiesSection({ character, onChange }: SectionProps) {
  const scores = character.ability_scores;
  const saves = character.saving_throws ?? {};
  const prof = proficiencyBonus(totalLevel(character.classes));

  return (
    <Section title="Ability Scores & Saving Throws">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ABILITY_KEYS.map((key) => {
          const mod = abilityModifier(scores[key]);
          const proficient = isProficient(saves[key]);
          return (
            <div key={key} className="flex flex-col gap-2 rounded-xl border border-border p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">{ABILITY_NAMES[key]}</span>
                <span className="text-2xl font-semibold">{formatModifier(mod)}</span>
              </div>
              <NumberInput
                label="Score"
                value={scores[key]}
                minValue={0}
                maxValue={30}
                onChange={(value) => onChange({ ability_scores: { ...scores, [key]: value } })}
              />
              <CheckboxInput
                label={`Save ${formatModifier(mod + (proficient ? prof : 0))}`}
                isSelected={proficient}
                onChange={(value) => onChange({ saving_throws: { ...saves, [key]: value } })}
              />
            </div>
          );
        })}
      </div>
    </Section>
  );
}
