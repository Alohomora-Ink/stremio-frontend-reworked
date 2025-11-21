import { useCallback, useState } from 'react';

import { ActionBuilder, useStremioCore } from '@/stremio-core-ts-wrapper/src';

interface LoginResult {
    success: boolean;
    error?: string;
}

export function useLogin() {
    const { transport, triggerAuthReload } = useStremioCore();
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(
        (email: string, pass: string): Promise<LoginResult> => {
            return new Promise((resolve) => {
                if (!transport) {
                    resolve({ success: false, error: "Core not ready" });
                    return;
                }

                setIsLoading(true);

                const cleanup = () => {
                    transport.events.off("CoreEvent", handleCoreEvent);
                    transport.events.off("NewState", handleNewState);
                    setIsLoading(false);
                };

                const handleCoreEvent = (event: any) => {
                    if (event?.event === "Error") {
                        const sourceArgs = event.args?.source?.args;
                        if (sourceArgs?.type === "Login") {
                            cleanup();
                            resolve({
                                success: false,
                                error: event.args?.error?.message || "Authentication failed"
                            });
                        }
                    }
                };

                const handleNewState = (args: any) => {
                    const changedModels = Array.isArray(args) ? args.map(m => typeof m === 'string' ? m : m.model) : [args?.model];
                };

                const handleLoginFlow = (event: any) => {
                    if (event?.event === "UserAuthenticated") {
                        cleanup();
                        triggerAuthReload("login");
                        resolve({ success: true });
                    }
                    else if (event?.event === "Error") {
                        const sourceArgs = event.args?.source?.args;
                        if (sourceArgs?.type === "Login") {
                            cleanup();
                            resolve({
                                success: false,
                                error: event.args?.error?.message || "Authentication failed"
                            });
                        }
                    }
                };

                transport.events.on("CoreEvent", handleLoginFlow);

                const action = JSON.parse(ActionBuilder.Auth.login(email, pass));
                transport.dispatch(action, "ctx").catch((err) => {
                    cleanup();
                    resolve({ success: false, error: err.message });
                });

                setTimeout(() => {
                    if (isLoading) {
                        cleanup();
                        resolve({ success: false, error: "Request timed out" });
                    }
                }, 10000);
            });
        },
        [transport, isLoading, triggerAuthReload]
    );

    return { login, isLoading };
}