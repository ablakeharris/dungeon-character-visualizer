"use client";

import { Chip } from "@heroui/react";
import { SIZES, type Size } from "@/lib/character";
import { NumberInput, Section, SelectInput, TextInput } from "../fields";
import type { SectionProps } from "./types";

const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
  "Unaligned",
];

const SIZE_OPTIONS = SIZES.map((size) => ({ key: size, label: size }));

export function IdentitySection({ character, onChange }: SectionProps) {
  const { race, background, player } = character;
  const alignment = character.alignment ?? "";
  // Keep non-standard alignments from the agent selectable instead of dropping them.
  const alignmentOptions = (alignment && !ALIGNMENTS.includes(alignment) ? [...ALIGNMENTS, alignment] : ALIGNMENTS).map(
    (a) => ({ key: a, label: a }),
  );

  return (
    <Section title="Identity" className="lg:col-span-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TextInput label="Name" value={character.name} onChange={(name) => onChange({ name })} />
        <TextInput label="Nickname" value={character.nickname} onChange={(nickname) => onChange({ nickname })} />
        <TextInput label="Player" value={player.name} onChange={(name) => onChange({ player: { ...player, name } })} />
        <NumberInput label="Experience Points" value={character.xp} minValue={0} onChange={(xp) => onChange({ xp })} />
        <SelectInput
          label="Alignment"
          value={alignment}
          options={alignmentOptions}
          onChange={(value) => onChange({ alignment: value })}
        />
        <TextInput label="Race" value={race.name} onChange={(name) => onChange({ race: { ...race, name } })} />
        <TextInput
          label="Subrace"
          value={race.subtype}
          onChange={(subtype) => onChange({ race: { ...race, subtype } })}
        />
        <SelectInput
          label="Size"
          value={race.size}
          options={SIZE_OPTIONS}
          onChange={(size) => onChange({ race: { ...race, size: size as Size } })}
        />
        <TextInput
          label="Background"
          value={background?.name}
          onChange={(name) => onChange({ background: { ...background, name } })}
        />
        <TextInput
          label="Background Option"
          value={background?.option}
          onChange={(option) =>
            onChange({
              background: {
                ...background,
                name: background?.name ?? "",
                option,
              },
            })
          }
        />
      </div>
      {race.traits && race.traits.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Racial Traits</span>
          <div className="flex flex-wrap gap-2">
            {race.traits.map((trait) => (
              <Chip key={trait.name} title={trait.description ?? undefined}>
                {trait.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
