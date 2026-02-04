"use strict";
/**
 * Obsidian Auto-Linker Plugin.
 *
 * Automatically extracts keywords from notes and creates backlinks
 * using a local LLM backend server.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const obsidian_1 = require("obsidian");
const settings_1 = require("./settings");
const api_client_1 = require("./api-client");
const utils_1 = require("./utils");
/**
 * Main plugin class for Obsidian Auto-Linker.
 *
 * Provides functionality to automatically extract keywords from markdown notes
 * and convert them to Obsidian backlinks using LLM-based analysis.
 */
class AutoLinkerPlugin extends obsidian_1.Plugin {
    /**
     * Called when the plugin is loaded.
     * Initializes settings, UI components, and commands.
     */
    onload() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new settings_1.AutoLinkerSettingTab(this.app, this));
            this.addRibbonIcon('network', 'Auto Link Keywords', () => {
                this.processCurrentNote();
            });
            this.addCommand({
                id: 'auto-link-current-note',
                name: 'Extract keywords and create backlinks',
                // [Fix 2] view 타입을 MarkdownFileInfo까지 확장하여 호환성 확보
                editorCallback: (editor, view) => {
                    this.processCurrentNote(editor, view);
                }
            });
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
    processCurrentNote(editor, view) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            // 뷰가 넘어오지 않았으면 현재 활성 뷰를 가져옴
            if (!view) {
                view = this.app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
            }
            // 여전히 view가 없거나 file이 없으면 종료
            if (!view || !view.file)
                return;
            const file = view.file;
            const cache = this.app.metadataCache.getFileCache(file);
            const existingLinks = ((_a = cache === null || cache === void 0 ? void 0 : cache.links) === null || _a === void 0 ? void 0 : _a.length) || 0;
            if (existingLinks >= this.settings.ignoreThreshold) {
                new obsidian_1.Notice(`링크가 이미 ${existingLinks}개 있습니다. (설정값: ${this.settings.ignoreThreshold}개 이상 시 건너뜀)`);
                return;
            }
            new obsidian_1.Notice('키워드 분석 중...');
            const content = yield this.app.vault.read(file);
            const keywords = yield (0, api_client_1.fetchKeywords)(content, this.settings);
            if (!keywords || keywords.length === 0) {
                new obsidian_1.Notice('추출된 키워드가 없거나 서버 연결에 실패했습니다.');
                return;
            }
            const newContent = this.applyLinks(content, keywords);
            if (content !== newContent) {
                yield this.app.vault.modify(file, newContent);
                new obsidian_1.Notice(`${keywords.length}개의 키워드를 연결했습니다!`);
            }
            else {
                new obsidian_1.Notice('변경할 내용이 없습니다 (이미 링크됨).');
            }
        });
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
        // 긴 단어부터 처리 (중복 방지)
        const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
        sortedKeywords.forEach(keyword => {
            try {
                // 특수문자 이스케이프
                const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Regex: 이미 링크되거나 태그(#)가 아닌 경우만 치환
                const regex = new RegExp(`(?<!\\[\\[|#)(${escapedKeyword})(?!\\]\\])`, 'g');
                newText = newText.replace(regex, '[[$1]]');
            }
            catch (e) {
                (0, utils_1.logError)(`Error processing keyword "${keyword}":`, e);
            }
        });
        return newText;
    }
    /**
     * Loads plugin settings from disk.
     */
    loadSettings() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, settings_1.DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    /**
     * Saves plugin settings to disk.
     */
    saveSettings() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
exports.default = AutoLinkerPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztHQUtHOzs7QUFFSCx1Q0FBa0Y7QUFDbEYseUNBQXdGO0FBQ3hGLDZDQUE2QztBQUM3QyxtQ0FBbUM7QUFFbkM7Ozs7O0dBS0c7QUFDSCxNQUFxQixnQkFBaUIsU0FBUSxpQkFBTTtJQUloRDs7O09BR0c7SUFDRyxNQUFNOztZQUNSLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRTFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSwrQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFN0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO2dCQUNyRCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ1osRUFBRSxFQUFFLHdCQUF3QjtnQkFDNUIsSUFBSSxFQUFFLHVDQUF1QztnQkFDN0Msa0RBQWtEO2dCQUNsRCxjQUFjLEVBQUUsQ0FBQyxNQUFjLEVBQUUsSUFBcUMsRUFBRSxFQUFFO29CQUN0RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxDQUFDO2FBQ0osQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxvQ0FBb0M7SUFDOUIsa0JBQWtCLENBQUMsTUFBZSxFQUFFLElBQTZDOzs7WUFDbkYsNEJBQTRCO1lBQzVCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDUixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsdUJBQVksQ0FBQyxDQUFDO1lBQ2hFLENBQUM7WUFFRCw2QkFBNkI7WUFDN0Is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QixFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDL0UsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxZQUFZOztZQUNkLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsQ0FBQztLQUFBO0NBQ0o7QUExSEQsbUNBMEhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIE9ic2lkaWFuIEF1dG8tTGlua2VyIFBsdWdpbi5cclxuICogXHJcbiAqIEF1dG9tYXRpY2FsbHkgZXh0cmFjdHMga2V5d29yZHMgZnJvbSBub3RlcyBhbmQgY3JlYXRlcyBiYWNrbGlua3NcclxuICogdXNpbmcgYSBsb2NhbCBMTE0gYmFja2VuZCBzZXJ2ZXIuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRWRpdG9yLCBNYXJrZG93blZpZXcsIE1hcmtkb3duRmlsZUluZm8sIE5vdGljZSwgUGx1Z2luIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBBdXRvTGlua2VyU2V0dGluZ3MsIERFRkFVTFRfU0VUVElOR1MsIEF1dG9MaW5rZXJTZXR0aW5nVGFiIH0gZnJvbSAnLi9zZXR0aW5ncyc7XHJcbmltcG9ydCB7IGZldGNoS2V5d29yZHMgfSBmcm9tICcuL2FwaS1jbGllbnQnO1xyXG5pbXBvcnQgeyBsb2dFcnJvciB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuLyoqXHJcbiAqIE1haW4gcGx1Z2luIGNsYXNzIGZvciBPYnNpZGlhbiBBdXRvLUxpbmtlci5cclxuICogXHJcbiAqIFByb3ZpZGVzIGZ1bmN0aW9uYWxpdHkgdG8gYXV0b21hdGljYWxseSBleHRyYWN0IGtleXdvcmRzIGZyb20gbWFya2Rvd24gbm90ZXNcclxuICogYW5kIGNvbnZlcnQgdGhlbSB0byBPYnNpZGlhbiBiYWNrbGlua3MgdXNpbmcgTExNLWJhc2VkIGFuYWx5c2lzLlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b0xpbmtlclBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgICAvLyBbRml4IDFdIOuKkOuCjO2RnCghKeulvCDrtpnsl6zshJwgXCLrgpjspJHsl5Ag66y07KGw6rG0IO2VoOuLueuQnOuLpFwi6rOgIFRT7JeQ6rKMIOyVjOumvFxyXG4gICAgc2V0dGluZ3MhOiBBdXRvTGlua2VyU2V0dGluZ3M7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGlzIGxvYWRlZC5cclxuICAgICAqIEluaXRpYWxpemVzIHNldHRpbmdzLCBVSSBjb21wb25lbnRzLCBhbmQgY29tbWFuZHMuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIG9ubG9hZCgpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IEF1dG9MaW5rZXJTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUmliYm9uSWNvbignbmV0d29yaycsICdBdXRvIExpbmsgS2V5d29yZHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0N1cnJlbnROb3RlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgICAgICAgIGlkOiAnYXV0by1saW5rLWN1cnJlbnQtbm90ZScsXHJcbiAgICAgICAgICAgIG5hbWU6ICdFeHRyYWN0IGtleXdvcmRzIGFuZCBjcmVhdGUgYmFja2xpbmtzJyxcclxuICAgICAgICAgICAgLy8gW0ZpeCAyXSB2aWV3IO2DgOyeheydhCBNYXJrZG93bkZpbGVJbmZv6rmM7KeAIO2Zleyepe2VmOyXrCDtmLjtmZjshLEg7ZmV67O0XHJcbiAgICAgICAgICAgIGVkaXRvckNhbGxiYWNrOiAoZWRpdG9yOiBFZGl0b3IsIHZpZXc6IE1hcmtkb3duVmlldyB8IE1hcmtkb3duRmlsZUluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0N1cnJlbnROb3RlKGVkaXRvciwgdmlldyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb2Nlc3NlcyB0aGUgY3VycmVudCBub3RlIGZvciBrZXl3b3JkIGV4dHJhY3Rpb24gYW5kIGxpbmtpbmcuXHJcbiAgICAgKiBcclxuICAgICAqIFJlYWRzIHRoZSBhY3RpdmUgbm90ZSwgc2VuZHMgaXQgdG8gdGhlIGJhY2tlbmQgZm9yIGtleXdvcmQgZXh0cmFjdGlvbixcclxuICAgICAqIGFuZCBhcHBsaWVzIGJhY2tsaW5rcyB0byB0aGUgZXh0cmFjdGVkIGtleXdvcmRzLlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gZWRpdG9yIC0gT3B0aW9uYWwgZWRpdG9yIGluc3RhbmNlXHJcbiAgICAgKiBAcGFyYW0gdmlldyAtIE9wdGlvbmFsIHZpZXcgaW5zdGFuY2UgKE1hcmtkb3duVmlldyBvciBNYXJrZG93bkZpbGVJbmZvKVxyXG4gICAgICovXHJcbiAgICAvLyBbRml4IDNdIOyduOyekCDtg4DsnoXsnYQg7ZmV7J6l7ZWY6rOgLCBudWxsIOqwgOuKpeyEseydhCDrqoXsi5xcclxuICAgIGFzeW5jIHByb2Nlc3NDdXJyZW50Tm90ZShlZGl0b3I/OiBFZGl0b3IsIHZpZXc/OiBNYXJrZG93blZpZXcgfCBNYXJrZG93bkZpbGVJbmZvIHwgbnVsbCkge1xyXG4gICAgICAgIC8vIOu3sOqwgCDrhJjslrTsmKTsp4Ag7JWK7JWY7Jy866m0IO2YhOyerCDtmZzshLEg67ew66W8IOqwgOyguOyYtFxyXG4gICAgICAgIGlmICghdmlldykge1xyXG4gICAgICAgICAgICB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOyXrOyghO2eiCB2aWV36rCAIOyXhuqxsOuCmCBmaWxl7J20IOyXhuycvOuptCDsooXro4xcclxuICAgICAgICBpZiAoIXZpZXcgfHwgIXZpZXcuZmlsZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBmaWxlID0gdmlldy5maWxlO1xyXG5cclxuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nTGlua3MgPSBjYWNoZT8ubGlua3M/Lmxlbmd0aCB8fCAwO1xyXG5cclxuICAgICAgICBpZiAoZXhpc3RpbmdMaW5rcyA+PSB0aGlzLnNldHRpbmdzLmlnbm9yZVRocmVzaG9sZCkge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKGDrp4HtgazqsIAg7J2066+4ICR7ZXhpc3RpbmdMaW5rc33qsJwg7J6I7Iq164uI64ukLiAo7ISk7KCV6rCSOiAke3RoaXMuc2V0dGluZ3MuaWdub3JlVGhyZXNob2xkfeqwnCDsnbTsg4Eg7IucIOqxtOuEiOucgClgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV3IE5vdGljZSgn7YKk7JuM65OcIOu2hOyEnSDspJEuLi4nKTtcclxuICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcclxuXHJcbiAgICAgICAgY29uc3Qga2V5d29yZHMgPSBhd2FpdCBmZXRjaEtleXdvcmRzKGNvbnRlbnQsIHRoaXMuc2V0dGluZ3MpO1xyXG5cclxuICAgICAgICBpZiAoIWtleXdvcmRzIHx8IGtleXdvcmRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKCfstpTstpzrkJwg7YKk7JuM65Oc6rCAIOyXhuqxsOuCmCDshJzrsoQg7Jew6rKw7JeQIOyLpO2MqO2WiOyKteuLiOuLpC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3Q29udGVudCA9IHRoaXMuYXBwbHlMaW5rcyhjb250ZW50LCBrZXl3b3Jkcyk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZW50ICE9PSBuZXdDb250ZW50KSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCBuZXdDb250ZW50KTtcclxuICAgICAgICAgICAgbmV3IE5vdGljZShgJHtrZXl3b3Jkcy5sZW5ndGh96rCc7J2YIO2CpOybjOuTnOulvCDsl7DqsrDtlojsirXri4jri6QhYCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3IE5vdGljZSgn67OA6rK97ZWgIOuCtOyaqeydtCDsl4bsirXri4jri6QgKOydtOuvuCDrp4HtgazrkKgpLicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGxpZXMgYmFja2xpbmtzIHRvIGtleXdvcmRzIGluIHRoZSBnaXZlbiB0ZXh0LlxyXG4gICAgICogXHJcbiAgICAgKiBXcmFwcyBtYXRjaGluZyBrZXl3b3JkcyB3aXRoIE9ic2lkaWFuJ3Mgd2lraS1saW5rIHN5bnRheCBbW2tleXdvcmRdXS5cclxuICAgICAqIFNraXBzIGtleXdvcmRzIHRoYXQgYXJlIGFscmVhZHkgbGlua2VkIG9yIHByZWZpeGVkIHdpdGggIy5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHRleHQgLSBUaGUgb3JpZ2luYWwgdGV4dCBjb250ZW50XHJcbiAgICAgKiBAcGFyYW0ga2V5d29yZHMgLSBBcnJheSBvZiBrZXl3b3JkcyB0byBsaW5rXHJcbiAgICAgKiBAcmV0dXJucyBUZXh0IHdpdGgga2V5d29yZHMgY29udmVydGVkIHRvIGJhY2tsaW5rc1xyXG4gICAgICovXHJcbiAgICBhcHBseUxpbmtzKHRleHQ6IHN0cmluZywga2V5d29yZHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbmV3VGV4dCA9IHRleHQ7XHJcblxyXG4gICAgICAgIC8vIOq4tCDri6jslrTrtoDthLAg7LKY66asICjspJHrs7Ug67Cp7KeAKVxyXG4gICAgICAgIGNvbnN0IHNvcnRlZEtleXdvcmRzID0ga2V5d29yZHMuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIHNvcnRlZEtleXdvcmRzLmZvckVhY2goa2V5d29yZCA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyDtirnsiJjrrLjsnpAg7J207Iqk7LyA7J207ZSEXHJcbiAgICAgICAgICAgICAgICBjb25zdCBlc2NhcGVkS2V5d29yZCA9IGtleXdvcmQucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWdleDog7J2066+4IOunge2BrOuQmOqxsOuCmCDtg5zqt7goIynqsIAg7JWE64uMIOqyveyasOunjCDsuZjtmZhcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgKD88IVxcXFxbXFxcXFt8IykoJHtlc2NhcGVkS2V5d29yZH0pKD8hXFxcXF1cXFxcXSlgLCAnZycpO1xyXG5cclxuICAgICAgICAgICAgICAgIG5ld1RleHQgPSBuZXdUZXh0LnJlcGxhY2UocmVnZXgsICdbWyQxXV0nKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoYEVycm9yIHByb2Nlc3Npbmcga2V5d29yZCBcIiR7a2V5d29yZH1cIjpgLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIHBsdWdpbiBzZXR0aW5ncyBmcm9tIGRpc2suXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNhdmVzIHBsdWdpbiBzZXR0aW5ncyB0byBkaXNrLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuICAgIH1cclxufSJdfQ==