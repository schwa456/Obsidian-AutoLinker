"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchKeywords = fetchKeywords;
const tslib_1 = require("tslib");
const obsidian_1 = require("obsidian");
function fetchKeywords(text, settings) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // 텍스트가 너무 길면 자원 효율성을 위해 자르기 (약 4000자)
        const truncatedText = text.slice(0, 4000);
        try {
            const response = yield (0, obsidian_1.requestUrl)({
                url: settings.apiUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: truncatedText,
                    max_keywords: settings.maxKeywords
                })
            });
            if (response.status === 200) {
                const data = response.json;
                console.log('[AutoLinker] Extracted:', data.keywords);
                return data.keywords;
            }
            else {
                new obsidian_1.Notice(`서버 오류: ${response.status}`);
                console.error('[AutoLinker] Server responded with error:', response.text);
                return [];
            }
        }
        catch (error) {
            new obsidian_1.Notice('백엔드 서버에 연결할 수 없습니다. 서버가 켜져 있는지 확인하세요.');
            console.error('[AutoLinker] Connection failed:', error);
            return [];
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaS1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxzQ0ErQkM7O0FBdkNELHVDQUE4QztBQVE5QyxTQUFzQixhQUFhLENBQUMsSUFBWSxFQUFFLFFBQTRCOztRQUMxRSxzQ0FBc0M7UUFDdEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDO1lBQ0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHFCQUFVLEVBQUM7Z0JBQzlCLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTTtnQkFDcEIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsT0FBTyxFQUFFO29CQUNMLGNBQWMsRUFBRSxrQkFBa0I7aUJBQ3JDO2dCQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO29CQUNqQixJQUFJLEVBQUUsYUFBYTtvQkFDbkIsWUFBWSxFQUFFLFFBQVEsQ0FBQyxXQUFXO2lCQUNyQyxDQUFDO2FBQ0wsQ0FBQyxDQUFDO1lBRUgsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUMxQixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBdUIsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN6QixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osSUFBSSxpQkFBTSxDQUFDLFVBQVUsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ3hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxRSxPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksaUJBQU0sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDeEQsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0wsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVxdWVzdFVybCwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBBdXRvTGlua2VyU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJztcclxuXHJcbmludGVyZmFjZSBFeHRyYWN0UmVzcG9uc2Uge1xyXG4gICAga2V5d29yZHM6IHN0cmluZ1tdO1xyXG4gICAgY291bnQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoS2V5d29yZHModGV4dDogc3RyaW5nLCBzZXR0aW5nczogQXV0b0xpbmtlclNldHRpbmdzKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xyXG4gICAgLy8g7YWN7Iqk7Yq46rCAIOuEiOustCDquLjrqbQg7J6Q7JuQIO2aqOycqOyEseydhCDsnITtlbQg7J6Q66W06riwICjslb0gNDAwMOyekClcclxuICAgIGNvbnN0IHRydW5jYXRlZFRleHQgPSB0ZXh0LnNsaWNlKDAsIDQwMDApO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0VXJsKHtcclxuICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlVcmwsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRydW5jYXRlZFRleHQsXHJcbiAgICAgICAgICAgICAgICBtYXhfa2V5d29yZHM6IHNldHRpbmdzLm1heEtleXdvcmRzXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuanNvbiBhcyBFeHRyYWN0UmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbQXV0b0xpbmtlcl0gRXh0cmFjdGVkOicsIGRhdGEua2V5d29yZHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5rZXl3b3JkcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKGDshJzrsoQg7Jik66WYOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0F1dG9MaW5rZXJdIFNlcnZlciByZXNwb25kZWQgd2l0aCBlcnJvcjonLCByZXNwb25zZS50ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbmV3IE5vdGljZSgn67Cx7JeU65OcIOyEnOuyhOyXkCDsl7DqsrDtlaAg7IiYIOyXhuyKteuLiOuLpC4g7ISc67KE6rCAIOy8nOyguCDsnojripTsp4Ag7ZmV7J247ZWY7IS47JqULicpO1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tBdXRvTGlua2VyXSBDb25uZWN0aW9uIGZhaWxlZDonLCBlcnJvcik7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG59Il19