import { useState } from "react";
import { wait } from "../app/fakeApi";
import { TimeEntryForm, type TimeEntry } from "./TimeEntryForm";

/** El mismo TimeEntryForm que prueban los tests, con un onSubmit falso que tarda 800 ms. */
export function TimeEntryFormLive() {
  const [fail, setFail] = useState(false);
  const [calls, setCalls] = useState<TimeEntry[]>([]);

  const onSubmit = async (entry: TimeEntry) => {
    await wait(800);
    if (fail) throw new Error("500");
    setCalls((prev) => [...prev, entry]);
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <label className="row">
        <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} />
        simular error del servidor (como <code>mockRejectedValue</code>)
      </label>
      <TimeEntryForm projects={["Planner", "Reports"]} onSubmit={onSubmit} />
      <ol className="console" aria-label="llamadas a onSubmit">
        {calls.length === 0 ? (
          <li className="muted">onSubmit todavía no fue llamado</li>
        ) : (
          calls.map((c, i) => <li key={i}>onSubmit({JSON.stringify(c)})</li>)
        )}
      </ol>
    </div>
  );
}
