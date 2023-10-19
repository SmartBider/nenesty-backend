import { RequestController } from '@moralisweb3/common-core';
export declare class ParseServerRequest {
    protected readonly requestController: RequestController;
    constructor();
    getHeaders: (useMasterKey: boolean) => {
        'X-Parse-Application-Id': string;
        'X-Parse-Master-Key'?: string | undefined;
    };
    post: <Result>({ endpoint, params, useMasterKey, }: {
        endpoint: string;
        params: Record<string, unknown>;
        useMasterKey: boolean;
    }) => Promise<Result>;
    put: <Result>({ endpoint, params, useMasterKey, }: {
        endpoint: string;
        params: Record<string, unknown>;
        useMasterKey: boolean;
    }) => Promise<Result>;
    get: <Result>({ endpoint, useMasterKey }: {
        endpoint: string;
        useMasterKey: boolean;
    }) => Promise<Result>;
}
