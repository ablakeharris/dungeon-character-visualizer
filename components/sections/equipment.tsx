"use client";

import { Chip, Table } from "@heroui/react";
import type { Dice } from "@/lib/character";
import { Section } from "../fields";
import type { SectionProps } from "./types";

function formatDice(dice: Dice | null | undefined): string {
  if (!dice) return "—";
  const mod = dice.mod ? (dice.mod > 0 ? `+${dice.mod}` : `${dice.mod}`) : "";
  return `${dice.count ?? 1}d${dice.sides ?? 4}${mod}`;
}

export function EquipmentSection({ character }: Pick<SectionProps, "character">) {
  const equipment = character.equipment ?? [];
  const weapons = character.weapons ?? [];

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
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Equipment">
            <Table.Header>
              <Table.Column isRowHeader>Item</Table.Column>
              <Table.Column>Qty</Table.Column>
              <Table.Column>Weight</Table.Column>
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
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Section>
  );
}
