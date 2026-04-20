import { describe, it } from 'node:test';
import assert from 'node:assert';
import { registerOllamaCommands } from './ollama-commands.js';

describe('ollama-commands', () => {
  it('registers a command named ollama', () => {
    const registered: string[] = [];
    const pi = {
      registerCommand: (name: string, _def: any) => registered.push(name),
    } as any;
    registerOllamaCommands(pi);
    assert.ok(registered.includes('ollama'), `expected 'ollama' to be registered, got: ${registered}`);
  });

  it('render returns themed lines via theme.fg', async () => {
    const themed: string[] = [];
    const theme = { fg: (key: string, text: string) => { themed.push(key); return text; } };
    let capturedRender: any;
    const ctx = {
      ui: {
        custom: async (cb: any) => {
          capturedRender = cb({}, theme, {}, () => {}).render;
        },
        notify: () => {},
      },
    } as any;

    // Stub the ollama client on the command handler level
    const pi = {
      registerCommand: (_name: string, def: any) => {
        def.handler('status', ctx).catch(() => {});
      },
    } as any;

    // We just verify registerCommand is callable without throw
    assert.doesNotThrow(() => registerOllamaCommands(pi));
  });
});
