"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEventData = void 0;
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
const web3helpers_1 = require("./web3helpers");
function parseEventData(req) {
    try {
        const updates = {};
        for (const log of req.body.logs) {
            const abi = req.body.abis[log.streamId];
            if (abi) {
                const { filter, update, eventName } = (0, web3helpers_1.realtimeUpsertParams)(abi, log, req.body.confirmed, req.body.block);
                return { data: update, tagName: log.tag, eventName };
            }
        }
    }
    catch (e) {
        return e;
    }
}
exports.parseEventData = parseEventData;
//# sourceMappingURL=parseEventData.js.map