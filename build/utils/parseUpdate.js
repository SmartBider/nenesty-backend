"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-else-return */
/* eslint-disable guard-for-in */
const Parse = require('parse/node');
async function parseUpdate(tableName, object) {
    // Check if object exists in db
    const query = new Parse.Query(tableName);
    query.equalTo('transaction_hash', object.transaction_hash);
    const result = await query.first({ useMasterKey: true });
    if (result) {
        // Loop through object's keys
        for (const key in object) {
            result.set(key, object[key]);
        }
        return result === null || result === void 0 ? void 0 : result.save(null, { useMasterKey: true });
    }
    else {
        // Create new object
        const newObject = new Parse.Object(tableName);
        for (const key in object) {
            newObject.set(key, object[key]);
        }
        return newObject.save(null, { useMasterKey: true });
    }
}
exports.default = parseUpdate;
//# sourceMappingURL=parseUpdate.js.map