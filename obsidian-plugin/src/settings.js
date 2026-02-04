"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoLinkerSettingTab = exports.DEFAULT_SETTINGS = void 0;
const tslib_1 = require("tslib");
const obsidian_1 = require("obsidian");
exports.DEFAULT_SETTINGS = {
    apiUrl: 'http://127.0.0.1:5000/extract',
    ignoreThreshold: 10,
    maxKeywords: 5
};
class AutoLinkerSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    /**
     * Creates an async handler for string setting changes.
     * @param key - The setting key to update
     */
    createStringHandler(key) {
        return (value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.plugin.settings[key] = value;
            yield this.plugin.saveSettings();
        });
    }
    /**
     * Creates an async handler for numeric setting changes.
     * Validates that the input is a valid number before saving.
     * @param key - The setting key to update
     */
    createNumberHandler(key) {
        return (value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const num = Number(value);
            if (!isNaN(num)) {
                this.plugin.settings[key] = num;
                yield this.plugin.saveSettings();
            }
        });
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Auto Linker 설정' });
        new obsidian_1.Setting(containerEl)
            .setName('Backend Server URL')
            .setDesc('Python 백엔드 서버의 엔드포인트 주소입니다.')
            .addText(text => text
            .setPlaceholder('http://127.0.0.1:5000/extract')
            .setValue(this.plugin.settings.apiUrl)
            .onChange(this.createStringHandler('apiUrl')));
        new obsidian_1.Setting(containerEl)
            .setName('Ignore Threshold')
            .setDesc('이미 이 개수 이상의 링크가 있는 문서는 처리를 건너뜁니다.')
            .addText(text => text
            .setPlaceholder('10')
            .setValue(String(this.plugin.settings.ignoreThreshold))
            .onChange(this.createNumberHandler('ignoreThreshold')));
        new obsidian_1.Setting(containerEl)
            .setName('Max Keywords')
            .setDesc('추출할 키워드의 최대 개수입니다.')
            .addText(text => text
            .setPlaceholder('5')
            .setValue(String(this.plugin.settings.maxKeywords))
            .onChange(this.createNumberHandler('maxKeywords')));
    }
}
exports.AutoLinkerSettingTab = AutoLinkerSettingTab;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsdUNBQTBEO0FBUzdDLFFBQUEsZ0JBQWdCLEdBQXVCO0lBQ2hELE1BQU0sRUFBRSwrQkFBK0I7SUFDdkMsZUFBZSxFQUFFLEVBQUU7SUFDbkIsV0FBVyxFQUFFLENBQUM7Q0FDakIsQ0FBQTtBQUVELE1BQWEsb0JBQXFCLFNBQVEsMkJBQWdCO0lBR3RELFlBQVksR0FBUSxFQUFFLE1BQXdCO1FBQzFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLG1CQUFtQixDQUFDLEdBQTZCO1FBQ3JELE9BQU8sQ0FBTyxLQUFhLEVBQUUsRUFBRTtZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQVksR0FBRyxLQUFLLENBQUM7WUFDOUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQSxDQUFDO0lBQ04sQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxtQkFBbUIsQ0FBQyxHQUE2QjtRQUNyRCxPQUFPLENBQU8sS0FBYSxFQUFFLEVBQUU7WUFDM0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQVksR0FBRyxHQUFHLENBQUM7Z0JBQzVDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBLENBQUM7SUFDTixDQUFDO0lBRUQsT0FBTztRQUNILE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDN0IsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXBCLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQztRQUV2RCxJQUFJLGtCQUFPLENBQUMsV0FBVyxDQUFDO2FBQ25CLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQzthQUM3QixPQUFPLENBQUMsNkJBQTZCLENBQUM7YUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSTthQUNoQixjQUFjLENBQUMsK0JBQStCLENBQUM7YUFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzthQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RCxJQUFJLGtCQUFPLENBQUMsV0FBVyxDQUFDO2FBQ25CLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzthQUMzQixPQUFPLENBQUMsbUNBQW1DLENBQUM7YUFDNUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSTthQUNoQixjQUFjLENBQUMsSUFBSSxDQUFDO2FBQ3BCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDdEQsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRSxJQUFJLGtCQUFPLENBQUMsV0FBVyxDQUFDO2FBQ25CLE9BQU8sQ0FBQyxjQUFjLENBQUM7YUFDdkIsT0FBTyxDQUFDLG9CQUFvQixDQUFDO2FBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7YUFDaEIsY0FBYyxDQUFDLEdBQUcsQ0FBQzthQUNuQixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ2xELFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Q0FDSjtBQWhFRCxvREFnRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCBBdXRvTGlua2VyUGx1Z2luIGZyb20gJy4vbWFpbic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9MaW5rZXJTZXR0aW5ncyB7XHJcbiAgICBhcGlVcmw6IHN0cmluZzsgICAgICAgIC8vIOuwseyXlOuTnCDshJzrsoQg7KO87IaMICjsmIg6IGh0dHA6Ly8xMjcuMC4wLjE6NTAwMC9leHRyYWN0KVxyXG4gICAgaWdub3JlVGhyZXNob2xkOiBudW1iZXI7IC8vIOq4sOyhtCDrp4HtgazqsIAg7J20IOyIq+yekCDsnbTsg4HsnbTrqbQg7J6Q64+ZIOyXsOqysCDqsbTrhIjrnIBcclxuICAgIG1heEtleXdvcmRzOiBudW1iZXI7ICAgICAvLyDtlZwg67KI7JeQIOy2lOy2nO2VoCDtgqTsm4zrk5wg7LWc64yAIOqwnOyImFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogQXV0b0xpbmtlclNldHRpbmdzID0ge1xyXG4gICAgYXBpVXJsOiAnaHR0cDovLzEyNy4wLjAuMTo1MDAwL2V4dHJhY3QnLFxyXG4gICAgaWdub3JlVGhyZXNob2xkOiAxMCxcclxuICAgIG1heEtleXdvcmRzOiA1XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBdXRvTGlua2VyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG4gICAgcGx1Z2luOiBBdXRvTGlua2VyUGx1Z2luO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IEF1dG9MaW5rZXJQbHVnaW4pIHtcclxuICAgICAgICBzdXBlcihhcHAsIHBsdWdpbik7XHJcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGFzeW5jIGhhbmRsZXIgZm9yIHN0cmluZyBzZXR0aW5nIGNoYW5nZXMuXHJcbiAgICAgKiBAcGFyYW0ga2V5IC0gVGhlIHNldHRpbmcga2V5IHRvIHVwZGF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNyZWF0ZVN0cmluZ0hhbmRsZXIoa2V5OiBrZXlvZiBBdXRvTGlua2VyU2V0dGluZ3MpOiAodmFsdWU6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIGFzeW5jICh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICh0aGlzLnBsdWdpbi5zZXR0aW5nc1trZXldIGFzIHN0cmluZykgPSB2YWx1ZTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXN5bmMgaGFuZGxlciBmb3IgbnVtZXJpYyBzZXR0aW5nIGNoYW5nZXMuXHJcbiAgICAgKiBWYWxpZGF0ZXMgdGhhdCB0aGUgaW5wdXQgaXMgYSB2YWxpZCBudW1iZXIgYmVmb3JlIHNhdmluZy5cclxuICAgICAqIEBwYXJhbSBrZXkgLSBUaGUgc2V0dGluZyBrZXkgdG8gdXBkYXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlTnVtYmVySGFuZGxlcihrZXk6IGtleW9mIEF1dG9MaW5rZXJTZXR0aW5ncyk6ICh2YWx1ZTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gYXN5bmMgKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbnVtID0gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKCFpc05hTihudW0pKSB7XHJcbiAgICAgICAgICAgICAgICAodGhpcy5wbHVnaW4uc2V0dGluZ3Nba2V5XSBhcyBudW1iZXIpID0gbnVtO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuICAgICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cclxuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdBdXRvIExpbmtlciDshKTsoJUnIH0pO1xyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ0JhY2tlbmQgU2VydmVyIFVSTCcpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdQeXRob24g67Cx7JeU65OcIOyEnOuyhOydmCDsl5Trk5ztj6zsnbjtirgg7KO87IaM7J6F64uI64ukLicpXHJcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxyXG4gICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdodHRwOi8vMTI3LjAuMC4xOjUwMDAvZXh0cmFjdCcpXHJcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXBpVXJsKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKHRoaXMuY3JlYXRlU3RyaW5nSGFuZGxlcignYXBpVXJsJykpKTtcclxuXHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdJZ25vcmUgVGhyZXNob2xkJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ+ydtOuvuCDsnbQg6rCc7IiYIOydtOyDgeydmCDrp4HtgazqsIAg7J6I64qUIOusuOyEnOuKlCDsspjrpqzrpbwg6rG064SI65yB64uI64ukLicpXHJcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxyXG4gICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCcxMCcpXHJcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKHRoaXMucGx1Z2luLnNldHRpbmdzLmlnbm9yZVRocmVzaG9sZCkpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UodGhpcy5jcmVhdGVOdW1iZXJIYW5kbGVyKCdpZ25vcmVUaHJlc2hvbGQnKSkpO1xyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ01heCBLZXl3b3JkcycpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCfstpTstpztlaAg7YKk7JuM65Oc7J2YIOy1nOuMgCDqsJzsiJjsnoXri4jri6QuJylcclxuICAgICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJzUnKVxyXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKFN0cmluZyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXhLZXl3b3JkcykpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UodGhpcy5jcmVhdGVOdW1iZXJIYW5kbGVyKCdtYXhLZXl3b3JkcycpKSk7XHJcbiAgICB9XHJcbn0iXX0=