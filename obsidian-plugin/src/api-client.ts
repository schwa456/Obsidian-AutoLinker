/**
 * API Client Module.
 * 
 * Handles communication with the backend server for keyword extraction.
 */

import { requestUrl, Notice } from 'obsidian';
import { AutoLinkerSettings } from './settings';
import { TEXT_MAX_LENGTH, logDebug, logError } from './utils';

/** Response structure from the extract endpoint. */
interface ExtractResponse {
    keywords: string[];
    count: number;
}

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
export async function fetchKeywords(text: string, settings: AutoLinkerSettings): Promise<string[]> {
    // Truncate text for resource efficiency
    const truncatedText = text.slice(0, TEXT_MAX_LENGTH);

    try {
        const response = await requestUrl({
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
            const data = response.json as ExtractResponse;
            logDebug(`Extracted: ${data.keywords.join(', ')}`);
            return data.keywords;
        } else {
            new Notice(`서버 오류: ${response.status}`);
            logError(`Server responded with error: ${response.text}`);
            return [];
        }
    } catch (error) {
        new Notice('백엔드 서버에 연결할 수 없습니다. 서버가 켜져 있는지 확인하세요.');
        logError('Connection failed:', error);
        return [];
    }
}