"use client";

import { Alert, Button } from "@heroui/react";
import { useRef, useState, type ChangeEvent } from "react";
import { emptyCharacter, parseCharacter, type DD5ECharacter } from "@/lib/character";
import { AbilitiesSection } from "./sections/abilities";
import { ClassesSection } from "./sections/classes";
import { CombatSection } from "./sections/combat";
import { DetailsSection } from "./sections/details";
import { EquipmentSection } from "./sections/equipment";
import { IdentitySection } from "./sections/identity";
import { ProficienciesSection } from "./sections/proficiencies";
import { SkillsSection } from "./sections/skills";
import { SpellsSection } from "./sections/spells";

export function CharacterSheet() {
  const [character, setCharacter] = useState<DD5ECharacter>(emptyCharacter);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const onChange = (patch: Partial<DD5ECharacter>) => setCharacter((prev) => ({ ...prev, ...patch }));

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so selecting the same file again still fires `change`.
    event.target.value = "";
    if (!file) return;
    try {
      setCharacter(parseCharacter(await file.text()));
      setFileName(file.name);
      setError(null);
    } catch (err) {
      setError(`${file.name}: ${(err as Error).message}`);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(character, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName ?? `${character.name.trim() || "character"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setCharacter(emptyCharacter());
    setFileName(null);
    setError(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{character.name || "Character Visualizer"}</h1>
          <p className="text-sm text-muted">
            {fileName ? `Loaded from ${fileName}` : "Import a DD5ECharacter JSON file to begin."}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onFileSelected}
          />
          <Button onPress={() => fileInput.current?.click()}>Import JSON</Button>
          <Button variant="secondary" onPress={exportJson}>
            Export JSON
          </Button>
          <Button variant="ghost" onPress={reset}>
            Reset
          </Button>
        </div>
      </header>

      {error && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Could not import character</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <form className="grid grid-cols-1 gap-6 lg:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <IdentitySection character={character} onChange={onChange} />
        <AbilitiesSection character={character} onChange={onChange} />
        <CombatSection character={character} onChange={onChange} />
        <SkillsSection character={character} onChange={onChange} />
        <ClassesSection character={character} onChange={onChange} />
        <ProficienciesSection character={character} onChange={onChange} />
        <SpellsSection character={character} onChange={onChange} />
        <EquipmentSection character={character} onChange={onChange} />
        <DetailsSection character={character} onChange={onChange} />
      </form>
    </div>
  );
}
