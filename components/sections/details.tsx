"use client";

import type { Details, Treasure } from "@/lib/character";
import { NumberInput, Section, TextInput } from "../fields";
import type { SectionProps } from "./types";

const SHORT_FIELDS: { key: keyof Details; label: string }[] = [
  { key: "height", label: "Height" },
  { key: "eyes", label: "Eyes" },
  { key: "hair", label: "Hair" },
  { key: "skin", label: "Skin" },
];

const LONG_FIELDS: { key: keyof Details; label: string }[] = [
  { key: "personality", label: "Personality Traits" },
  { key: "ideal", label: "Ideals" },
  { key: "bond", label: "Bonds" },
  { key: "flaw", label: "Flaws" },
  { key: "physical", label: "Physical Description" },
  { key: "backstory", label: "Backstory" },
];

const COINS: { key: keyof Treasure; label: string }[] = [
  { key: "pp", label: "Platinum" },
  { key: "gp", label: "Gold" },
  { key: "ep", label: "Electrum" },
  { key: "sp", label: "Silver" },
  { key: "cp", label: "Copper" },
];

export function DetailsSection({ character, onChange }: SectionProps) {
  const details = character.details ?? {};
  const treasure = character.treasure ?? {};
  const setDetail = (patch: Details) => onChange({ details: { ...details, ...patch } });

  return (
    <Section title="Details & Treasure" className="lg:col-span-2">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <NumberInput label="Age" value={details.age} minValue={0} onChange={(age) => setDetail({ age })} />
        <NumberInput
          label="Weight (lb)"
          value={details.weight}
          minValue={0}
          onChange={(weight) => setDetail({ weight })}
        />
        {SHORT_FIELDS.map(({ key, label }) => (
          <TextInput
            key={key}
            label={label}
            value={details[key] as string | null | undefined}
            onChange={(value) => setDetail({ [key]: value })}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LONG_FIELDS.map(({ key, label }) => (
          <TextInput
            key={key}
            label={label}
            multiline
            value={details[key] as string | null | undefined}
            onChange={(value) => setDetail({ [key]: value })}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {COINS.map(({ key, label }) => (
          <NumberInput
            key={key}
            label={label}
            value={treasure[key]}
            minValue={0}
            onChange={(value) => onChange({ treasure: { ...treasure, [key]: value } })}
          />
        ))}
      </div>
    </Section>
  );
}
