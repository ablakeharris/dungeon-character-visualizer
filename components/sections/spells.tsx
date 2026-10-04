"use client";

import { Accordion, Chip, Button } from "@heroui/react";
import { useState } from "react";
import type { Spell, SpellComponent } from "@/lib/character";
import { Section, TextInput, CheckboxInput, StringListInput } from "../fields";
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

function AddSpellForm({ onAdd }: { onAdd: (spell: Spell) => void }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Cantrip");
  const [castingTime, setCastingTime] = useState("");
  const [rangeArea, setRangeArea] = useState("");
  const [duration, setDuration] = useState("");
  const [school, setSchool] = useState("");
  const [attackSave, setAttackSave] = useState("");
  const [damageEffect, setDamageEffect] = useState("");
  const [description, setDescription] = useState("");
  const [components, setComponents] = useState<string[]>([]);
  const [material, setMaterial] = useState("");
  const [ritual, setRitual] = useState(false);
  const [concentration, setConcentration] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      level: level.trim(),
      casting_time: castingTime.trim(),
      range_area: rangeArea.trim(),
      duration: duration.trim(),
      school: school.trim() || null,
      attack_save: attackSave.trim() || null,
      damage_effect: damageEffect.trim() || null,
      description: description.trim(),
      components: components as SpellComponent[],
      material: material.trim() || null,
      ritual,
      concentration,
    });
    // reset
    setName("");
    setLevel("Cantrip");
    setCastingTime("");
    setRangeArea("");
    setDuration("");
    setSchool("");
    setAttackSave("");
    setDamageEffect("");
    setDescription("");
    setComponents([]);
    setMaterial("");
    setRitual(false);
    setConcentration(false);
  };

  return (
    <div className="flex flex-col gap-4 mt-4 border-t pt-4 border-default-200">
      <div className="font-medium">Add Spell</div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Name" value={name} onChange={setName} />
        <TextInput label="Level" value={level} onChange={setLevel} />
        <TextInput label="Casting Time" value={castingTime} onChange={setCastingTime} />
        <TextInput label="Range / Area" value={rangeArea} onChange={setRangeArea} />
        <TextInput label="Duration" value={duration} onChange={setDuration} />
        <TextInput label="School" value={school} onChange={setSchool} />
        <TextInput label="Attack / Save" value={attackSave} onChange={setAttackSave} />
        <TextInput label="Damage / Effect" value={damageEffect} onChange={setDamageEffect} />
        <StringListInput label="Components" values={components} onChange={setComponents} />
        <TextInput label="Material" value={material} onChange={setMaterial} />
        <div className="flex gap-4 items-center">
          <CheckboxInput label="Ritual" isSelected={ritual} onChange={setRitual} />
          <CheckboxInput label="Concentration" isSelected={concentration} onChange={setConcentration} />
        </div>
        <TextInput className="col-span-2" label="Description" value={description} onChange={setDescription} multiline />
      </div>
      <Button onPress={handleAdd} isDisabled={!name.trim()}>
        Add Spell
      </Button>
    </div>
  );
}

export function SpellsSection({ character, onChange }: Pick<SectionProps, "character" | "onChange">) {
  const spells = character.spells ?? [];

  const handleRemoveSpell = (index: number) => {
    const newSpells = [...spells];
    newSpells.splice(index, 1);
    onChange({ spells: newSpells });
  };

  const handleAddSpell = (spell: Spell) => {
    onChange({ spells: [...spells, spell] });
  };

  return (
    <Section title="Spells" description={`${spells.length} known`}>
      {spells.length === 0 ? (
        <p className="text-sm text-muted">No spells.</p>
      ) : (
        <Accordion allowsMultipleExpanded>
          {spells.map((spell, i) => (
            <Accordion.Item key={i} id={String(i)}>
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
                  <div className="mt-2">
                    <Button size="sm" variant="ghost" onPress={() => handleRemoveSpell(i)}>
                      Delete Spell
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <AddSpellForm onAdd={handleAddSpell} />
    </Section>
  );
}
