import {ItemView, WorkspaceLeaf, Notice, setIcon, IconName} from "obsidian";

export const VIEW_TYPE_PAPER_DROP = "paper-drop-view";

export class PaperDropView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_PAPER_DROP;
    }

    getDisplayText() {
        return "AI 논문 분석가";
    }

    getIcon(): IconName {
        return "book-open";
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty()

        // 1. UI Styling and Generation
        container.createEl("h4", { text: "PDF 논문 분석" });

        const dropZone = container.createEl("div", { cls: "paper-drop-zone" });
        dropZone.createEl("div", { text: "📂", cls: "drop-icon" });
        const textEl = dropZone.createEl("p", { text: "여기에 PDF를 드래그하세요" });

        // 2. 이벤트 리스너 등록
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

            const file = files[0]
            if (file.type !== "application/pdf") {
                new Notice("PDF 파일만 지원합니다.");
                return;
            }

            await this.uploadFile(file, textEl)
        });
    }

    async uploadFile(file: File, statusEl: HTMLElement) {
        statusEl.setText(`업로드 중: ${file.name}...`);
        new Notice(`${file.name} 분석을 시작합니다.`);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload-paper", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                statusEl.setText("✅ 분석 완료! 볼트를 확인하세요.");
                new Notice(`완료: ${data.filename}`);
            } else {
                const errText = await response.text();
                statusEl.setText("❌ 에러 발생");
                console.error(errText);
                new Notice("서버 에러가 발생했습니다.");
            }
        } catch (error) {
            statusEl.setText("⚠️ 서버 연결 실패");
            console.error(error);
            new Notice("백엔드 서버가 켜져 있는지 확인하세요.");
        }
    }

    async onClose() {

    }

}