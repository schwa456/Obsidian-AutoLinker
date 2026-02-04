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
const obsidian_1 = require("obsidian");
const settings_1 = require("./settings");
const api_client_1 = require("./api-client");
const utils_1 = require("./utils");
const view_1 = require("./view");
class AutoLinkerPlugin extends obsidian_1.Plugin {
    /**
     * Called when the plugin is loaded.
     * Initializes settings, UI components, and commands.
     */
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new settings_1.AutoLinkerSettingTab(this.app, this));
            this.registerView(view_1.VIEW_TYPE_PAPER_DROP, (leaf) => new view_1.PaperDropView(leaf));
            this.addRibbonIcon('book-open', 'AI Paper Processor', () => {
                this.activateView();
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
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, settings_1.DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    /**
     * Saves plugin settings to disk.
     */
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    activateView() {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspace } = this.app;
            let leaf = null;
            const leaves = workspace.getLeavesOfType(view_1.VIEW_TYPE_PAPER_DROP);
            if (leaves.length > 0) {
                leaf = leaves[0];
            }
            else {
                leaf = workspace.getRightLeaf(false);
                if (leaf) {
                    yield leaf.setViewState({ type: view_1.VIEW_TYPE_PAPER_DROP, active: true });
                }
            }
            if (leaf) {
                workspace.revealLeaf(leaf);
            }
        });
    }
}
exports.default = AutoLinkerPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBaUc7QUFDakcseUNBQXdGO0FBQ3hGLDZDQUE2QztBQUM3QyxtQ0FBbUM7QUFDbkMsaUNBQTJEO0FBRzNELE1BQXFCLGdCQUFpQixTQUFRLGlCQUFNO0lBR2hEOzs7T0FHRztJQUNHLE1BQU07O1lBQ1IsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLCtCQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUU3RCxJQUFJLENBQUMsWUFBWSxDQUNiLDJCQUFvQixFQUNwQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUNwQyxDQUFDO1lBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO2dCQUN2RCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUNaLEVBQUUsRUFBRSx3QkFBd0I7Z0JBQzVCLElBQUksRUFBRSx1Q0FBdUM7Z0JBQzdDLGtEQUFrRDtnQkFDbEQsY0FBYyxFQUFFLENBQUMsTUFBYyxFQUFFLElBQXFDLEVBQUUsRUFBRTtvQkFDdEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUMsQ0FBQzthQUNKLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsb0NBQW9DO0lBQzlCLGtCQUFrQixDQUFDLE1BQWUsRUFBRSxJQUE2Qzs7O1lBQ25GLDRCQUE0QjtZQUM1QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxH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Q25CLENBQUM7SUFFRDs7T0FFRztJQUNHLFlBQVk7O1lBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSwyQkFBZ0IsRUFBRSxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQy9FLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csWUFBWTs7WUFDZCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7S0FBQTtJQUVLLFlBQVk7O1lBQ2QsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFFL0IsSUFBSSxJQUFJLEdBQXlCLElBQUksQ0FBQztZQUN0QyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDLDJCQUFvQixDQUFDLENBQUM7WUFFL0QsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNwQixJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BCLENBQUM7aUJBQU0sQ0FBQztnQkFDSixJQUFJLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckMsSUFBSSxJQUFJLEVBQUUsQ0FBQztvQkFDUCxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsMkJBQW9CLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7Z0JBQ3pFLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDUCxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQWxKRCxtQ0FrSkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFZGl0b3IsIE1hcmtkb3duVmlldywgTWFya2Rvd25GaWxlSW5mbywgTm90aWNlLCBQbHVnaW4sIFdvcmtzcGFjZUxlYWYgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IEF1dG9MaW5rZXJTZXR0aW5ncywgREVGQVVMVF9TRVRUSU5HUywgQXV0b0xpbmtlclNldHRpbmdUYWIgfSBmcm9tICcuL3NldHRpbmdzJztcclxuaW1wb3J0IHsgZmV0Y2hLZXl3b3JkcyB9IGZyb20gJy4vYXBpLWNsaWVudCc7XHJcbmltcG9ydCB7IGxvZ0Vycm9yIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7UGFwZXJEcm9wVmlldywgVklFV19UWVBFX1BBUEVSX0RST1B9IGZyb20gXCIuL3ZpZXdcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvTGlua2VyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICAgIHNldHRpbmdzITogQXV0b0xpbmtlclNldHRpbmdzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBpcyBsb2FkZWQuXHJcbiAgICAgKiBJbml0aWFsaXplcyBzZXR0aW5ncywgVUkgY29tcG9uZW50cywgYW5kIGNvbW1hbmRzLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBBdXRvTGlua2VyU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLnJlZ2lzdGVyVmlldyhcclxuICAgICAgICAgICAgVklFV19UWVBFX1BBUEVSX0RST1AsXHJcbiAgICAgICAgICAgIChsZWFmKSA9PiBuZXcgUGFwZXJEcm9wVmlldyhsZWFmKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUmliYm9uSWNvbignYm9vay1vcGVuJywgJ0FJIFBhcGVyIFByb2Nlc3NvcicsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZVZpZXcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6ICdhdXRvLWxpbmstY3VycmVudC1ub3RlJyxcclxuICAgICAgICAgICAgbmFtZTogJ0V4dHJhY3Qga2V5d29yZHMgYW5kIGNyZWF0ZSBiYWNrbGlua3MnLFxyXG4gICAgICAgICAgICAvLyBbRml4IDJdIHZpZXcg7YOA7J6F7J2EIE1hcmtkb3duRmlsZUluZm/quYzsp4Ag7ZmV7J6l7ZWY7JesIO2YuO2ZmOyEsSDtmZXrs7RcclxuICAgICAgICAgICAgZWRpdG9yQ2FsbGJhY2s6IChlZGl0b3I6IEVkaXRvciwgdmlldzogTWFya2Rvd25WaWV3IHwgTWFya2Rvd25GaWxlSW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ3VycmVudE5vdGUoZWRpdG9yLCB2aWV3KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvY2Vzc2VzIHRoZSBjdXJyZW50IG5vdGUgZm9yIGtleXdvcmQgZXh0cmFjdGlvbiBhbmQgbGlua2luZy5cclxuICAgICAqIFxyXG4gICAgICogUmVhZHMgdGhlIGFjdGl2ZSBub3RlLCBzZW5kcyBpdCB0byB0aGUgYmFja2VuZCBmb3Iga2V5d29yZCBleHRyYWN0aW9uLFxyXG4gICAgICogYW5kIGFwcGxpZXMgYmFja2xpbmtzIHRvIHRoZSBleHRyYWN0ZWQga2V5d29yZHMuXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBlZGl0b3IgLSBPcHRpb25hbCBlZGl0b3IgaW5zdGFuY2VcclxuICAgICAqIEBwYXJhbSB2aWV3IC0gT3B0aW9uYWwgdmlldyBpbnN0YW5jZSAoTWFya2Rvd25WaWV3IG9yIE1hcmtkb3duRmlsZUluZm8pXHJcbiAgICAgKi9cclxuICAgIC8vIFtGaXggM10g7J247J6QIO2DgOyeheydhCDtmZXsnqXtlZjqs6AsIG51bGwg6rCA64ql7ISx7J2EIOuqheyLnFxyXG4gICAgYXN5bmMgcHJvY2Vzc0N1cnJlbnROb3RlKGVkaXRvcj86IEVkaXRvciwgdmlldz86IE1hcmtkb3duVmlldyB8IE1hcmtkb3duRmlsZUluZm8gfCBudWxsKSB7XHJcbiAgICAgICAgLy8g67ew6rCAIOuEmOyWtOyYpOyngCDslYrslZjsnLzrqbQg7ZiE7J6sIO2ZnOyEsSDrt7Drpbwg6rCA7KC47Ji0XHJcbiAgICAgICAgaWYgKCF2aWV3KSB7XHJcbiAgICAgICAgICAgIHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g7Jes7KCE7Z6IIHZpZXfqsIAg7JeG6rGw64KYIGZpbGXsnbQg7JeG7Jy866m0IOyiheujjFxyXG4gICAgICAgIGlmICghdmlldyB8fCAhdmlldy5maWxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IGZpbGUgPSB2aWV3LmZpbGU7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdMaW5rcyA9IGNhY2hlPy5saW5rcz8ubGVuZ3RoIHx8IDA7XHJcblxyXG4gICAgICAgIGlmIChleGlzdGluZ0xpbmtzID49IHRoaXMuc2V0dGluZ3MuaWdub3JlVGhyZXNob2xkKSB7XHJcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYOunge2BrOqwgCDsnbTrr7ggJHtleGlzdGluZ0xpbmtzfeqwnCDsnojsirXri4jri6QuICjshKTsoJXqsJI6ICR7dGhpcy5zZXR0aW5ncy5pZ25vcmVUaHJlc2hvbGR96rCcIOydtOyDgSDsi5wg6rG064SI65yAKWApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXcgTm90aWNlKCftgqTsm4zrk5wg67aE7ISdIOykkS4uLicpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xyXG5cclxuICAgICAgICBjb25zdCBrZXl3b3JkcyA9IGF3YWl0IGZldGNoS2V5d29yZHMoY29udGVudCwgdGhpcy5zZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIGlmICgha2V5d29yZHMgfHwga2V5d29yZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoJ+y2lOy2nOuQnCDtgqTsm4zrk5zqsIAg7JeG6rGw64KYIOyEnOuyhCDsl7DqsrDsl5Ag7Iuk7Yyo7ZaI7Iq164uI64ukLicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdDb250ZW50ID0gdGhpcy5hcHBseUxpbmtzKGNvbnRlbnQsIGtleXdvcmRzKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRlbnQgIT09IG5ld0NvbnRlbnQpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIG5ld0NvbnRlbnQpO1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKGAke2tleXdvcmRzLmxlbmd0aH3qsJzsnZgg7YKk7JuM65Oc66W8IOyXsOqysO2WiOyKteuLiOuLpCFgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKCfrs4Dqsr3tlaAg64K07Jqp7J20IOyXhuyKteuLiOuLpCAo7J2066+4IOunge2BrOuQqCkuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwbGllcyBiYWNrbGlua3MgdG8ga2V5d29yZHMgaW4gdGhlIGdpdmVuIHRleHQuXHJcbiAgICAgKiBcclxuICAgICAqIFdyYXBzIG1hdGNoaW5nIGtleXdvcmRzIHdpdGggT2JzaWRpYW4ncyB3aWtpLWxpbmsgc3ludGF4IFtba2V5d29yZF1dLlxyXG4gICAgICogU2tpcHMga2V5d29yZHMgdGhhdCBhcmUgYWxyZWFkeSBsaW5rZWQgb3IgcHJlZml4ZWQgd2l0aCAjLlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gdGV4dCAtIFRoZSBvcmlnaW5hbCB0ZXh0IGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSBrZXl3b3JkcyAtIEFycmF5IG9mIGtleXdvcmRzIHRvIGxpbmtcclxuICAgICAqIEByZXR1cm5zIFRleHQgd2l0aCBrZXl3b3JkcyBjb252ZXJ0ZWQgdG8gYmFja2xpbmtzXHJcbiAgICAgKi9cclxuICAgIGFwcGx5TGlua3ModGV4dDogc3RyaW5nLCBrZXl3b3Jkczogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBuZXdUZXh0ID0gdGV4dDtcclxuXHJcbiAgICAgICAgLy8g6ri0IOuLqOyWtOu2gO2EsCDsspjrpqwgKOykkeuztSDrsKnsp4ApXHJcbiAgICAgICAgY29uc3Qgc29ydGVkS2V5d29yZHMgPSBrZXl3b3Jkcy5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgc29ydGVkS2V5d29yZHMuZm9yRWFjaChrZXl3b3JkID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIO2KueyImOusuOyekCDsnbTsiqTsvIDsnbTtlIRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVzY2FwZWRLZXl3b3JkID0ga2V5d29yZC5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlZ2V4OiDsnbTrr7gg66eB7YGs65CY6rGw64KYIO2DnOq3uCgjKeqwgCDslYTri4wg6rK97Jqw66eMIOy5mO2ZmFxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGAoPzwhXFxcXFtcXFxcW3wjKSgke2VzY2FwZWRLZXl3b3JkfSkoPyFcXFxcXVxcXFxdKWAsICdnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgbmV3VGV4dCA9IG5ld1RleHQucmVwbGFjZShyZWdleCwgJ1tbJDFdXScpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dFcnJvcihgRXJyb3IgcHJvY2Vzc2luZyBrZXl3b3JkIFwiJHtrZXl3b3JkfVwiOmAsIGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgcGx1Z2luIHNldHRpbmdzIGZyb20gZGlzay5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2F2ZXMgcGx1Z2luIHNldHRpbmdzIHRvIGRpc2suXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFjdGl2YXRlVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XHJcblxyXG4gICAgICAgIGxldCBsZWFmOiBXb3Jrc3BhY2VMZWFmIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgbGVhdmVzID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEVfUEFQRVJfRFJPUCk7XHJcblxyXG4gICAgICAgIGlmIChsZWF2ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZWFmID0gbGVhdmVzWzBdXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGVhZiA9IHdvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAobGVhZikge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEVfUEFQRVJfRFJPUCwgYWN0aXZlOiB0cnVlfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsZWFmKSB7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==