/**
 * Utility Constants and Functions Module.
 * 
 * This module contains shared constants and utility functions
 * used across the Obsidian Auto-Linker plugin.
 */

/** Maximum text length to send to the backend server for processing. */
export const TEXT_MAX_LENGTH = 4000;

/** Plugin name for logging purposes. */
export const PLUGIN_NAME = 'AutoLinker';

/**
 * Creates a console logger with plugin prefix.
 * @param message - The message to log
 */
export function logDebug(message: string): void {
    console.log(`[${PLUGIN_NAME}] ${message}`);
}

/**
 * Creates a console error logger with plugin prefix.
 * @param message - The error message to log
 * @param error - Optional error object
 */
export function logError(message: string, error?: unknown): void {
    console.error(`[${PLUGIN_NAME}] ${message}`, error || '');
}
