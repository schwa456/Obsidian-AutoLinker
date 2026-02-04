"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AutoLinkerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  apiUrl: "http://127.0.0.1:5000/extract",
  ignoreThreshold: 10,
  maxKeywords: 5
};
var AutoLinkerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  /**
   * Creates an async handler for string setting changes.
   * @param key - The setting key to update
   */
  createStringHandler(key) {
    return async (value) => {
      this.plugin.settings[key] = value;
      await this.plugin.saveSettings();
    };
  }
  /**
   * Creates an async handler for numeric setting changes.
   * Validates that the input is a valid number before saving.
   * @param key - The setting key to update
   */
  createNumberHandler(key) {
    return async (value) => {
      const num = Number(value);
      if (!isNaN(num)) {
        this.plugin.settings[key] = num;
        await this.plugin.saveSettings();
      }
    };
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Auto Linker \uC124\uC815" });
    new import_obsidian.Setting(containerEl).setName("Backend Server URL").setDesc("Python \uBC31\uC5D4\uB4DC \uC11C\uBC84\uC758 \uC5D4\uB4DC\uD3EC\uC778\uD2B8 \uC8FC\uC18C\uC785\uB2C8\uB2E4.").addText((text) => text.setPlaceholder("http://127.0.0.1:5000/extract").setValue(this.plugin.settings.apiUrl).onChange(this.createStringHandler("apiUrl")));
    new import_obsidian.Setting(containerEl).setName("Ignore Threshold").setDesc("\uC774\uBBF8 \uC774 \uAC1C\uC218 \uC774\uC0C1\uC758 \uB9C1\uD06C\uAC00 \uC788\uB294 \uBB38\uC11C\uB294 \uCC98\uB9AC\uB97C \uAC74\uB108\uB701\uB2C8\uB2E4.").addText((text) => text.setPlaceholder("10").setValue(String(this.plugin.settings.ignoreThreshold)).onChange(this.createNumberHandler("ignoreThreshold")));
    new import_obsidian.Setting(containerEl).setName("Max Keywords").setDesc("\uCD94\uCD9C\uD560 \uD0A4\uC6CC\uB4DC\uC758 \uCD5C\uB300 \uAC1C\uC218\uC785\uB2C8\uB2E4.").addText((text) => text.setPlaceholder("5").setValue(String(this.plugin.settings.maxKeywords)).onChange(this.createNumberHandler("maxKeywords")));
  }
};

// src/api-client.ts
var import_obsidian2 = require("obsidian");

// src/utils.ts
var TEXT_MAX_LENGTH = 4e3;
var PLUGIN_NAME = "AutoLinker";
function logDebug(message) {
  console.log(`[${PLUGIN_NAME}] ${message}`);
}
function logError(message, error) {
  console.error(`[${PLUGIN_NAME}] ${message}`, error || "");
}

// src/api-client.ts
async function fetchKeywords(text, settings) {
  const truncatedText = text.slice(0, TEXT_MAX_LENGTH);
  try {
    const response = await (0, import_obsidian2.requestUrl)({
      url: settings.apiUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: truncatedText,
        max_keywords: settings.maxKeywords
      })
    });
    if (response.status === 200) {
      const data = response.json;
      logDebug(`Extracted: ${data.keywords.join(", ")}`);
      return data.keywords;
    } else {
      new import_obsidian2.Notice(`\uC11C\uBC84 \uC624\uB958: ${response.status}`);
      logError(`Server responded with error: ${response.text}`);
      return [];
    }
  } catch (error) {
    new import_obsidian2.Notice("\uBC31\uC5D4\uB4DC \uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC11C\uBC84\uAC00 \uCF1C\uC838 \uC788\uB294\uC9C0 \uD655\uC778\uD558\uC138\uC694.");
    logError("Connection failed:", error);
    return [];
  }
}

// src/view.ts
var import_obsidian3 = require("obsidian");
var VIEW_TYPE_PAPER_DROP = "paper-drop-view";
var PaperDropView = class extends import_obsidian3.ItemView {
  constructor(leaf) {
    super(leaf);
  }
  getViewType() {
    return VIEW_TYPE_PAPER_DROP;
  }
  getDisplayText() {
    return "AI \uB17C\uBB38 \uBD84\uC11D\uAC00";
  }
  getIcon() {
    return "book-open";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "PDF \uB17C\uBB38 \uBD84\uC11D" });
    const dropZone = container.createEl("div", { cls: "paper-drop-zone" });
    dropZone.createEl("div", { text: "\u{1F4C2}", cls: "drop-icon" });
    const textEl = dropZone.createEl("p", { text: "\uC5EC\uAE30\uC5D0 PDF\uB97C \uB4DC\uB798\uADF8\uD558\uC138\uC694" });
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.addClass("hover");
    });
    dropZone.addEventListener("dragleave", () => {
      dropZone.removeClass("hover");
    });
    dropZone.addEventListener("drop", async (e) => {
      e.preventDefault();
      dropZone.removeClass("hover");
      if (!e.dataTransfer) return;
      const files = e.dataTransfer.files;
      if (files.length === 0) return;
      const file = files[0];
      if (file.type !== "application/pdf") {
        new import_obsidian3.Notice("PDF \uD30C\uC77C\uB9CC \uC9C0\uC6D0\uD569\uB2C8\uB2E4.");
        return;
      }
      await this.uploadFile(file, textEl);
    });
  }
  async uploadFile(file, statusEl) {
    statusEl.setText(`\uC5C5\uB85C\uB4DC \uC911: ${file.name}...`);
    new import_obsidian3.Notice(`${file.name} \uBD84\uC11D\uC744 \uC2DC\uC791\uD569\uB2C8\uB2E4.`);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://127.0.0.1:5000/upload-paper", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        statusEl.setText("\u2705 \uBD84\uC11D \uC644\uB8CC! \uBCFC\uD2B8\uB97C \uD655\uC778\uD558\uC138\uC694.");
        new import_obsidian3.Notice(`\uC644\uB8CC: ${data.filename}`);
      } else {
        const errText = await response.text();
        statusEl.setText("\u274C \uC5D0\uB7EC \uBC1C\uC0DD");
        console.error(errText);
        new import_obsidian3.Notice("\uC11C\uBC84 \uC5D0\uB7EC\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
      }
    } catch (error) {
      statusEl.setText("\u26A0\uFE0F \uC11C\uBC84 \uC5F0\uACB0 \uC2E4\uD328");
      console.error(error);
      new import_obsidian3.Notice("\uBC31\uC5D4\uB4DC \uC11C\uBC84\uAC00 \uCF1C\uC838 \uC788\uB294\uC9C0 \uD655\uC778\uD558\uC138\uC694.");
    }
  }
  async onClose() {
  }
};

// src/main.ts
var AutoLinkerPlugin = class extends import_obsidian4.Plugin {
  /**
   * Called when the plugin is loaded.
   * Initializes settings, UI components, and commands.
   */
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AutoLinkerSettingTab(this.app, this));
    this.registerView(
      VIEW_TYPE_PAPER_DROP,
      (leaf) => new PaperDropView(leaf)
    );
    this.addRibbonIcon("book-open", "AI Paper Processor", () => {
      this.activateView();
    });
    this.addCommand({
      id: "auto-link-current-note",
      name: "Extract keywords and create backlinks",
      // [Fix 2] view 타입을 MarkdownFileInfo까지 확장하여 호환성 확보
      editorCallback: (editor, view) => {
        this.processCurrentNote(editor, view);
      }
    });
  }
  /**
   * Processes the current note for keyword extraction and linking.
   * 
   * Reads the active note, sends it to the backend for keyword extraction,
   * and applies backlinks to the extracted keywords.
   * 
   * @param editor - Optional editor instance
   * @param view - Optional view instance (MarkdownView or MarkdownFileInfo)
   */
  // [Fix 3] 인자 타입을 확장하고, null 가능성을 명시
  async processCurrentNote(editor, view) {
    var _a;
    if (!view) {
      view = this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    }
    if (!view || !view.file) return;
    const file = view.file;
    const cache = this.app.metadataCache.getFileCache(file);
    const existingLinks = ((_a = cache == null ? void 0 : cache.links) == null ? void 0 : _a.length) || 0;
    if (existingLinks >= this.settings.ignoreThreshold) {
      new import_obsidian4.Notice(`\uB9C1\uD06C\uAC00 \uC774\uBBF8 ${existingLinks}\uAC1C \uC788\uC2B5\uB2C8\uB2E4. (\uC124\uC815\uAC12: ${this.settings.ignoreThreshold}\uAC1C \uC774\uC0C1 \uC2DC \uAC74\uB108\uB700)`);
      return;
    }
    new import_obsidian4.Notice("\uD0A4\uC6CC\uB4DC \uBD84\uC11D \uC911...");
    const content = await this.app.vault.read(file);
    const keywords = await fetchKeywords(content, this.settings);
    if (!keywords || keywords.length === 0) {
      new import_obsidian4.Notice("\uCD94\uCD9C\uB41C \uD0A4\uC6CC\uB4DC\uAC00 \uC5C6\uAC70\uB098 \uC11C\uBC84 \uC5F0\uACB0\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
      return;
    }
    const newContent = this.applyLinks(content, keywords);
    if (content !== newContent) {
      await this.app.vault.modify(file, newContent);
      new import_obsidian4.Notice(`${keywords.length}\uAC1C\uC758 \uD0A4\uC6CC\uB4DC\uB97C \uC5F0\uACB0\uD588\uC2B5\uB2C8\uB2E4!`);
    } else {
      new import_obsidian4.Notice("\uBCC0\uACBD\uD560 \uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4 (\uC774\uBBF8 \uB9C1\uD06C\uB428).");
    }
  }
  /**
   * Applies backlinks to keywords in the given text.
   * 
   * Wraps matching keywords with Obsidian's wiki-link syntax [[keyword]].
   * Skips keywords that are already linked or prefixed with #.
   * 
   * @param text - The original text content
   * @param keywords - Array of keywords to link
   * @returns Text with keywords converted to backlinks
   */
  applyLinks(text, keywords) {
    let newText = text;
    const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
    sortedKeywords.forEach((keyword) => {
      try {
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(?<!\\[\\[|#)(${escapedKeyword})(?!\\]\\])`, "g");
        newText = newText.replace(regex, "[[$1]]");
      } catch (e) {
        logError(`Error processing keyword "${keyword}":`, e);
      }
    });
    return newText;
  }
  /**
   * Loads plugin settings from disk.
   */
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  /**
   * Saves plugin settings to disk.
   */
  async saveSettings() {
    await this.saveData(this.settings);
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_PAPER_DROP);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({ type: VIEW_TYPE_PAPER_DROP, active: true });
      }
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }
};
