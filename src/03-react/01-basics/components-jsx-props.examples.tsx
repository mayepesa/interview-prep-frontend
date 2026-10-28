import { createElement, useState, type ComponentProps, type ReactNode } from "react";

type BadgeProps = { label: string; tone?: "info" | "success" };

/** Un componente: función que recibe props y devuelve elementos. */
export function Badge({ label, tone = "info" }: BadgeProps) {
  const color = tone === "success" ? "var(--good)" : "var(--accent)";
  return (
    <span style={{ color, border: `1px solid ${color}`, borderRadius: 999, padding: "0 8px" }}>
      {label}
    </span>
  );
}

/** Con JSX y con createElement se obtiene exactamente lo mismo. */
export function JsxVsCreateElement() {
  const withJsx = <Badge label="Con JSX" />;
  const withoutJsx = createElement(Badge, { label: "Sin JSX", tone: "success" });
  return (
    <div className="row">
      {withJsx}
      {withoutJsx}
    </div>
  );
}

/** Muestra qué hay dentro de un elemento: un objeto con type y props. */
export function ElementInspector() {
  const element = <Badge label="32 h" tone="success" />;
  return (
    <div>
      <div className="row">Se renderiza así: {element}</div>
      <ol className="console">
        <li>typeof element → "{typeof element}"</li>
        <li>element.type === Badge → {String(element.type === Badge)}</li>
        <li>element.props → {JSON.stringify(element.props)}</li>
        <li>element.key → {String(element.key)}</li>
      </ol>
    </div>
  );
}

/** Reglas de JSX: htmlFor, className, style como objeto, un solo elemento raíz. */
export function JsxRulesForm() {
  const [hours, setHours] = useState(8);
  return (
    <>
      {/* htmlFor conecta el label con el input: haz clic en el texto */}
      <label htmlFor="jsx-rules-hours" className="note">
        Horas de hoy (haz clic aquí)
      </label>{" "}
      <input
        id="jsx-rules-hours"
        type="number"
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        style={{ width: 80 }}
      />
      <p style={{ color: hours > 8 ? "var(--bad)" : "var(--good)", fontWeight: 600 }}>
        {hours > 8 ? `${hours - 8} h extra` : "Jornada normal"}
      </p>
    </>
  );
}

/** children: Card no sabe qué contenido recibe. */
export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 12 }}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

type DialogProps = {
  title: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  tone?: "default" | "danger";
};

/** Componente genérico con "slots": title, children y actions. */
export function Dialog({ title, children, actions, tone = "default" }: DialogProps) {
  return (
    <div
      role="group"
      style={{
        border: `1px solid ${tone === "danger" ? "var(--bad)" : "var(--line)"}`,
        borderRadius: 8,
        padding: 12,
        maxWidth: 420,
      }}
    >
      <strong style={{ color: tone === "danger" ? "var(--bad)" : undefined }}>{title}</strong>
      <div style={{ margin: "8px 0" }}>{children}</div>
      {actions && <div className="row">{actions}</div>}
    </div>
  );
}

/** Especialización por composición: un Dialog configurado, sin herencia. */
export function DeleteDialog({ itemName, onConfirm }: { itemName: string; onConfirm: () => void }) {
  return (
    <Dialog
      tone="danger"
      title="¿Borrar registro?"
      actions={
        <button type="button" onClick={onConfirm}>
          Sí, borrar
        </button>
      }
    >
      Vas a borrar <em>{itemName}</em>. Esta acción no se puede deshacer.
    </Dialog>
  );
}

export function CompositionDemo() {
  const [deleted, setDeleted] = useState(false);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card title="Resumen semanal">
        <p>Card recibe cualquier contenido por children.</p>
        <Badge label="32 h registradas" tone="success" />
      </Card>
      {deleted ? (
        <p>
          Borrado.{" "}
          <button type="button" onClick={() => setDeleted(false)}>
            Deshacer demo
          </button>
        </p>
      ) : (
        <DeleteDialog itemName="Timesheet del lunes" onConfirm={() => setDeleted(true)} />
      )}
    </div>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: "primary" | "ghost" };

/** Wrapper de un elemento nativo: aquí sí tiene sentido reenviar el resto con spread. */
export function Button({ variant = "primary", style, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      style={{
        background: variant === "primary" ? "var(--accent)" : "transparent",
        color: variant === "primary" ? "white" : "var(--ink)",
        ...style,
      }}
    />
  );
}

export function ButtonDemo() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="row">
      <Button onClick={() => setClicks((c) => c + 1)} aria-label="sumar un clic">
        Primary ({clicks})
      </Button>
      <Button variant="ghost" disabled>
        Ghost deshabilitado
      </Button>
    </div>
  );
}
