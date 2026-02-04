import { App, PluginSettingTab, Setting } from 'obsidian';
import AutoLinkerPlugin from './main';

export interface AutoLinkerSettings {
    apiUrl: string;        // 백엔드 서버 주소 (예: http://127.0.0.1:5000/extract)
    ignoreThreshold: number; // 기존 링크가 이 숫자 이상이면 자동 연결 건너뜀
    maxKeywords: number;     // 한 번에 추출할 키워드 최대 개수
}

export const DEFAULT_SETTINGS: AutoLinkerSettings = {
    apiUrl: 'http://127.0.0.1:5000/extract',
    ignoreThreshold: 10,
    maxKeywords: 5
}

export class AutoLinkerSettingTab extends PluginSettingTab {
    plugin: AutoLinkerPlugin;

    constructor(app: App, plugin: AutoLinkerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    /**
     * Creates an async handler for string setting changes.
     * @param key - The setting key to update
     */
    private createStringHandler(key: keyof AutoLinkerSettings): (value: string) => Promise<void> {
        return async (value: string) => {
            (this.plugin.settings[key] as string) = value;
            await this.plugin.saveSettings();
        };
    }

    /**
     * Creates an async handler for numeric setting changes.
     * Validates that the input is a valid number before saving.
     * @param key - The setting key to update
     */
    private createNumberHandler(key: keyof AutoLinkerSettings): (value: string) => Promise<void> {
        return async (value: string) => {
            const num = Number(value);
            if (!isNaN(num)) {
                (this.plugin.settings[key] as number) = num;
                await this.plugin.saveSettings();
            }
        };
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Auto Linker 설정' });

        new Setting(containerEl)
            .setName('Backend Server URL')
            .setDesc('Python 백엔드 서버의 엔드포인트 주소입니다.')
            .addText(text => text
                .setPlaceholder('http://127.0.0.1:5000/extract')
                .setValue(this.plugin.settings.apiUrl)
                .onChange(this.createStringHandler('apiUrl')));

        new Setting(containerEl)
            .setName('Ignore Threshold')
            .setDesc('이미 이 개수 이상의 링크가 있는 문서는 처리를 건너뜁니다.')
            .addText(text => text
                .setPlaceholder('10')
                .setValue(String(this.plugin.settings.ignoreThreshold))
                .onChange(this.createNumberHandler('ignoreThreshold')));

        new Setting(containerEl)
            .setName('Max Keywords')
            .setDesc('추출할 키워드의 최대 개수입니다.')
            .addText(text => text
                .setPlaceholder('5')
                .setValue(String(this.plugin.settings.maxKeywords))
                .onChange(this.createNumberHandler('maxKeywords')));
    }
}