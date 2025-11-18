'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWebView } from './use-webview';
import { WebViewCommands } from '@/webview/constants';

export const useDiscordActivityTracker = () => {
    const { transport } = useWebView();
    const pathname = usePathname();

    useEffect(() => {
        if (!transport) return;

        const trackActivity = async () => {
            try {
                const isRpcOn = await transport.request(WebViewCommands.GET_SETTING, { key: 'isRpcOn' });

                if (!isRpcOn) {
                    return;
                }

                let activityKey = 'board';
                if (pathname.startsWith('/discover')) {
                    activityKey = 'discover';
                } else if (pathname.startsWith('/library')) {
                    activityKey = 'library';
                } else if (pathname.startsWith('/calendar')) {
                    activityKey = 'calendar';
                } else if (pathname.startsWith('/addons')) {
                    activityKey = 'addons';
                } else if (pathname.startsWith('/settings')) {
                    activityKey = 'settings';
                }
                transport.send(WebViewCommands.SET_RPC, [activityKey]);

            } catch (error) {
                console.error("Failed to update activity:", error);
            }
        };

        trackActivity();

    }, [pathname, transport]);
};