declare function realtimeUpsertTxParams(trxData: any, confirmed: any, block: any): {
    filter: {
        transaction_hash: any;
        transaction_index: any;
    };
    update: any;
};
declare function realtimeUpsertParams(abi: any, trxData: any, confirmed: any, block: any): {
    filter: {
        transaction_hash: any;
        log_index: any;
    };
    update: any;
};
declare const _default: {
    realtimeUpsertParams: typeof realtimeUpsertParams;
    realtimeUpsertTxParams: typeof realtimeUpsertTxParams;
};
export default _default;
