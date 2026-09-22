"use client";

import { useEffect, useId, useRef, useState } from "react";

type SelectOption = { value: string; label: string };

type AyniSelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

export function AyniSelect({ label, value, options, onChange, className = "" }: AyniSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <div className={`ayni-select ${className}`} ref={rootRef} onKeyDown={(event) => {
      if (event.key === "Escape") setOpen(false);
      if ((event.key === "Enter" || event.key === " ") && event.currentTarget === event.target) setOpen((current) => !current);
    }}>
      <span className="ayni-select-label">{label}</span>
      <button className="ayni-select-trigger" type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((current) => !current)}>
        <span>{selected.label}</span><i aria-hidden="true" />
      </button>
      {open ? (
        <div className="ayni-select-menu" id={listId} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button className={option.value === value ? "selected" : ""} type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false); }}>
              <span>{option.label}</span><i aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
