"use strict";
/**
 * API Client Module.
 *
 * Handles communication with the backend server for keyword extraction.
 */
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
exports.fetchKeywords = fetchKeywords;
const obsidian_1 = require("obsidian");
const utils_1 = require("./utils");
/**
 * Fetches keywords from the backend server.
 *
 * Sends the provided text to the configured backend API and returns
 * the extracted keywords suitable for backlinking.
 *
 * @param text - The text content to analyze
 * @param settings - Plugin settings containing API configuration
 * @returns Array of extracted keywords, or empty array on error
 */
function fetchKeywords(text, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        // Truncate text for resource efficiency
        const truncatedText = text.slice(0, utils_1.TEXT_MAX_LENGTH);
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
                (0, utils_1.logDebug)(`Extracted: ${data.keywords.join(', ')}`);
                return data.keywords;
            }
            else {
                new obsidian_1.Notice(`서버 오류: ${response.status}`);
                (0, utils_1.logError)(`Server responded with error: ${response.text}`);
                return [];
            }
        }
        catch (error) {
            new obsidian_1.Notice('백엔드 서버에 연결할 수 없습니다. 서버가 켜져 있는지 확인하세요.');
            (0, utils_1.logError)('Connection failed:', error);
            return [];
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaS1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7O0FBc0JILHNDQStCQztBQW5ERCx1Q0FBOEM7QUFFOUMsbUNBQThEO0FBUTlEOzs7Ozs7Ozs7R0FTRztBQUNILFNBQXNCLGFBQWEsQ0FBQyxJQUFZLEVBQUUsUUFBNEI7O1FBQzFFLHdDQUF3QztRQUN4QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSx1QkFBZSxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDO1lBQ0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHFCQUFVLEVBQUM7Z0JBQzlCLEdBQUcsRUFBRSxRQUFRLENBQUMsTUFBTTtnQkFDcEIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsT0FBTyxFQUFFO29CQUNMLGNBQWMsRUFBRSxrQkFBa0I7aUJBQ3JDO2dCQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO29CQUNqQixJQUFJLEVBQUUsYUFBYTtvQkFDbkIsWUFBWSxFQUFFLFFBQVEsQ0FBQyxXQUFXO2lCQUNyQyxDQUFDO2FBQ0wsQ0FBQyxDQUFDO1lBRUgsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUMxQixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBdUIsQ0FBQztnQkFDOUMsSUFBQSxnQkFBUSxFQUFDLGNBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDekIsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLElBQUksaUJBQU0sQ0FBQyxVQUFVLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QyxJQUFBLGdCQUFRLEVBQUMsZ0NBQWdDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUMxRCxPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksaUJBQU0sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3BELElBQUEsZ0JBQVEsRUFBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0QyxPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUM7SUFDTCxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQVBJIENsaWVudCBNb2R1bGUuXHJcbiAqIFxyXG4gKiBIYW5kbGVzIGNvbW11bmljYXRpb24gd2l0aCB0aGUgYmFja2VuZCBzZXJ2ZXIgZm9yIGtleXdvcmQgZXh0cmFjdGlvbi5cclxuICovXHJcblxyXG5pbXBvcnQgeyByZXF1ZXN0VXJsLCBOb3RpY2UgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IEF1dG9MaW5rZXJTZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnO1xyXG5pbXBvcnQgeyBURVhUX01BWF9MRU5HVEgsIGxvZ0RlYnVnLCBsb2dFcnJvciB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuLyoqIFJlc3BvbnNlIHN0cnVjdHVyZSBmcm9tIHRoZSBleHRyYWN0IGVuZHBvaW50LiAqL1xyXG5pbnRlcmZhY2UgRXh0cmFjdFJlc3BvbnNlIHtcclxuICAgIGtleXdvcmRzOiBzdHJpbmdbXTtcclxuICAgIGNvdW50OiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGZXRjaGVzIGtleXdvcmRzIGZyb20gdGhlIGJhY2tlbmQgc2VydmVyLlxyXG4gKiBcclxuICogU2VuZHMgdGhlIHByb3ZpZGVkIHRleHQgdG8gdGhlIGNvbmZpZ3VyZWQgYmFja2VuZCBBUEkgYW5kIHJldHVybnNcclxuICogdGhlIGV4dHJhY3RlZCBrZXl3b3JkcyBzdWl0YWJsZSBmb3IgYmFja2xpbmtpbmcuXHJcbiAqIFxyXG4gKiBAcGFyYW0gdGV4dCAtIFRoZSB0ZXh0IGNvbnRlbnQgdG8gYW5hbHl6ZVxyXG4gKiBAcGFyYW0gc2V0dGluZ3MgLSBQbHVnaW4gc2V0dGluZ3MgY29udGFpbmluZyBBUEkgY29uZmlndXJhdGlvblxyXG4gKiBAcmV0dXJucyBBcnJheSBvZiBleHRyYWN0ZWQga2V5d29yZHMsIG9yIGVtcHR5IGFycmF5IG9uIGVycm9yXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hLZXl3b3Jkcyh0ZXh0OiBzdHJpbmcsIHNldHRpbmdzOiBBdXRvTGlua2VyU2V0dGluZ3MpOiBQcm9taXNlPHN0cmluZ1tdPiB7XHJcbiAgICAvLyBUcnVuY2F0ZSB0ZXh0IGZvciByZXNvdXJjZSBlZmZpY2llbmN5XHJcbiAgICBjb25zdCB0cnVuY2F0ZWRUZXh0ID0gdGV4dC5zbGljZSgwLCBURVhUX01BWF9MRU5HVEgpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0VXJsKHtcclxuICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlVcmwsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRydW5jYXRlZFRleHQsXHJcbiAgICAgICAgICAgICAgICBtYXhfa2V5d29yZHM6IHNldHRpbmdzLm1heEtleXdvcmRzXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuanNvbiBhcyBFeHRyYWN0UmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGxvZ0RlYnVnKGBFeHRyYWN0ZWQ6ICR7ZGF0YS5rZXl3b3Jkcy5qb2luKCcsICcpfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5rZXl3b3JkcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKGDshJzrsoQg7Jik66WYOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcclxuICAgICAgICAgICAgbG9nRXJyb3IoYFNlcnZlciByZXNwb25kZWQgd2l0aCBlcnJvcjogJHtyZXNwb25zZS50ZXh0fWApO1xyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBuZXcgTm90aWNlKCfrsLHsl5Trk5wg7ISc67KE7JeQIOyXsOqysO2VoCDsiJgg7JeG7Iq164uI64ukLiDshJzrsoTqsIAg7Lyc7KC4IOyeiOuKlOyngCDtmZXsnbjtlZjshLjsmpQuJyk7XHJcbiAgICAgICAgbG9nRXJyb3IoJ0Nvbm5lY3Rpb24gZmFpbGVkOicsIGVycm9yKTtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbn0iXX0=