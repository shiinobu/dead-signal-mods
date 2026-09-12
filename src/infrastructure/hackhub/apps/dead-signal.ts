import {
    App,
    RegisterApp,
} from "@hotbunny/hackhub-content-sdk";
import appHTML from "../../../dead-signal.html";

import {
    executeDssCommand,
    triggerDssCommand,
} from "../dss-command-runtime.js";
import {
    opsRuntime,
} from "../../../application/ops/runtime.js";
import type {
    OpsCommandDefinition,
} from "../../../application/ops/command-registry.js";
import type {
    OpsSessionSnapshot,
} from "../../../application/ops/session-store.js";
import type {
    OpsToolDefinition,
} from "../../../application/ops/tool-registry.js";

const DSS_DIRECT_INTERACTION_PATCH = `
<script>
(() => {
  const emit = async (commandLine) => {
    const exported = globalThis.executeCommand;
    if (typeof exported === 'function') {
      await Promise.resolve(exported(commandLine));
      return true;
    }
    const sdk = globalThis.HackhubSDK;
    if (!sdk?.Events?.emit) return false;
    sdk.Events.emit('DSS.Command.Request', { commandLine });
    return true;
  };
  const startRecon = (target) => {
    const trigger = globalThis.startReconNow;
    if (typeof trigger === 'function') {
      return trigger(target) !== false;
    }
    return emit('recon -d ' + target);
  };
  const bind = () => {
    const reconForm = document.getElementById('recon-form');
    const reconButton = document.getElementById('recon-run');
    const reconTarget = document.getElementById('recon-target');
    if (reconButton && !reconButton.dataset.dssDirectBound) {
      reconButton.type = 'button';
      reconButton.dataset.dssDirectBound = 'true';
      reconButton.addEventListener('click', () => {
        const target = reconTarget?.value.trim();
        if (!target || reconButton.disabled) return;
        reconButton.disabled = true;
        const state = document.getElementById('scan-state');
        const percent = document.getElementById('percent');
        const bar = document.getElementById('bar');
        const profile = document.getElementById('profile');
        const sources = document.getElementById('sources');
        const candidates = document.getElementById('candidates');
        const unique = document.getElementById('unique');
        const results = document.getElementById('results');
        const sourceList = document.getElementById('source-list');
        if (state) state.textContent = 'Starting reconnaissance.';
        if (percent) percent.textContent = '0%';
        if (bar) bar.style.width = '0%';
        if (profile) profile.textContent = 'RUNNING';
        if (sources) sources.textContent = '0/0';
        if (candidates) candidates.textContent = '0';
        if (unique) unique.textContent = '0';
        if (results) results.innerHTML = '<div class="empty">Scanning...</div>';
        if (sourceList) sourceList.innerHTML = '<div class="empty">Loading profile...</div>';
        try {
          const ok = startRecon(target);
          if (!ok) {
            if (state) state.textContent = 'DSS reconnaissance trigger unavailable.';
            reconButton.disabled = false;
          }
        } catch (error) {
          if (state) state.textContent = error instanceof Error ? error.message : 'Reconnaissance failed.';
          reconButton.disabled = false;
        }
      });
    }

    const commandForm = document.getElementById('cmd-form');
    const commandButton = document.getElementById('cmd-run');
    const commandInput = document.getElementById('cmd-input');
    const commandOutput = document.getElementById('terminal-output');
    if (commandButton && !commandButton.dataset.dssDirectBound) {
      commandButton.type = 'button';
      commandButton.dataset.dssDirectBound = 'true';
      commandButton.addEventListener('click', async () => {
        const commandLine = commandInput?.value.trim();
        if (!commandLine) return;
        if (commandOutput) {
          const line = document.createElement('div');
          line.className = 'line line-info';
          line.textContent = 'dss~$ ' + commandLine;
          commandOutput.append(line);
          while (commandOutput.children.length > 36) commandOutput.removeChild(commandOutput.firstChild);
        }
        if (commandInput) commandInput.value = '';
        if (commandLine.toLowerCase() === 'clear') {
          if (commandOutput) commandOutput.innerHTML = '';
          const line = document.createElement('div');
          line.className = 'line line-info';
          line.textContent = 'DSS // Dead Signal System';
          commandOutput?.append(line);
          commandInput?.focus();
          return;
        }
        try {
          const ok = await emit(commandLine);
          if (!ok && commandOutput) {
            const line = document.createElement('div');
            line.className = 'line line-warn';
            line.textContent = 'DSS command bridge is unavailable.';
            commandOutput.append(line);
          }
        } catch (error) {
          if (commandOutput) {
            const line = document.createElement('div');
            line.className = 'line line-warn';
            line.textContent = error instanceof Error ? error.message : 'Command execution failed.';
            commandOutput.append(line);
          }
        }
        commandInput?.focus();
      });
    }

    if (reconForm) reconForm.addEventListener('submit', (event) => event.preventDefault());
    if (commandForm) commandForm.addEventListener('submit', (event) => event.preventDefault());
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
})();
</script>`;

const dssHTML = appHTML.includes('</body>')
    ? appHTML.replace('</body>', `${DSS_DIRECT_INTERACTION_PATCH}</body>`)
    : appHTML;

@RegisterApp
export class DeadSignalApp extends App {
    AppName = "dss";
    Title = "DSS";
    Icon = "./assets/dss.svg";
    HTML = dssHTML;
    DefaultSize = { width: 1220, height: 800 };
    override MinSize = { width: 1200, height: 780 };
    override Unlocked = true;

    override Store = {
        title: "DSS",
        ratings: 0,
        description: "DSS // Dead Signal System — integrated investigation workspace.",
    };

    override Exports = {
        getToolCatalog: (): readonly OpsToolDefinition[] => opsRuntime.tools.getAll(),
        getCommandCatalog: (): readonly OpsCommandDefinition[] => opsRuntime.commands.getAll(),
        getSession: (): OpsSessionSnapshot => opsRuntime.session.getSnapshot(),
        startRecon: (target: string): Promise<boolean> => executeDssCommand(`recon -d ${target}`),
        startReconNow: (target: string): boolean => triggerDssCommand(`recon -d ${target}`),
        executeCommand: (commandLine: string): Promise<boolean> => executeDssCommand(commandLine),
    };
}
