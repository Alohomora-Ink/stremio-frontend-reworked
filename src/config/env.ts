type EnvVars = {
    APP_NAME: string;
    STREMIO_WEB_URL: string;
    STREAMING_SERVER_URL: string;
};

export function getEnv(): EnvVars {
    const appName = process.env.NEXT_PUBLIC_APP_NAME;
    const stremioWebUrl = process.env.NEXT_PUBLIC_STREMIO_WEB_URL;
    const streamingServerUrl = process.env.NEXT_PUBLIC_STREAMING_SERVER_URL;

    if (!appName) {
        throw new Error("ERROR: NEXT_PUBLIC_APP_NAME is not defined in the environment.");
    }
    if (!stremioWebUrl) {
        throw new Error("ERROR: NEXT_PUBLIC_STREMIO_WEB_URL is not defined in the environment.");
    }
    if (!streamingServerUrl) {
        throw new Error("ERROR: NEXT_PUBLIC_STREAMING_SERVER_URL is not defined in the environment.");
    }

    return {
        APP_NAME: appName,
        STREMIO_WEB_URL: stremioWebUrl,
        STREAMING_SERVER_URL: streamingServerUrl,
    };
}

export const APP_CONFIG = getEnv();