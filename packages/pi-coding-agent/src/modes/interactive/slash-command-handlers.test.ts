import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dispatchSlashCommand } from './slash-command-handlers.js';

describe('slash-command-handlers', () => {
  it('returns false without error for extension-owned commands', async () => {
    const errors: string[] = [];
    const ctx = {
      showError: (msg: string) => errors.push(msg),
      session: {
        extensionRunner: { getCommand: (name: string) => name === 'myext' ? {} : null },
      },
    } as any;
    const result = await dispatchSlashCommand('/myext somearg', ctx);
    assert.strictEqual(result, false);
    assert.strictEqual(errors.length, 0);
  });

  it('calls showError with leading slash for unknown commands', async () => {
    const errors: string[] = [];
    const ctx = {
      showError: (msg: string) => errors.push(msg),
      session: {
        extensionRunner: { getCommand: () => null },
      },
    } as any;
    const result = await dispatchSlashCommand('/unknowncmd', ctx);
    assert.strictEqual(result, true);
    assert.ok(errors.length > 0, 'showError should be called');
    assert.ok(errors[0].startsWith('Unknown command: /unknowncmd'), `got: ${errors[0]}`);
  });
});
