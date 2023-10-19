"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
//@ts-nocheck
const node_1 = __importDefault(require("parse/node"));
const config_1 = __importDefault(require("../config"));
const adminsAddress = [
    config_1.default.ADMIN_ADDRES1,
    config_1.default.ADMIN_ADDRES2,
    config_1.default.ADMIN_ADDRES3,
    config_1.default.ADMIN_ADDRES4,
    config_1.default.ADMIN_ADDRES5,
    config_1.default.ADMIN_ADDRES6,
];
/* The `Parse.Cloud.define("getCompletedTDCPayments", async (request: any) => { ... })` function is a
cloud function defined in the Parse server. It retrieves a list of completed TDC (Token Distribution
Center) payments. */
node_1.default.Cloud.define('getCompletedTDCPayments', async (request) => {
    const { user } = request;
    if (user) {
        const { page } = request.params;
        const userAddress = user.get('ethAddress');
        if (adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase())) {
            const query = new node_1.default.Query('Payments');
            query.descending('updatedAt');
            query.equalTo('fulfilled', true);
            query.equalTo('completed', true);
            query.withCount();
            query.limit(10);
            query.skip(10 * (page - 1));
            const payments = await query.find({ useMasterKey: true });
            return {
                result: payments.results.map((element) => {
                    return {
                        id: element.id,
                        updatedAt: element.get('updatedAt'),
                        tokens: element.get('tokens'),
                        matic: element.get('matic'),
                        address: element.get('address'),
                        cost: element.get('cost'),
                        hashMatic: element.get('hashMatic'),
                        hashToken: element.get('hashToken'),
                    };
                }),
                count: payments.count,
            };
        }
    }
    return false;
});
/* The `Parse.Cloud.define("getFulfilledTDCPayments", async (request: any) => { ... })` function is a
cloud function defined in the Parse server. It retrieves a list of fulfilled TDC (Token Distribution
Center) payments. */
node_1.default.Cloud.define('getFulfilledTDCPayments', async (request) => {
    const { user } = request;
    if (user) {
        const { page } = request.params;
        const userAddress = user.get('ethAddress');
        if (adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase())) {
            const query = new node_1.default.Query('Payments');
            query.descending('createdAt');
            query.equalTo('fulfilled', true);
            query.equalTo('completed', false);
            query.withCount();
            query.limit(10);
            query.skip(10 * (page - 1));
            const payments = await query.find({ useMasterKey: true });
            return {
                result: payments.results.map((element) => {
                    return {
                        id: element.id,
                        createdAt: element.get('createdAt'),
                        tokens: element.get('tokens'),
                        matic: element.get('matic'),
                        address: element.get('address'),
                        cost: element.get('cost'),
                        completed: element.get('completed'),
                    };
                }),
                count: payments.count,
            };
        }
    }
    return false;
});
/* The `Parse.Cloud.define("isTDCAdmin", async (request: any) => { ... })` function is a cloud function
defined in the Parse server. It checks if the user making the request is an admin for the TDC (Token
Distribution Center) system. */
node_1.default.Cloud.define('isTDCAdmin', async (request) => {
    const { user } = request;
    if (user) {
        const userAddress = user.get('ethAddress');
        return adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase());
    }
    return false;
});
/* The `setTDCPayment` function is a cloud function defined in the Parse server. It is used to create a
new payment object in the "Payments" class. */
node_1.default.Cloud.define('setTDCPayment', async (request) => {
    const Payment = node_1.default.Object.extend('Payments');
    const payment = new Payment();
    const ACL = new node_1.default.ACL();
    ACL.setPublicReadAccess(false);
    payment.setACL(ACL);
    const result = await payment.save({
        address: request.params.address,
        tokens: request.params.tokens,
        matic: request.params.matic,
        cost: request.params.cost,
        fulfilled: false,
        completed: false,
        hashMatic: null,
        hashToken: null,
    });
    return result.id;
});
/* The `fulfillTDCPayment` function is a cloud function defined in the Parse server. It takes a request
object as a parameter and performs the following steps: */
node_1.default.Cloud.define('fulfillTDCPayment', async (request) => {
    const query = new node_1.default.Query('Payments');
    query.equalTo('objectId', request.params.id);
    const payment = await query.first({ useMasterKey: true });
    if (payment) {
        payment.set('fulfilled', true);
        const result = await payment.save(null, { useMasterKey: true });
        return {
            address: result.get('address'),
            tokens: result.get('tokens'),
            matic: result.get('matic'),
            cost: result.get('cost'),
            fulfilled: result.get('fulfilled'),
            completed: result.get('completed'),
        };
    }
    return false;
});
/* The `completeTDCPayment` function is a cloud function defined in the Parse server. It takes a
request object as a parameter and performs the following steps: */
node_1.default.Cloud.define('completeTDCPayment', async (request) => {
    const { user } = request;
    if (user) {
        const userAddress = user.get('ethAddress');
        if (adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase())) {
            const { id, hashMatic, hashToken } = request.params;
            const query = new node_1.default.Query('Payments');
            query.equalTo('objectId', id);
            query.equalTo('fulfilled', true);
            query.equalTo('completed', false);
            const payment = await query.first({ useMasterKey: true });
            if (payment) {
                payment.set('completed', true);
                payment.set('hashMatic', hashMatic);
                payment.set('hashToken', hashToken);
                const result = await payment.save(null, { useMasterKey: true });
                if (result) {
                    return true;
                }
            }
        }
    }
    return false;
});
/* The `cancelTDCPayment` function is a cloud function defined in the Parse server. It takes a request
object as a parameter and performs the following steps: */
node_1.default.Cloud.define('cancelTDCPayment', async (request) => {
    const query = new node_1.default.Query('Payments');
    query.equalTo('objectId', request.params.id);
    const payment = await query.first({ useMasterKey: true });
    if (payment) {
        await payment.destroy({ useMasterKey: true });
    }
    return true;
});
//# sourceMappingURL=stripe.js.map