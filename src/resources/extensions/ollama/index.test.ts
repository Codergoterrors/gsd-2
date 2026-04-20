import { describe, it } from 'node:test';
import assert from 'node:assert';
import ollamaExtension from './index.js';

describe('ollama index', () => {
  it('exports a function that accepts an ExtensionAPI', () => {
    assert.strictEqual(typeof ollamaExtension, 'function');
  });

  it('registers session_start and session_shutdown listeners', () => {
    const events: string[] = [];
    const pi = {
      on: (event: string, _cb: any) => events.push(event),
      registerCommand: () => {},
    } as any;
    ollamaExtension(pi);
    assert.ok(events.includes('session_start'), 'should listen to session_start');
    assert.ok(events.includes('session_shutdown'), 'should listen to session_shutdown');
  });
});
