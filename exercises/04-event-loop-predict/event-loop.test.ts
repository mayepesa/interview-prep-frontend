import { describe, expect, it } from "vitest";
import * as solution from "./solution";
import { snippetA, snippetB, snippetC } from "./snippets";
import * as starter from "./starter";

const { predictionA, predictionB, predictionC } = (
  process.env.SOLUTIONS ? solution : starter
) as typeof solution;

// Los tests de un ejercicio no corren hasta que pongas `started = true` en starter.
const suite = process.env.SOLUTIONS || starter.started ? describe : describe.skip;

async function run(snippet: (log: (msg: string) => void) => Promise<void>) {
  const out: string[] = [];
  await snippet((msg) => out.push(msg));
  await new Promise((r) => setTimeout(r, 20));
  return out;
}

suite("04 · event loop", () => {
  it("snippet A", async () => expect(predictionA).toEqual(await run(snippetA)));
  it("snippet B", async () => expect(predictionB).toEqual(await run(snippetB)));
  it("snippet C", async () => expect(predictionC).toEqual(await run(snippetC)));
});
