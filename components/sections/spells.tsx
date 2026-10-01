"use client";

import { Accordion, Chip } from "@heroui/react";
import { Section } from "../fields";
import type { SectionProps } from "./types";

function Property({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export function SpellsSection({ character }: Pick<SectionProps, "character">) {
  const spells = character.spells ?? [];

  return (
    <Section title="Spells" description={`${spells.length} known`}>
      {spells.length === 0 ? (
        <p className="text-sm text-muted">No spells.</p>
      ) : (
        <Accordion allowsMultipleExpanded>
          {spells.map((spell) => (
            <Accordion.Item key={spell.name} id={spell.name}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  <span className="flex flex-1 flex-wrap items-center gap-2">
                    <span className="font-medium">{spell.name}</span>
                    <span className="text-sm text-muted">{spell.level}</span>
                    {spell.concentration && <Chip size="sm">Concentration</Chip>}
                    {spell.ritual && <Chip size="sm">Ritual</Chip>}
                  </span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Property label="Casting Time" value={spell.casting_time} />
                    <Property label="Range / Area" value={spell.range_area} />
                    <Property label="Duration" value={spell.duration} />
                    <Property label="Components" value={spell.components.join(", ")} />
                    <Property label="School" value={spell.school} />
                    <Property label="Attack / Save" value={spell.attack_save} />
                    <Property label="Damage / Effect" value={spell.damage_effect} />
                    <Property label="Material" value={spell.material} />
                  </div>
                  <p className="text-sm">{spell.description}</p>
                  {spell.higher_level && (
                    <p className="text-sm">
                      <span className="font-medium">At Higher Levels. </span>
                      {spell.higher_level}
                    </p>
                  )}
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Section>
  );
}
