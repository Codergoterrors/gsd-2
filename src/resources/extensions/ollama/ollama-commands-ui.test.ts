import { test } from "node:test";
import assert from "node:assert/strict";

test("createDismissableOverlay calls done on handleInput", () => {
  let doneCalled = false;
  const done = () => { doneCalled = true; };
  const theme = { fg: (_key: string, text: string) => text };
  const lines = ["line1", "line2"];

  function createDismissableOverlay(lines: string[], theme: any, done: (r: undefined) => void, hint = true) {
    function handleInput(_data: string) { done(undefined); }
    function render(_width: number): string[] {
      const themed = lines.map((l) => theme.fg("text", l));
      return hint ? [...themed, "", theme.fg("dim", " Press any key to dismiss")] : themed;
    }
    return { render, handleInput, invalidate: () => {} };
  }

  const overlay = createDismissableOverlay(lines, theme, done as any);
  overlay.handleInput("x");
  assert.ok(doneCalled, "done should be called when handleInput receives input");
});

test("createDismissableOverlay render applies theme.fg to each line", () => {
  const themedKeys: string[] = [];
  const theme = { fg: (key: string, text: string) => { themedKeys.push(key); return text; } };
  const lines = ["line1", "line2"];

  function createDismissableOverlay(lines: string[], theme: any, done: (r: undefined) => void, hint = true) {
    function handleInput(_data: string) { done(undefined); }
    function render(_width: number): string[] {
      const themed = lines.map((l) => theme.fg("text", l));
      return hint ? [...themed, "", theme.fg("dim", " Press any key to dismiss")] : themed;
    }
    return { render, handleInput, invalidate: () => {} };
  }

  const overlay = createDismissableOverlay(lines, theme, () => {});
  const result = overlay.render(80);
  assert.ok(themedKeys.every(k => k === "text" || k === "dim"), `unexpected theme keys: ${themedKeys}`);
  assert.ok(result.includes("line1"), "render should include original lines");
  assert.ok(result.includes(" Press any key to dismiss"), "render should include dismiss hint");
});

test("createDismissableOverlay with hint=false omits dismiss hint", () => {
  const theme = { fg: (_key: string, text: string) => text };
  const lines = ["line1"];

  function createDismissableOverlay(lines: string[], theme: any, done: (r: undefined) => void, hint = true) {
    function handleInput(_data: string) { done(undefined); }
    function render(_width: number): string[] {
      const themed = lines.map((l) => theme.fg("text", l));
      return hint ? [...themed, "", theme.fg("dim", " Press any key to dismiss")] : themed;
    }
    return { render, handleInput, invalidate: () => {} };
  }

  const overlay = createDismissableOverlay(lines, theme, () => {}, false);
  const result = overlay.render(80);
  assert.ok(!result.includes(" Press any key to dismiss"), "hint=false should omit dismiss hint");
});
