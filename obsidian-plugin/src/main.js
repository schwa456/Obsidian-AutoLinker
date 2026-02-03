"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const obsidian_1 = require("obsidian");
const settings_1 = require("./settings");
const api_client_1 = require("./api-client");
class AutoLinkerPlugin extends obsidian_1.Plugin {
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
                console.error(`Error processing keyword "${keyword}":`, e);
            }
        });
        return newText;
    }
    loadSettings() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, settings_1.DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
exports.default = AutoLinkerPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQWtGO0FBQ2xGLHlDQUF3RjtBQUN4Riw2Q0FBNkM7QUFFN0MsTUFBcUIsZ0JBQWlCLFNBQVEsaUJBQU07SUFJMUMsTUFBTTs7WUFDUixNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUUxQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksK0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRTdELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtnQkFDckQsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUNaLEVBQUUsRUFBRSx3QkFBd0I7Z0JBQzVCLElBQUksRUFBRSx1Q0FBdUM7Z0JBQzdDLGtEQUFrRDtnQkFDbEQsY0FBYyxFQUFFLENBQUMsTUFBYyxFQUFFLElBQXFDLEVBQUUsRUFBRTtvQkFDdEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUMsQ0FBQzthQUNKLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtJQUVELG9DQUFvQztJQUM5QixrQkFBa0IsQ0FBQyxNQUFlLEVBQUUsSUFBNkM7OztZQUNuRiw0QkFBNEI7WUFDNUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNSLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyx1QkFBWSxDQUFDLENBQUM7WUFDaEUsQ0FBQztZQUVELDZCQUE2QjtZQUM3QixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTztZQUVoQyxNQUFNLElBQUksR0FB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QUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxDQUFDO0tBQUE7Q0FDSjtBQTdGRCxtQ0E2RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFZGl0b3IsIE1hcmtkb3duVmlldywgTWFya2Rvd25GaWxlSW5mbywgTm90aWNlLCBQbHVnaW4gfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IEF1dG9MaW5rZXJTZXR0aW5ncywgREVGQVVMVF9TRVRUSU5HUywgQXV0b0xpbmtlclNldHRpbmdUYWIgfSBmcm9tICcuL3NldHRpbmdzJztcclxuaW1wb3J0IHsgZmV0Y2hLZXl3b3JkcyB9IGZyb20gJy4vYXBpLWNsaWVudCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvTGlua2VyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICAgIC8vIFtGaXggMV0g64qQ64KM7ZGcKCEp66W8IOu2meyXrOyEnCBcIuuCmOykkeyXkCDrrLTsobDqsbQg7ZWg64u565Cc64ukXCLqs6AgVFPsl5Dqsowg7JWM66a8XHJcbiAgICBzZXR0aW5ncyE6IEF1dG9MaW5rZXJTZXR0aW5ncztcclxuXHJcbiAgICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBBdXRvTGlua2VyU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFJpYmJvbkljb24oJ25ldHdvcmsnLCAnQXV0byBMaW5rIEtleXdvcmRzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NDdXJyZW50Tm90ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogJ2F1dG8tbGluay1jdXJyZW50LW5vdGUnLFxyXG4gICAgICAgICAgICBuYW1lOiAnRXh0cmFjdCBrZXl3b3JkcyBhbmQgY3JlYXRlIGJhY2tsaW5rcycsXHJcbiAgICAgICAgICAgIC8vIFtGaXggMl0gdmlldyDtg4DsnoXsnYQgTWFya2Rvd25GaWxlSW5mb+q5jOyngCDtmZXsnqXtlZjsl6wg7Zi47ZmY7ISxIO2ZleuztFxyXG4gICAgICAgICAgICBlZGl0b3JDYWxsYmFjazogKGVkaXRvcjogRWRpdG9yLCB2aWV3OiBNYXJrZG93blZpZXcgfCBNYXJrZG93bkZpbGVJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NDdXJyZW50Tm90ZShlZGl0b3IsIHZpZXcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gW0ZpeCAzXSDsnbjsnpAg7YOA7J6F7J2EIO2Zleyepe2VmOqzoCwgbnVsbCDqsIDriqXshLHsnYQg66qF7IucXHJcbiAgICBhc3luYyBwcm9jZXNzQ3VycmVudE5vdGUoZWRpdG9yPzogRWRpdG9yLCB2aWV3PzogTWFya2Rvd25WaWV3IHwgTWFya2Rvd25GaWxlSW5mbyB8IG51bGwpIHtcclxuICAgICAgICAvLyDrt7DqsIAg64SY7Ja07Jik7KeAIOyViuyVmOycvOuptCDtmITsnqwg7Zmc7ISxIOu3sOulvCDqsIDsoLjsmLRcclxuICAgICAgICBpZiAoIXZpZXcpIHtcclxuICAgICAgICAgICAgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDsl6zsoITtnoggdmlld+qwgCDsl4bqsbDrgpggZmlsZeydtCDsl4bsnLzrqbQg7KKF66OMXHJcbiAgICAgICAgaWYgKCF2aWV3IHx8ICF2aWV3LmZpbGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgZmlsZSA9IHZpZXcuZmlsZTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FjaGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcclxuICAgICAgICBjb25zdCBleGlzdGluZ0xpbmtzID0gY2FjaGU/LmxpbmtzPy5sZW5ndGggfHwgMDtcclxuXHJcbiAgICAgICAgaWYgKGV4aXN0aW5nTGlua3MgPj0gdGhpcy5zZXR0aW5ncy5pZ25vcmVUaHJlc2hvbGQpIHtcclxuICAgICAgICAgICAgbmV3IE5vdGljZShg66eB7YGs6rCAIOydtOuvuCAke2V4aXN0aW5nTGlua3N96rCcIOyeiOyKteuLiOuLpC4gKOyEpOygleqwkjogJHt0aGlzLnNldHRpbmdzLmlnbm9yZVRocmVzaG9sZH3qsJwg7J207IOBIOyLnCDqsbTrhIjrnIApYCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ldyBOb3RpY2UoJ+2CpOybjOuTnCDrtoTshJ0g7KSRLi4uJyk7XHJcbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGtleXdvcmRzID0gYXdhaXQgZmV0Y2hLZXl3b3Jkcyhjb250ZW50LCB0aGlzLnNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgaWYgKCFrZXl3b3JkcyB8fCBrZXl3b3Jkcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbmV3IE5vdGljZSgn7LaU7Lac65CcIO2CpOybjOuTnOqwgCDsl4bqsbDrgpgg7ISc67KEIOyXsOqysOyXkCDsi6TtjKjtlojsirXri4jri6QuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0NvbnRlbnQgPSB0aGlzLmFwcGx5TGlua3MoY29udGVudCwga2V5d29yZHMpO1xyXG5cclxuICAgICAgICBpZiAoY29udGVudCAhPT0gbmV3Q29udGVudCkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgbmV3Q29udGVudCk7XHJcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYCR7a2V5d29yZHMubGVuZ3RofeqwnOydmCDtgqTsm4zrk5zrpbwg7Jew6rKw7ZaI7Iq164uI64ukIWApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoJ+uzgOqyve2VoCDrgrTsmqnsnbQg7JeG7Iq164uI64ukICjsnbTrr7gg66eB7YGs65CoKS4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlMaW5rcyh0ZXh0OiBzdHJpbmcsIGtleXdvcmRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IG5ld1RleHQgPSB0ZXh0O1xyXG5cclxuICAgICAgICAvLyDquLQg64uo7Ja067aA7YSwIOyymOumrCAo7KSR67O1IOuwqeyngClcclxuICAgICAgICBjb25zdCBzb3J0ZWRLZXl3b3JkcyA9IGtleXdvcmRzLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpO1xyXG5cclxuICAgICAgICBzb3J0ZWRLZXl3b3Jkcy5mb3JFYWNoKGtleXdvcmQgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8g7Yq57IiY66y47J6QIOydtOyKpOy8gOydtO2UhFxyXG4gICAgICAgICAgICAgICAgY29uc3QgZXNjYXBlZEtleXdvcmQgPSBrZXl3b3JkLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVnZXg6IOydtOuvuCDrp4HtgazrkJjqsbDrgpgg7YOc6re4KCMp6rCAIOyVhOuLjCDqsr3smrDrp4wg7LmY7ZmYXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYCg/PCFcXFxcW1xcXFxbfCMpKCR7ZXNjYXBlZEtleXdvcmR9KSg/IVxcXFxdXFxcXF0pYCwgJ2cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdUZXh0ID0gbmV3VGV4dC5yZXBsYWNlKHJlZ2V4LCAnW1skMV1dJyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHByb2Nlc3Npbmcga2V5d29yZCBcIiR7a2V5d29yZH1cIjpgLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgICB9XHJcbn0iXX0=