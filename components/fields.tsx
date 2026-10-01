"use client";

import {
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  ListBox,
  NumberField,
  Select,
  Switch,
  Tag,
  TagGroup,
  TextArea,
  TextField,
} from "@heroui/react";
import { useState, type ReactNode } from "react";

export function Section({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card className={className}>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {description && <Card.Description>{description}</Card.Description>}
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">{children}</Card.Content>
    </Card>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  multiline = false,
  className,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <TextField className={className} value={value ?? ""} onChange={onChange}>
      <Label>{label}</Label>
      {multiline ? <TextArea rows={3} /> : <Input />}
    </TextField>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  className,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  className?: string;
}) {
  return (
    <NumberField
      className={className}
      value={value ?? 0}
      onChange={(next) => onChange(Number.isNaN(next) ? 0 : next)}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
    >
      <Label>{label}</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
}

export function CheckboxInput({
  label,
  isSelected,
  onChange,
}: {
  label: ReactNode;
  isSelected: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Checkbox isSelected={isSelected} onChange={onChange}>
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Label>{label}</Label>
      </Checkbox.Content>
    </Checkbox>
  );
}

export function SwitchInput({
  label,
  isSelected,
  onChange,
}: {
  label: string;
  isSelected: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Switch isSelected={isSelected} onChange={onChange}>
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Label>{label}</Label>
      </Switch.Content>
    </Switch>
  );
}

export interface SelectOption {
  key: string;
  label: string;
}

export function SelectInput({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string | null | undefined;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select className={className} value={value ?? null} onChange={(key) => onChange(key == null ? "" : String(key))}>
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.key} id={option.key} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

/** Editable list of strings: removable tags plus an input to add new entries. */
export function StringListInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: readonly string[] | null | undefined;
  onChange: (values: string[]) => void;
}) {
  const list = values ?? [];
  const [draft, setDraft] = useState("");

  const add = () => {
    const entry = draft.trim();
    if (entry && !list.includes(entry)) onChange([...list, entry]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2">
      <TagGroup onRemove={(keys) => onChange(list.filter((_, i) => !keys.has(String(i))))}>
        <Label>{label}</Label>
        <TagGroup.List renderEmptyState={() => <span className="text-sm text-muted">None</span>}>
          {list.map((entry, i) => (
            <Tag key={`${i}-${entry}`} id={String(i)}>
              {entry}
            </Tag>
          ))}
        </TagGroup.List>
      </TagGroup>
      <div className="flex items-end gap-2">
        <TextField
          aria-label={`Add to ${label}`}
          className="flex-1"
          value={draft}
          onChange={setDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        >
          <Input placeholder={`Add ${label.toLowerCase()}…`} />
        </TextField>
        <Button size="sm" variant="secondary" onPress={add} isDisabled={!draft.trim()}>
          Add
        </Button>
      </div>
    </div>
  );
}
