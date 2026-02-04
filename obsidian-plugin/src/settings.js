"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoLinkerSettingTab = exports.DEFAULT_SETTINGS = void 0;
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
        return (value) => __awaiter(this, void 0, void 0, function* () {
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
        return (value) => __awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBMEQ7QUFTN0MsUUFBQSxnQkFBZ0IsR0FBdUI7SUFDaEQsTUFBTSxFQUFFLCtCQUErQjtJQUN2QyxlQUFlLEVBQUUsRUFBRTtJQUNuQixXQUFXLEVBQUUsQ0FBQztDQUNqQixDQUFBO0FBRUQsTUFBYSxvQkFBcUIsU0FBUSwyQkFBZ0I7SUFHdEQsWUFBWSxHQUFRLEVBQUUsTUFBd0I7UUFDMUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssbUJBQW1CLENBQUMsR0FBNkI7UUFDckQsT0FBTyxDQUFPLEtBQWEsRUFBRSxFQUFFO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBWSxHQUFHLEtBQUssQ0FBQztZQUM5QyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFBLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLG1CQUFtQixDQUFDLEdBQTZCO1FBQ3JELE9BQU8sQ0FBTyxLQUFhLEVBQUUsRUFBRTtZQUMzQixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBWSxHQUFHLEdBQUcsQ0FBQztnQkFDNUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JDLENBQUM7UUFDTCxDQUFDLENBQUEsQ0FBQztJQUNOLENBQUM7SUFFRCxPQUFPO1FBQ0gsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUM3QixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFcEIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBRXZELElBQUksa0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLG9CQUFvQixDQUFDO2FBQzdCLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQzthQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJO2FBQ2hCLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQzthQUMvQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZELElBQUksa0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLGtCQUFrQixDQUFDO2FBQzNCLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQzthQUM1QyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJO2FBQ2hCLGNBQWMsQ0FBQyxJQUFJLENBQUM7YUFDcEIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhFLElBQUksa0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLGNBQWMsQ0FBQzthQUN2QixPQUFPLENBQUMsb0JBQW9CLENBQUM7YUFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSTthQUNoQixjQUFjLENBQUMsR0FBRyxDQUFDO2FBQ25CLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDbEQsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztDQUNKO0FBaEVELG9EQWdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IEF1dG9MaW5rZXJQbHVnaW4gZnJvbSAnLi9tYWluJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXV0b0xpbmtlclNldHRpbmdzIHtcclxuICAgIGFwaVVybDogc3RyaW5nOyAgICAgICAgLy8g67Cx7JeU65OcIOyEnOuyhCDso7zshowgKOyYiDogaHR0cDovLzEyNy4wLjAuMTo1MDAwL2V4dHJhY3QpXHJcbiAgICBpZ25vcmVUaHJlc2hvbGQ6IG51bWJlcjsgLy8g6riw7KG0IOunge2BrOqwgCDsnbQg7Iir7J6QIOydtOyDgeydtOuptCDsnpDrj5kg7Jew6rKwIOqxtOuEiOucgFxyXG4gICAgbWF4S2V5d29yZHM6IG51bWJlcjsgICAgIC8vIO2VnCDrsojsl5Ag7LaU7Lac7ZWgIO2CpOybjOuTnCDstZzrjIAg6rCc7IiYXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBBdXRvTGlua2VyU2V0dGluZ3MgPSB7XHJcbiAgICBhcGlVcmw6ICdodHRwOi8vMTI3LjAuMC4xOjUwMDAvZXh0cmFjdCcsXHJcbiAgICBpZ25vcmVUaHJlc2hvbGQ6IDEwLFxyXG4gICAgbWF4S2V5d29yZHM6IDVcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEF1dG9MaW5rZXJTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XHJcbiAgICBwbHVnaW46IEF1dG9MaW5rZXJQbHVnaW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogQXV0b0xpbmtlclBsdWdpbikge1xyXG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXN5bmMgaGFuZGxlciBmb3Igc3RyaW5nIHNldHRpbmcgY2hhbmdlcy5cclxuICAgICAqIEBwYXJhbSBrZXkgLSBUaGUgc2V0dGluZyBrZXkgdG8gdXBkYXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlU3RyaW5nSGFuZGxlcihrZXk6IGtleW9mIEF1dG9MaW5rZXJTZXR0aW5ncyk6ICh2YWx1ZTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gYXN5bmMgKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgKHRoaXMucGx1Z2luLnNldHRpbmdzW2tleV0gYXMgc3RyaW5nKSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBhc3luYyBoYW5kbGVyIGZvciBudW1lcmljIHNldHRpbmcgY2hhbmdlcy5cclxuICAgICAqIFZhbGlkYXRlcyB0aGF0IHRoZSBpbnB1dCBpcyBhIHZhbGlkIG51bWJlciBiZWZvcmUgc2F2aW5nLlxyXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBzZXR0aW5nIGtleSB0byB1cGRhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVOdW1iZXJIYW5kbGVyKGtleToga2V5b2YgQXV0b0xpbmtlclNldHRpbmdzKTogKHZhbHVlOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBhc3luYyAodmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBudW0gPSBOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAoIWlzTmFOKG51bSkpIHtcclxuICAgICAgICAgICAgICAgICh0aGlzLnBsdWdpbi5zZXR0aW5nc1trZXldIGFzIG51bWJlcikgPSBudW07XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGxheSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ0F1dG8gTGlua2VyIOyEpOyglScgfSk7XHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZSgnQmFja2VuZCBTZXJ2ZXIgVVJMJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ1B5dGhvbiDrsLHsl5Trk5wg7ISc67KE7J2YIOyXlOuTnO2PrOyduO2KuCDso7zshozsnoXri4jri6QuJylcclxuICAgICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ2h0dHA6Ly8xMjcuMC4wLjE6NTAwMC9leHRyYWN0JylcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hcGlVcmwpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UodGhpcy5jcmVhdGVTdHJpbmdIYW5kbGVyKCdhcGlVcmwnKSkpO1xyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ0lnbm9yZSBUaHJlc2hvbGQnKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygn7J2066+4IOydtCDqsJzsiJgg7J207IOB7J2YIOunge2BrOqwgCDsnojripQg66y47ISc64qUIOyymOumrOulvCDqsbTrhIjrnIHri4jri6QuJylcclxuICAgICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJzEwJylcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShTdHJpbmcodGhpcy5wbHVnaW4uc2V0dGluZ3MuaWdub3JlVGhyZXNob2xkKSlcclxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZSh0aGlzLmNyZWF0ZU51bWJlckhhbmRsZXIoJ2lnbm9yZVRocmVzaG9sZCcpKSk7XHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZSgnTWF4IEtleXdvcmRzJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ+y2lOy2nO2VoCDtgqTsm4zrk5zsnZgg7LWc64yAIOqwnOyImOyeheuLiOuLpC4nKVxyXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcclxuICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignNScpXHJcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKHRoaXMucGx1Z2luLnNldHRpbmdzLm1heEtleXdvcmRzKSlcclxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZSh0aGlzLmNyZWF0ZU51bWJlckhhbmRsZXIoJ21heEtleXdvcmRzJykpKTtcclxuICAgIH1cclxufSJdfQ==