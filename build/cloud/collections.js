"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable etc/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
//@ts-nocheck
const node_1 = __importDefault(require("parse/node"));
const config_1 = __importDefault(require("../config"));
const moralis_connect_1 = require("../config/moralis-connect");
const adminsAddress = [
    config_1.default.ADMIN_ADDRES1,
    config_1.default.ADMIN_ADDRES2,
    config_1.default.ADMIN_ADDRES3,
    config_1.default.ADMIN_ADDRES4,
    config_1.default.ADMIN_ADDRES5,
    config_1.default.ADMIN_ADDRES6,
];
/* The `Parse.Cloud.define('getUserByCollection', async (request: any) => { ... })` function is
defining a cloud function called `getUserByCollection`. */
node_1.default.Cloud.define('getUserByCollection', async (request) => {
    try {
        const { owner } = request.params;
        const query = new node_1.default.Query('User');
        query.equalTo('ethAddress', owner);
        const results = await query.first({ useMasterKey: true });
        const userAvatar = (results === null || results === void 0 ? void 0 : results.attributes.userAvatar) != null || undefined ? results === null || results === void 0 ? void 0 : results.attributes.userAvatar : '';
        const userBanner = (results === null || results === void 0 ? void 0 : results.attributes.userBanner) != null || undefined ? results === null || results === void 0 ? void 0 : results.attributes.userBanner : '';
        const username = (results === null || results === void 0 ? void 0 : results.attributes.username) != null || undefined ? results === null || results === void 0 ? void 0 : results.attributes.username : '';
        const ethAddress = (results === null || results === void 0 ? void 0 : results.attributes.ethAddress) != null || undefined ? results === null || results === void 0 ? void 0 : results.attributes.ethAddress : '';
        const user = {
            info: 'entro en getUserByCollection',
            "userAvatar": userAvatar,
            "userBanner": userBanner,
            "username": username,
            "ethAddress": ethAddress,
        };
        return user;
    }
    catch (e) {
        return e;
    }
});
/* The `Parse.Cloud.define('getCollectionsAdmin', async (request: any) => { ... })` function is
defining a cloud function called `getCollectionsAdmin`. */
node_1.default.Cloud.define('getCollectionsAdmin', async (request) => {
    const { user } = request;
    if (user) {
        const userAddress = user.get('ethAddress');
        if (adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase())) {
            const CollectionAdmins = new node_1.default.Query('CollectionsAdmins');
            CollectionAdmins.descending('updatedAt');
            const results = await CollectionAdmins.find();
            const objStr = JSON.stringify(results);
            const objJson = JSON.parse(objStr);
            // CollectionAdmins.select(['fileHash', 'name', 'owner', 'collectionAddress', 'symbol', 'description']);
            return objJson;
        }
    }
    return [];
});
/* The `Parse.Cloud.define('getCollectionFunc', async () => { ... })` function is defining a cloud
function called `getCollectionFunc`. */
node_1.default.Cloud.define('getCollectionFunc', async () => {
    const query = new node_1.default.Query('CollectionsPolygon');
    const results = await query.find();
    return results;
});
/* The `Parse.Cloud.afterSave` function is a Parse Cloud Code function that is triggered after a new
object is saved to the specified class in the Parse database. In this case, it is triggered after a
new object is saved to the "TransferLogs" class. */
node_1.default.Cloud.afterSave('TransferLogs', async (request) => {
    var _a, _b, _c, _d;
    const marketContract = moralis_connect_1.contracts.auction.toLowerCase();
    const tokenIdTransfer = (_a = request.object) === null || _a === void 0 ? void 0 : _a.get('tokenId');
    const toAddress = (_b = request.object) === null || _b === void 0 ? void 0 : _b.get('to');
    const fromAddress = (_c = request.object) === null || _c === void 0 ? void 0 : _c.get('from');
    const collectionAddress = (_d = request.object) === null || _d === void 0 ? void 0 : _d.get('address');
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('collectionAddress', collectionAddress);
    query.equalTo('tokenId', parseInt(tokenIdTransfer));
    const object = await query.first({ useMasterKey: true });
    const ownerAddress = object === null || object === void 0 ? void 0 : object.get('ownerAddress');
    const minimumBid = object === null || object === void 0 ? void 0 : object.get('minimumBid');
    if (toAddress !== marketContract &&
        ownerAddress !== toAddress &&
        fromAddress === marketContract &&
        minimumBid === 0) {
        object === null || object === void 0 ? void 0 : object.set('forSale', false);
        object === null || object === void 0 ? void 0 : object.set('minimumBid', 0);
        object === null || object === void 0 ? void 0 : object.set('buyNowPrice', 0);
        object === null || object === void 0 ? void 0 : object.set('ownerAddress', toAddress);
        object === null || object === void 0 ? void 0 : object.set('highestBid', 0);
        await (object === null || object === void 0 ? void 0 : object.save(null, { useMasterKey: true }));
    }
    if (toAddress !== marketContract &&
        ownerAddress !== toAddress &&
        fromAddress === marketContract &&
        minimumBid !== 0) {
        object === null || object === void 0 ? void 0 : object.set('forSale', false);
        object === null || object === void 0 ? void 0 : object.set('minimumBid', 0);
        object === null || object === void 0 ? void 0 : object.set('buyNowPrice', 0);
        object === null || object === void 0 ? void 0 : object.set('highestBid', 0);
        object === null || object === void 0 ? void 0 : object.set('ownerAddress', toAddress);
        await (object === null || object === void 0 ? void 0 : object.save(null, { useMasterKey: true }));
    }
});
//# sourceMappingURL=collections.js.map