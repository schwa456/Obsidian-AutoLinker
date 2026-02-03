import { requestUrl, Notice } from 'obsidian';
import { AutoLinkerSettings } from './settings';

interface ExtractResponse {
    keywords: string[];
    count: number;
}

export async function fetchKeywords(text: string, settings: AutoLinkerSettings): Promise<string[]> {
    // 텍스트가 너무 길면 자원 효율성을 위해 자르기 (약 4000자)
    const truncatedText = text.slice(0, 4000);

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
            console.log('[AutoLinker] Extracted:', data.keywords);
            return data.keywords;
        } else {
            new Notice(`서버 오류: ${response.status}`);
            console.error('[AutoLinker] Server responded with error:', response.text);
            return [];
        }
    } catch (error) {
        new Notice('백엔드 서버에 연결할 수 없습니다. 서버가 켜져 있는지 확인하세요.');
        console.error('[AutoLinker] Connection failed:', error);
        return [];
    }
}