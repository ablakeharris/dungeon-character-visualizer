"use client";

import { Button } from "@heroui/react";
import { DICE_SIDES, type Dice, type Speed } from "@/lib/character";
import { abilityModifier, formatModifier, proficiencyBonus, totalLevel } from "@/lib/rules";
import { NumberInput, Section, SelectInput, SwitchInput, TextInput } from "../fields";
import type { SectionProps } from "./types";

const DIE_OPTIONS = DICE_SIDES.map((sides) => ({
  key: String(sides),
  label: `d${sides}`,
}));

const SPEED_KEYS = ["Walk", "Burrow", "Climb", "Fly", "Swim"] as const;

/** Speeds other than Walk may be `false` in the schema; treat that as 0 ft. */
function speedValue(value: Speed[keyof Speed]): number {
  return typeof value === "number" ? value : 0;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-default px-4 py-2">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

export function CombatSection({ character, onChange }: SectionProps) {
  const { armor_class: ac, hit_points: hp, speed } = character;
  const dice = hp.dice ?? [];
  const level = totalLevel(character.classes);

  const setDice = (next: Dice[]) => onChange({ hit_points: { ...hp, dice: next } });
  const updateDie = (index: number, patch: Partial<Dice>) =>
    setDice(dice.map((d, i) => (i === index ? { ...d, ...patch } : d)));

  return (
    <Section title="Combat">
      <div className="flex flex-wrap gap-3">
        <Stat label="Level" value={level} />
        <Stat label="Proficiency" value={formatModifier(proficiencyBonus(level))} />
        <Stat label="Initiative" value={formatModifier(abilityModifier(character.ability_scores.dex))} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NumberInput
          label="Armor Class"
          value={ac.value}
          minValue={0}
          onChange={(value) => onChange({ armor_class: { ...ac, value } })}
        />
        <TextInput
          label="Armor Description"
          className="sm:col-span-2"
          value={ac.description}
          onChange={(description) => onChange({ armor_class: { ...ac, description } })}
        />
      </div>
      <SwitchInput
        label="Using a shield"
        isSelected={Boolean(character.shield)}
        onChange={(shield) => onChange({ shield })}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NumberInput
          label="Max HP"
          value={hp.max}
          minValue={0}
          onChange={(max) => onChange({ hit_points: { ...hp, max } })}
        />
        <NumberInput
          label="Current HP"
          value={hp.current ?? hp.max}
          onChange={(current) => onChange({ hit_points: { ...hp, current } })}
        />
        <NumberInput
          label="Temporary HP"
          value={hp.temporary}
          minValue={0}
          onChange={(temporary) => onChange({ hit_points: { ...hp, temporary } })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Hit Dice</span>
        {dice.map((die, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2">
            <NumberInput
              label="Count"
              value={die.count ?? 1}
              minValue={1}
              maxValue={60}
              onChange={(count) => updateDie(i, { count })}
            />
            <SelectInput
              label="Die"
              value={String(die.sides ?? 4)}
              options={DIE_OPTIONS}
              onChange={(sides) => updateDie(i, { sides: Number(sides) })}
            />
            <NumberInput label="Mod" value={die.mod} onChange={(mod) => updateDie(i, { mod })} />
            <Button size="sm" variant="ghost" onPress={() => setDice(dice.filter((_, j) => j !== i))}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="secondary"
          className="self-start"
          onPress={() => setDice([...dice, { count: 1, sides: 8, mod: 0 }])}
        >
          Add hit dice
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {SPEED_KEYS.map((key) => (
          <NumberInput
            key={key}
            label={`${key} (ft)`}
            value={speedValue(speed[key])}
            minValue={0}
            step={5}
            onChange={(value) => onChange({ speed: { ...speed, [key]: value } })}
          />
        ))}
      </div>
      <SwitchInput
        label="Can hover"
        isSelected={Boolean(speed.Hover)}
        onChange={(Hover) => onChange({ speed: { ...speed, Hover } })}
      />
    </Section>
  );
}
