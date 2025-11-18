export type PendingRequest = {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
};