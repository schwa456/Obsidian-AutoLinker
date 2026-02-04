"use strict";
/**
 * API Client Module.
 *
 * Handles communication with the backend server for keyword extraction.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchKeywords = fetchKeywords;
const tslib_1 = require("tslib");
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaS1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBc0JILHNDQStCQzs7QUFuREQsdUNBQThDO0FBRTlDLG1DQUE4RDtBQVE5RDs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFzQixhQUFhLENBQUMsSUFBWSxFQUFFLFFBQTRCOztRQUMxRSx3Q0FBd0M7UUFDeEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsdUJBQWUsQ0FBQyxDQUFDO1FBRXJELElBQUksQ0FBQztZQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxxQkFBVSxFQUFDO2dCQUM5QixHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU07Z0JBQ3BCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE9BQU8sRUFBRTtvQkFDTCxjQUFjLEVBQUUsa0JBQWtCO2lCQUNyQztnQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDakIsSUFBSSxFQUFFLGFBQWE7b0JBQ25CLFlBQVksRUFBRSxRQUFRLENBQUMsV0FBVztpQkFDckMsQ0FBQzthQUNMLENBQUMsQ0FBQztZQUVILElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDMUIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQXVCLENBQUM7Z0JBQzlDLElBQUEsZ0JBQVEsRUFBQyxjQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbkQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3pCLENBQUM7aUJBQU0sQ0FBQztnQkFDSixJQUFJLGlCQUFNLENBQUMsVUFBVSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDeEMsSUFBQSxnQkFBUSxFQUFDLGdDQUFnQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDMUQsT0FBTyxFQUFFLENBQUM7WUFDZCxDQUFDO1FBQ0wsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLGlCQUFNLENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUNwRCxJQUFBLGdCQUFRLEVBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0wsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEFQSSBDbGllbnQgTW9kdWxlLlxyXG4gKiBcclxuICogSGFuZGxlcyBjb21tdW5pY2F0aW9uIHdpdGggdGhlIGJhY2tlbmQgc2VydmVyIGZvciBrZXl3b3JkIGV4dHJhY3Rpb24uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgcmVxdWVzdFVybCwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBBdXRvTGlua2VyU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJztcclxuaW1wb3J0IHsgVEVYVF9NQVhfTEVOR1RILCBsb2dEZWJ1ZywgbG9nRXJyb3IgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbi8qKiBSZXNwb25zZSBzdHJ1Y3R1cmUgZnJvbSB0aGUgZXh0cmFjdCBlbmRwb2ludC4gKi9cclxuaW50ZXJmYWNlIEV4dHJhY3RSZXNwb25zZSB7XHJcbiAgICBrZXl3b3Jkczogc3RyaW5nW107XHJcbiAgICBjb3VudDogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogRmV0Y2hlcyBrZXl3b3JkcyBmcm9tIHRoZSBiYWNrZW5kIHNlcnZlci5cclxuICogXHJcbiAqIFNlbmRzIHRoZSBwcm92aWRlZCB0ZXh0IHRvIHRoZSBjb25maWd1cmVkIGJhY2tlbmQgQVBJIGFuZCByZXR1cm5zXHJcbiAqIHRoZSBleHRyYWN0ZWQga2V5d29yZHMgc3VpdGFibGUgZm9yIGJhY2tsaW5raW5nLlxyXG4gKiBcclxuICogQHBhcmFtIHRleHQgLSBUaGUgdGV4dCBjb250ZW50IHRvIGFuYWx5emVcclxuICogQHBhcmFtIHNldHRpbmdzIC0gUGx1Z2luIHNldHRpbmdzIGNvbnRhaW5pbmcgQVBJIGNvbmZpZ3VyYXRpb25cclxuICogQHJldHVybnMgQXJyYXkgb2YgZXh0cmFjdGVkIGtleXdvcmRzLCBvciBlbXB0eSBhcnJheSBvbiBlcnJvclxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoS2V5d29yZHModGV4dDogc3RyaW5nLCBzZXR0aW5nczogQXV0b0xpbmtlclNldHRpbmdzKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xyXG4gICAgLy8gVHJ1bmNhdGUgdGV4dCBmb3IgcmVzb3VyY2UgZWZmaWNpZW5jeVxyXG4gICAgY29uc3QgdHJ1bmNhdGVkVGV4dCA9IHRleHQuc2xpY2UoMCwgVEVYVF9NQVhfTEVOR1RIKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdFVybCh7XHJcbiAgICAgICAgICAgIHVybDogc2V0dGluZ3MuYXBpVXJsLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0cnVuY2F0ZWRUZXh0LFxyXG4gICAgICAgICAgICAgICAgbWF4X2tleXdvcmRzOiBzZXR0aW5ncy5tYXhLZXl3b3Jkc1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmpzb24gYXMgRXh0cmFjdFJlc3BvbnNlO1xyXG4gICAgICAgICAgICBsb2dEZWJ1ZyhgRXh0cmFjdGVkOiAke2RhdGEua2V5d29yZHMuam9pbignLCAnKX1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEua2V5d29yZHM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3IE5vdGljZShg7ISc67KEIOyYpOulmDogJHtyZXNwb25zZS5zdGF0dXN9YCk7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBTZXJ2ZXIgcmVzcG9uZGVkIHdpdGggZXJyb3I6ICR7cmVzcG9uc2UudGV4dH1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbmV3IE5vdGljZSgn67Cx7JeU65OcIOyEnOuyhOyXkCDsl7DqsrDtlaAg7IiYIOyXhuyKteuLiOuLpC4g7ISc67KE6rCAIOy8nOyguCDsnojripTsp4Ag7ZmV7J247ZWY7IS47JqULicpO1xyXG4gICAgICAgIGxvZ0Vycm9yKCdDb25uZWN0aW9uIGZhaWxlZDonLCBlcnJvcik7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG59Il19