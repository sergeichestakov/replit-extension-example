export declare function registerMessageListener(): () => void;
export declare function handshake({ permissions, timeout }: {
    permissions: any;
    timeout: any;
}): Promise<unknown>;
export declare function request(payload: any): Promise<{
    id: string;
    payload: any;
    error: any;
    success: boolean;
}>;
