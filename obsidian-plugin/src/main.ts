import { Editor, MarkdownView, MarkdownFileInfo, Notice, Plugin, WorkspaceLeaf } from 'obsidian';
import { AutoLinkerSettings, DEFAULT_SETTINGS, AutoLinkerSettingTab } from './settings';
import { fetchKeywords } from './api-client';
import { logError } from './utils';
import {PaperDropView, VIEW_TYPE_PAPER_DROP} from "./view";


export default class AutoLinkerPlugin extends Plugin {
    settings!: AutoLinkerSettings;

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

        this.addRibbonIcon('book-open', 'AI Paper Processor', () => {
            this.activateView();
        });

        this.addCommand({
            id: 'auto-link-current-note',
            name: 'Extract keywords and create backlinks',
            // [Fix 2] view 타입을 MarkdownFileInfo까지 확장하여 호환성 확보
            editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
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
    async processCurrentNote(editor?: Editor, view?: MarkdownView | MarkdownFileInfo | null) {
        // 뷰가 넘어오지 않았으면 현재 활성 뷰를 가져옴
        if (!view) {
            view = this.app.workspace.getActiveViewOfType(MarkdownView);
        }

        // 여전히 view가 없거나 file이 없으면 종료
        if (!view || !view.file) return;

        const file = view.file;

        const cache = this.app.metadataCache.getFileCache(file);
        const existingLinks = cache?.links?.length || 0;

        if (existingLinks >= this.settings.ignoreThreshold) {
            new Notice(`링크가 이미 ${existingLinks}개 있습니다. (설정값: ${this.settings.ignoreThreshold}개 이상 시 건너뜀)`);
            return;
        }

        new Notice('키워드 분석 중...');
        const content = await this.app.vault.read(file);

        const keywords = await fetchKeywords(content, this.settings);

        if (!keywords || keywords.length === 0) {
            new Notice('추출된 키워드가 없거나 서버 연결에 실패했습니다.');
            return;
        }

        const newContent = this.applyLinks(content, keywords);

        if (content !== newContent) {
            await this.app.vault.modify(file, newContent);
            new Notice(`${keywords.length}개의 키워드를 연결했습니다!`);
        } else {
            new Notice('변경할 내용이 없습니다 (이미 링크됨).');
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
    applyLinks(text: string, keywords: string[]): string {
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

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_PAPER_DROP);

        if (leaves.length > 0) {
            leaf = leaves[0]
        } else {
            leaf = workspace.getRightLeaf(false);
            if (leaf) {
                await leaf.setViewState({ type: VIEW_TYPE_PAPER_DROP, active: true});
            }
        }

        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }
}