/**
 * Logger utility for development debugging.
 * Logs are disabled in production builds.
 */

const isDev =
    import.meta.env?.DEV ??
    (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production');

export const logger = {
    /**
     * Log informational messages (dev only)
     */
    log: (...args: unknown[]): void => {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.log(...args);
        }
    },

    /**
     * Log warning messages (dev only)
     */
    warn: (...args: unknown[]): void => {
        if (isDev) {
            console.warn(...args);
        }
    },

    /**
     * Log error messages (always, including production)
     */
    error: (...args: unknown[]): void => {
        console.error(...args);
    },

    /**
     * Log debug messages with a prefix (dev only)
     */
    debug: (context: string, ...args: unknown[]): void => {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.log(`[${context}]`, ...args);
        }
    },
};
