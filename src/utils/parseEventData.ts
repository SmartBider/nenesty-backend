/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import { realtimeUpsertParams } from './web3helpers';

export function parseEventData(req: any) {
  try {
    const updates: any = {};
    for (const log of req.body.logs) {
      const abi = req.body.abis[log.streamId];
      if (abi) {
        const { filter, update, eventName } = realtimeUpsertParams(abi, log, req.body.confirmed, req.body.block);
        return { data: update, tagName: log.tag, eventName };
      }
    }
  } catch (e: any) {
    return e;
  }
}
