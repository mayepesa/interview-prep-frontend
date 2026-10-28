import { describe, expect, it } from "vitest";
import { isSafeUrl, sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it("keeps allowed formatting", () => {
    expect(sanitizeHtml("<p>Hola <strong>Maria</strong></p>")).toBe(
      "<p>Hola <strong>Maria</strong></p>",
    );
  });

  it("removes scripts and event handlers", () => {
    expect(sanitizeHtml('<img src=x onerror="alert(1)"><script>alert(2)</script>ok')).toBe("ok");
    expect(sanitizeHtml('<p onclick="steal()">texto</p>')).toBe("<p>texto</p>");
  });

  it("removes javascript: links but keeps safe ones", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).toBe("<a>x</a>");
    expect(sanitizeHtml('<a href="https://tempo.io">Tempo</a>')).toBe(
      '<a href="https://tempo.io">Tempo</a>',
    );
  });

  it("unwraps unknown tags but keeps their text", () => {
    expect(sanitizeHtml("<div><span>hola</span></div>")).toBe("hola");
  });
});

describe("isSafeUrl", () => {
  it("allows http, https and mailto only", () => {
    expect(isSafeUrl("href", "https://a.com")).toBe(true);
    expect(isSafeUrl("href", "mailto:a@b.com")).toBe(true);
    expect(isSafeUrl("href", "JaVaScRiPt:alert(1)")).toBe(false);
    expect(isSafeUrl("href", "data:text/html,<script>")).toBe(false);
  });
});
