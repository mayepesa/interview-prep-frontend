import type { ComponentPropsWithoutRef, ReactNode } from "react";

// ─── Tipar componentes de React ──────────────────────────────────────────────

/** Extender las props nativas de un elemento: el botón acepta onClick, disabled, aria-*… */
type ButtonProps = ComponentPropsWithoutRef<"button"> & { variant?: "primary" | "ghost" };

export function Button({ variant = "ghost", className, ...rest }: ButtonProps) {
  return <button type="button" className={`${variant} ${className ?? ""}`} {...rest} />;
}

/** Componente genérico: las opciones y el onChange comparten el tipo T. */
type SelectProps<T> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
};

export function Select<T>({ options, value, onChange, getLabel }: SelectProps<T>) {
  return (
    <select
      value={options.indexOf(value)}
      onChange={(e) => {
        const next = options[Number(e.target.value)];
        if (next !== undefined) onChange(next);
      }}
    >
      {options.map((option, i) => (
        <option key={getLabel(option)} value={i}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

/** Props que dependen entre sí: si es link, necesita href; si es botón, onClick. */
type ActionProps =
  | { as: "link"; href: string; children: ReactNode }
  | { as: "button"; onClick: () => void; children: ReactNode };

export function Action(props: ActionProps) {
  return props.as === "link" ? (
    <a href={props.href}>{props.children}</a>
  ) : (
    <button type="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
