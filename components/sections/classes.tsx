"use client";

import { Button, Chip, Separator } from "@heroui/react";
import { ABILITY_KEYS, HIT_DIE_SIDES, type AbilityKey, type CharacterClass } from "@/lib/character";
import { ABILITY_NAMES } from "@/lib/rules";
import { NumberInput, Section, SelectInput, TextInput } from "../fields";
import type { SectionProps } from "./types";

const HIT_DIE_OPTIONS = HIT_DIE_SIDES.map((sides) => ({
  key: String(sides),
  label: `d${sides}`,
}));
const SPELLCASTING_OPTIONS = [
  { key: "none", label: "None" },
  ...ABILITY_KEYS.map((key) => ({ key, label: ABILITY_NAMES[key] })),
];

export function ClassesSection({ character, onChange }: SectionProps) {
  const classes = character.classes ?? [];

  const setClasses = (next: CharacterClass[]) => onChange({ classes: next });
  const updateClass = (index: number, patch: Partial<CharacterClass>) =>
    setClasses(classes.map((c, i) => (i === index ? { ...c, ...patch } : c)));

  return (
    <Section title="Classes">
      {classes.map((cls, i) => (
        <div key={i} className="flex flex-col gap-4">
          {i > 0 && <Separator />}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextInput label="Class" value={cls.name} onChange={(name) => updateClass(i, { name })} />
            <TextInput label="Subclass" value={cls.subtype} onChange={(subtype) => updateClass(i, { subtype })} />
            <NumberInput
              label="Level"
              value={cls.level}
              minValue={1}
              maxValue={20}
              onChange={(level) => updateClass(i, { level })}
            />
            <SelectInput
              label="Hit Die"
              value={cls.hit_die ? String(cls.hit_die) : null}
              options={HIT_DIE_OPTIONS}
              onChange={(die) => updateClass(i, { hit_die: Number(die) })}
            />
            <SelectInput
              label="Spellcasting Ability"
              value={cls.spellcasting || "none"}
              options={SPELLCASTING_OPTIONS}
              onChange={(key) =>
                updateClass(i, {
                  spellcasting: key === "none" ? "" : (key as AbilityKey),
                })
              }
            />
            <div className="flex items-end">
              <Button size="sm" variant="ghost" onPress={() => setClasses(classes.filter((_, j) => j !== i))}>
                Remove class
              </Button>
            </div>
          </div>
          {cls.features && cls.features.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Features</span>
              <div className="flex flex-wrap gap-2">
                {cls.features.map((feature) => (
                  <Chip key={feature.name} title={feature.description ?? undefined}>
                    {feature.name}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      <Button
        size="sm"
        variant="secondary"
        className="self-start"
        onPress={() => setClasses([...classes, { name: "", level: 1 }])}
      >
        Add class
      </Button>
      {character.feats && character.feats.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Feats</span>
          <div className="flex flex-wrap gap-2">
            {character.feats.map((feat) => (
              <Chip key={feat.name} title={feat.description ?? undefined}>
                {feat.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
