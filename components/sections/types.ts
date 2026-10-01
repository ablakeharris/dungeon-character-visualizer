import type { DD5ECharacter } from "@/lib/character";

export interface SectionProps {
  character: DD5ECharacter;
  onChange: (patch: Partial<DD5ECharacter>) => void;
}
