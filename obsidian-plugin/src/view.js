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
exports.PaperDropView = exports.VIEW_TYPE_PAPER_DROP = void 0;
const obsidian_1 = require("obsidian");
exports.VIEW_TYPE_PAPER_DROP = "paper-drop-view";
class PaperDropView extends obsidian_1.ItemView {
    constructor(leaf) {
        super(leaf);
    }
    getViewType() {
        return exports.VIEW_TYPE_PAPER_DROP;
    }
    getDisplayText() {
        return "AI 논문 분석가";
    }
    getIcon() {
        return "book-open";
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.containerEl.children[1];
            container.empty();
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
            dropZone.addEventListener("drop", (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                dropZone.removeClass("hover");
                if (!e.dataTransfer)
                    return;
                const files = e.dataTransfer.files;
                if (files.length === 0)
                    return;
                const file = files[0];
                if (file.type !== "application/pdf") {
                    new obsidian_1.Notice("PDF 파일만 지원합니다.");
                    return;
                }
                yield this.uploadFile(file, textEl);
            }));
        });
    }
    uploadFile(file, statusEl) {
        return __awaiter(this, void 0, void 0, function* () {
            statusEl.setText(`업로드 중: ${file.name}...`);
            new obsidian_1.Notice(`${file.name} 분석을 시작합니다.`);
            const formData = new FormData();
            formData.append("file", file);
            try {
                const response = yield fetch("http://127.0.0.1:5000/upload-paper", {
                    method: "POST",
                    body: formData
                });
                if (response.ok) {
                    const data = yield response.json();
                    statusEl.setText("✅ 분석 완료! 볼트를 확인하세요.");
                    new obsidian_1.Notice(`완료: ${data.filename}`);
                }
                else {
                    const errText = yield response.text();
                    statusEl.setText("❌ 에러 발생");
                    console.error(errText);
                    new obsidian_1.Notice("서버 에러가 발생했습니다.");
                }
            }
            catch (error) {
                statusEl.setText("⚠️ 서버 연결 실패");
                console.error(error);
                new obsidian_1.Notice("백엔드 서버가 켜져 있는지 확인하세요.");
            }
        });
    }
    onClose() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.PaperDropView = PaperDropView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTRFO0FBRS9ELFFBQUEsb0JBQW9CLEdBQUcsaUJBQWlCLENBQUM7QUFFdEQsTUFBYSxhQUFjLFNBQVEsbUJBQVE7SUFDdkMsWUFBWSxJQUFtQjtRQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVELFdBQVc7UUFDUCxPQUFPLDRCQUFvQixDQUFDO0lBQ2hDLENBQUM7SUFFRCxjQUFjO1FBQ1YsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELE9BQU87UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRUssTUFBTTs7WUFDUixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7WUFFakIsK0JBQStCO1lBQy9CLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFFaEQsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZFLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUMzRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7WUFFbkUsZ0JBQWdCO1lBQ2hCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUNuQixRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7Z0JBQ3hDLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQU8sQ0FBQyxFQUFFLEVBQUU7Z0JBQzFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDbkIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO29CQUFFLE9BQU87Z0JBQzVCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO2dCQUVuQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQztvQkFBRSxPQUFPO2dCQUUvQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRSxDQUFDO29CQUNsQyxJQUFJLGlCQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDN0IsT0FBTztnQkFDWCxDQUFDO2dCQUVELE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDdkMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxJQUFVLEVBQUUsUUFBcUI7O1lBQzlDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztZQUMzQyxJQUFJLGlCQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQztZQUV0QyxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ2hDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTlCLElBQUksQ0FBQztnQkFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRTtvQkFDL0QsTUFBTSxFQUFFLE1BQU07b0JBQ2QsSUFBSSxFQUFFLFFBQVE7aUJBQ2pCLENBQUMsQ0FBQztnQkFFSCxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDZCxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbkMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLGlCQUFNLENBQUMsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztxQkFBTSxDQUFDO29CQUNKLE1BQU0sT0FBTyxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUN0QyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2QixJQUFJLGlCQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNMLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNiLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksaUJBQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3hDLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFSyxPQUFPOztRQUViLENBQUM7S0FBQTtDQUVKO0FBM0ZELHNDQTJGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYsIE5vdGljZSwgc2V0SWNvbiwgSWNvbk5hbWV9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9QQVBFUl9EUk9QID0gXCJwYXBlci1kcm9wLXZpZXdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXBlckRyb3BWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xyXG4gICAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZikge1xyXG4gICAgICAgIHN1cGVyKGxlYWYpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFZpZXdUeXBlKCkge1xyXG4gICAgICAgIHJldHVybiBWSUVXX1RZUEVfUEFQRVJfRFJPUDtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5VGV4dCgpIHtcclxuICAgICAgICByZXR1cm4gXCJBSSDrhbzrrLgg67aE7ISd6rCAXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SWNvbigpOiBJY29uTmFtZSB7XHJcbiAgICAgICAgcmV0dXJuIFwiYm9vay1vcGVuXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25PcGVuKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyRWwuY2hpbGRyZW5bMV07XHJcbiAgICAgICAgY29udGFpbmVyLmVtcHR5KClcclxuXHJcbiAgICAgICAgLy8gMS4gVUkgU3R5bGluZyBhbmQgR2VuZXJhdGlvblxyXG4gICAgICAgIGNvbnRhaW5lci5jcmVhdGVFbChcImg0XCIsIHsgdGV4dDogXCJQREYg64W866y4IOu2hOyEnVwiIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBkcm9wWm9uZSA9IGNvbnRhaW5lci5jcmVhdGVFbChcImRpdlwiLCB7IGNsczogXCJwYXBlci1kcm9wLXpvbmVcIiB9KTtcclxuICAgICAgICBkcm9wWm9uZS5jcmVhdGVFbChcImRpdlwiLCB7IHRleHQ6IFwi8J+TglwiLCBjbHM6IFwiZHJvcC1pY29uXCIgfSk7XHJcbiAgICAgICAgY29uc3QgdGV4dEVsID0gZHJvcFpvbmUuY3JlYXRlRWwoXCJwXCIsIHsgdGV4dDogXCLsl6zquLDsl5AgUERG66W8IOuTnOuemOq3uO2VmOyEuOyalFwiIH0pO1xyXG5cclxuICAgICAgICAvLyAyLiDsnbTrsqTtirgg66as7Iqk64SIIOuTseuhnVxyXG4gICAgICAgIGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGRyb3Bab25lLmFkZENsYXNzKFwiaG92ZXJcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBkcm9wWm9uZS5yZW1vdmVDbGFzcyhcImhvdmVyXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGRyb3Bab25lLnJlbW92ZUNsYXNzKFwiaG92ZXJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWUuZGF0YVRyYW5zZmVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gZmlsZXNbMF1cclxuICAgICAgICAgICAgaWYgKGZpbGUudHlwZSAhPT0gXCJhcHBsaWNhdGlvbi9wZGZcIikge1xyXG4gICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlBERiDtjIzsnbzrp4wg7KeA7JuQ7ZWp64uI64ukLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy51cGxvYWRGaWxlKGZpbGUsIHRleHRFbClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyB1cGxvYWRGaWxlKGZpbGU6IEZpbGUsIHN0YXR1c0VsOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHN0YXR1c0VsLnNldFRleHQoYOyXheuhnOuTnCDspJE6ICR7ZmlsZS5uYW1lfS4uLmApO1xyXG4gICAgICAgIG5ldyBOb3RpY2UoYCR7ZmlsZS5uYW1lfSDrtoTshJ3snYQg7Iuc7J6R7ZWp64uI64ukLmApO1xyXG5cclxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vMTI3LjAuMC4xOjUwMDAvdXBsb2FkLXBhcGVyXCIsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0VsLnNldFRleHQoXCLinIUg67aE7ISdIOyZhOujjCEg67O87Yq466W8IO2ZleyduO2VmOyEuOyalC5cIik7XHJcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKGDsmYTro4w6ICR7ZGF0YS5maWxlbmFtZX1gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVyclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNFbC5zZXRUZXh0KFwi4p2MIOyXkOufrCDrsJzsg51cIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyclRleHQpO1xyXG4gICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIuyEnOuyhCDsl5Drn6zqsIAg67Cc7IOd7ZaI7Iq164uI64ukLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0VsLnNldFRleHQoXCLimqDvuI8g7ISc67KEIOyXsOqysCDsi6TtjKhcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKFwi67Cx7JeU65OcIOyEnOuyhOqwgCDsvJzsoLgg7J6I64qU7KeAIO2ZleyduO2VmOyEuOyalC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uQ2xvc2UoKSB7XHJcblxyXG4gICAgfVxyXG5cclxufSJdfQ==