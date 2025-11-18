import type {
    BeginGoogleAuthPayload,
    PlayPayload,
    SeekPayload,
    SetVolumePayload,
    SetPropertyPayload,
    LoadSubtitlePayload
} from './payloads';

import { WebViewCommands } from './constants';

// A map linking each command name to its payload type
export interface WebViewCommandMap {
    [WebViewCommands.PLAY]: PlayPayload;
    [WebViewCommands.STOP]: {};
    [WebViewCommands.TOGGLE_PAUSE]: {};
    [WebViewCommands.SEEK]: SeekPayload;
    [WebViewCommands.SET_VOLUME]: SetVolumePayload;
    [WebViewCommands.TOGGLE_MUTE]: {};
    [WebViewCommands.SET_PROPERTY]: SetPropertyPayload;
    [WebViewCommands.LOAD_SUBTITLE]: LoadSubtitlePayload;
    [WebViewCommands.TOGGLE_FULLSCREEN]: {};
    [WebViewCommands.FRONTEND_READY]: {};
    [WebViewCommands.SET_RPC]: string[];
    [WebViewCommands.NAVIGATE]: string;
    [WebViewCommands.UPDATE_INSTALL]: {};
}

// A separate map for queries (commands that expect a response)
export interface WebViewQueryMap {
    [WebViewCommands.GET_SETTING]: { key: 'isAlwaysOnTop' | 'isRpcOn' };
    [WebViewCommands.GET_MODEL_STATE]: { model: string };
}

// And a map for their corresponding response types
export interface WebViewQueryResponseMap {
    [WebViewCommands.GET_SETTING]: boolean;
    [WebViewCommands.GET_MODEL_STATE]: any;
}