"use client";

import { Chip, Table, Button } from "@heroui/react";
import { useState } from "react";
import type { Dice, Weapon, Equipment } from "@/lib/character";
import { Section, TextInput, NumberInput, CheckboxInput, SelectInput } from "../fields";
import type { SectionProps } from "./types";

function formatDice(dice: Dice | null | undefined): string {
  if (!dice) return "—";
  const mod = dice.mod ? (dice.mod > 0 ? `+${dice.mod}` : `${dice.mod}`) : "";
  return `${dice.count ?? 1}d${dice.sides ?? 4}${mod}`;
}

function AddWeaponForm({ onAdd }: { onAdd: (weapon: Weapon) => void }) {
  const [name, setName] = useState("");
  const [diceCount, setDiceCount] = useState(1);
  const [diceSides, setDiceSides] = useState("6");
  const [damageType, setDamageType] = useState("");
  const [category, setCategory] = useState("");
  const [isMagic, setIsMagic] = useState(false);
  const [isEquipped, setIsEquipped] = useState(true);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      category: category.trim() || null,
      damage: {
        dice: { count: diceCount, sides: Number(diceSides), mod: null },
        type: damageType.trim() || null,
      },
      magic: isMagic,
      equipped: isEquipped,
    });
    setName("");
    setDiceCount(1);
    setDamageType("");
    setCategory("");
    setIsMagic(false);
  };

  return (
    <div className="flex flex-col gap-4 mt-4 border-t pt-4 border-default-200">
      <div className="font-medium">Add Weapon</div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Name" value={name} onChange={setName} />
        <TextInput label="Category" value={category} onChange={setCategory} />
        <NumberInput label="Dice Count" value={diceCount} onChange={setDiceCount} minValue={1} />
        <SelectInput
          label="Dice Sides"
          value={diceSides}
          onChange={setDiceSides}
          options={[4, 6, 8, 10, 12, 20].map((n) => ({ key: String(n), label: `d${n}` }))}
        />
        <TextInput label="Damage Type" value={damageType} onChange={setDamageType} />
        <div className="flex gap-4 items-center">
          <CheckboxInput label="Magic" isSelected={isMagic} onChange={setIsMagic} />
          <CheckboxInput label="Equipped" isSelected={isEquipped} onChange={setIsEquipped} />
        </div>
      </div>
      <Button onPress={handleAdd} isDisabled={!name.trim()}>
        Add Weapon
      </Button>
    </div>
  );
}

function AddEquipmentForm({ onAdd }: { onAdd: (item: Equipment) => void }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(0);
  const [description, setDescription] = useState("");
  const [isMagic, setIsMagic] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      quantity,
      weight,
      description: description.trim() || null,
      magic: isMagic,
    });
    setName("");
    setQuantity(1);
    setWeight(0);
    setDescription("");
    setIsMagic(false);
  };

  return (
    <div className="flex flex-col gap-4 mt-4 border-t pt-4 border-default-200">
      <div className="font-medium">Add Equipment</div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Name" value={name} onChange={setName} />
        <NumberInput label="Quantity" value={quantity} onChange={setQuantity} minValue={1} />
        <NumberInput label="Weight (lb)" value={weight} onChange={setWeight} minValue={0} step={0.5} />
        <div className="flex gap-4 items-center">
          <CheckboxInput label="Magic" isSelected={isMagic} onChange={setIsMagic} />
        </div>
        <TextInput className="col-span-2" label="Description" value={description} onChange={setDescription} multiline />
      </div>
      <Button onPress={handleAdd} isDisabled={!name.trim()}>
        Add Equipment
      </Button>
    </div>
  );
}

export function EquipmentSection({ character, onChange }: Pick<SectionProps, "character" | "onChange">) {
  const equipment = character.equipment ?? [];
  const weapons = character.weapons ?? [];

  const handleRemoveWeapon = (index: number) => {
    const newWeapons = [...weapons];
    newWeapons.splice(index, 1);
    onChange({ weapons: newWeapons });
  };

  const handleAddWeapon = (weapon: Weapon) => {
    onChange({ weapons: [...weapons, weapon] });
  };

  const handleRemoveEquipment = (index: number) => {
    const newEquipment = [...equipment];
    newEquipment.splice(index, 1);
    onChange({ equipment: newEquipment });
  };

  const handleAddEquipment = (item: Equipment) => {
    onChange({ equipment: [...equipment, item] });
  };

  return (
    <Section title="Equipment">
      {weapons.length > 0 && (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Weapons">
              <Table.Header>
                <Table.Column isRowHeader>Weapon</Table.Column>
                <Table.Column>Damage</Table.Column>
                <Table.Column>Category</Table.Column>
                <Table.Column>Equipped</Table.Column>
                <Table.Column aria-label="Actions" />
              </Table.Header>
              <Table.Body>
                {weapons.map((weapon, i) => (
                  <Table.Row key={i} id={i}>
                    <Table.Cell>
                      {weapon.name}
                      {weapon.magic && (
                        <Chip size="sm" className="ml-2">
                          Magic
                        </Chip>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {formatDice(weapon.damage.dice)} {weapon.damage.type ?? ""}
                    </Table.Cell>
                    <Table.Cell>{weapon.category || "—"}</Table.Cell>
                    <Table.Cell>{weapon.equipped ? "Yes" : "No"}</Table.Cell>
                    <Table.Cell>
                      <Button size="sm" variant="ghost" onPress={() => handleRemoveWeapon(i)}>
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}

      <AddWeaponForm onAdd={handleAddWeapon} />

      <Table className="mt-4">
        <Table.ScrollContainer>
          <Table.Content aria-label="Equipment">
            <Table.Header>
              <Table.Column isRowHeader>Item</Table.Column>
              <Table.Column>Qty</Table.Column>
              <Table.Column>Weight</Table.Column>
              <Table.Column aria-label="Actions" />
            </Table.Header>
            <Table.Body renderEmptyState={() => <span className="text-sm text-muted">No equipment.</span>}>
              {equipment.map((item, i) => (
                <Table.Row key={i} id={i}>
                  <Table.Cell>
                    <span title={item.description ?? undefined}>{item.name}</span>
                    {item.magic && (
                      <Chip size="sm" className="ml-2">
                        Magic
                      </Chip>
                    )}
                  </Table.Cell>
                  <Table.Cell>{item.quantity ?? 0}</Table.Cell>
                  <Table.Cell>{item.weight ? `${item.weight} lb` : "—"}</Table.Cell>
                  <Table.Cell>
                    <Button size="sm" variant="ghost" onPress={() => handleRemoveEquipment(i)}>
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <AddEquipmentForm onAdd={handleAddEquipment} />
    </Section>
  );
}
