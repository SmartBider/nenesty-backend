"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable complexity */
const node_1 = __importDefault(require("parse/node"));
// @ts-ignore
const moralis_connect_1 = require("../config/moralis-connect");
function reverseFormulaHigh(x) {
    const result = x / 8 + 1;
    return result;
}
/**
 * The function takes a value, divides it by 8, adds 1, and returns the result.
 * @param {any} x - The parameter `x` is of type `any`, which means it can be any data type.
 * @returns the result of the formula, which is the value of x divided by 8, plus 1.
 */
function reverseFormulaLow(x) {
    const result = x / 8 + 1;
    return result;
}
/* The above code is defining a Parse Cloud function called 'getCollectionSelect'. This function takes
a userAddress as a parameter. */
node_1.default.Cloud.define('getCollectionSelect', async (request) => {
    const { userAddress } = request.params;
    if (userAddress) {
        const query = new node_1.default.Query('CollectionsPolygon');
        query.equalTo('owner', userAddress);
        const results = await query.find({ useMasterKey: true });
        const defaultCollection = {
            artist: '0xb0A7c00EA503AdbdFE0071bdd9eB6Fbb18e7C6B5',
            collectionAddress: moralis_connect_1.contracts.collection,
            description: 'nenesty collection',
            fileHash: 'QmY5JjupX8gygLYBV85aMw8tCFTXoq81EuUTQPqbN3MyTz/0xb0a7c00ea503adbdfe0071bdd9eb6fbb18e7c6b5/Koolinart',
            filePath: 'https://ipfs.moralis.io:2053/ipfs/QmY5JjupX8gygLYBV85aMw8tCFTXoq81EuUTQPqbN3MyTz/0xb0a7c00ea503adbdfe0071bdd9eb6fbb18e7c6b5/Koolinart',
            name: 'Koolinart',
            owner: '0xb0A7c00EA503AdbdFE0071bdd9eB6Fbb18e7C6B5',
            symbol: 'KNRTC',
        };
        const newArr = results.map((value, _index) => {
            const objStr = JSON.stringify(value);
            const objJson = JSON.parse(objStr);
            return objJson;
        });
        newArr.push(defaultCollection);
        const reverseObj = newArr.reverse();
        return reverseObj;
    }
    return [];
});
/* The above code is defining a Parse Cloud Function called "getNftCarouselLive". This function queries
the "ItemsMinted" class in the Parse database, retrieves the latest 14 items based on their
updatedAt field, and then performs additional operations on each item. */
node_1.default.Cloud.define('getNftCarouselLive', async () => {
    const query = new node_1.default.Query('ItemsMinted');
    query.descending('updatedAt');
    query.limit(14);
    const results = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    return response;
});
/* The above code is defining a Parse Cloud Function called "getNftCarouselExplore". This function
retrieves data from the "ItemsMinted" class in the Parse database. It then iterates over the results
and for each item, it retrieves additional user information by querying the "User" class based on
the owner's address. The retrieved user information (username and userAvatar) is added to each item
object. The function then randomizes the order of the items and returns the updated list. */
node_1.default.Cloud.define('getNftCarouselExplore', async () => {
    const query = new node_1.default.Query('ItemsMinted');
    const results = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    const dataNft = JSON.stringify(response);
    const dataObjNft = JSON.parse(dataNft);
    const NewNftRender = dataObjNft
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    return NewNftRender;
});
/* The above code is defining a Parse Cloud function called 'getNftCarouselCollection'. This function
retrieves data from two Parse classes ('CollectionsPolygon' and 'ItemsMinted') and performs some
operations on the data before returning a response. */
node_1.default.Cloud.define('getNftCarouselCollection', async () => {
    const query = new node_1.default.Query('CollectionsPolygon');
    const results = await query.find({ useMasterKey: true });
    async function getUser(owner) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', owner);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const collectionAddress = objJson.collectionAddress ? objJson.collectionAddress : '';
        const owner = objJson.owner.toLowerCase();
        let newArr = [];
        const { username, userAvatar } = await getUser(owner);
        const newQuery = new node_1.default.Query('ItemsMinted');
        newQuery.equalTo('collectionAddress', collectionAddress);
        newQuery.descending('updatedAt');
        const resultsNfts = await newQuery.find({ useMasterKey: true });
        const nftcollecStr = JSON.stringify(resultsNfts);
        const nftCollecJson = JSON.parse(nftcollecStr);
        let floorPriceMath = [];
        if (nftCollecJson.length > 0) {
            floorPriceMath = nftCollecJson.reduce((prev, curr) => {
                if (curr.buyNowPrice > 0 && (curr.buyNowPrice < prev.buyNowPrice || prev.buyNowPrice === 0)) {
                    return curr;
                }
                return prev;
            });
        }
        const floorPrice = floorPriceMath.buyNowPrice;
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar, floorPrice });
        return newArr;
    }));
    return response.reverse();
});
/* The above code is defining a Parse Cloud Function called 'getNftPerfilNft'. This function takes in
two parameters, 'idConvertType' and 'collect'. */
node_1.default.Cloud.define('getNftPerfilNft', async (request) => {
    const { idConvertType, collect } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    typeof idConvertType === 'number'
        ? query.equalTo('tokenId', idConvertType)
        : query.equalTo('tokenIdAdmin', idConvertType);
    query.equalTo('collectionAddress', collect);
    const results = await query.first({ useMasterKey: true });
    const nftStr = JSON.stringify(results);
    const nftJson = JSON.parse(nftStr);
    const ObjNft = nftJson;
    const owner = (ObjNft === null || ObjNft === void 0 ? void 0 : ObjNft.ownerAddress) ? ObjNft.ownerAddress : '';
    async function getUser(owner) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', owner);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    async function getCollection(collectionSearch) {
        var _a, _b, _c, _d;
        const queryUser = new node_1.default.Query('CollectionsPolygon');
        queryUser.equalTo('collectionAddress', collectionSearch);
        const resultCollec = await queryUser.first({ useMasterKey: true });
        const fileHashImgCollec = ((_a = resultCollec === null || resultCollec === void 0 ? void 0 : resultCollec.attributes) === null || _a === void 0 ? void 0 : _a.fileHash) != null || undefined ? resultCollec === null || resultCollec === void 0 ? void 0 : resultCollec.attributes.fileHash : '';
        const symbolCollec = ((_b = resultCollec === null || resultCollec === void 0 ? void 0 : resultCollec.attributes) === null || _b === void 0 ? void 0 : _b.symbol) != null || undefined ? resultCollec === null || resultCollec === void 0 ? void 0 : resultCollec.attributes.symbol : '';
        const descriptionCollec = ((_c = resultCollec === null || resultCollec === void 0 ? void 0 : resultCollec.attributes) === null || _c === void 0 ? void 0 : _c.description) != null || undefined ? resultCollec === null || resultCollec === void 0 ? void 0 : resultCollec.attributes.description : '';
        const nameCollec = ((_d = resultCollec === null || resultCollec === void 0 ? void 0 : resultCollec.attributes) === null || _d === void 0 ? void 0 : _d.name) != null || undefined ? resultCollec === null || resultCollec === void 0 ? void 0 : resultCollec.attributes.name : '';
        return { fileHashImgCollec, symbolCollec, descriptionCollec, nameCollec };
    }
    const { username, userAvatar } = await getUser(owner);
    const { fileHashImgCollec, symbolCollec, descriptionCollec, nameCollec } = await getCollection(collect);
    const newObjNft = Object.assign(Object.assign({}, ObjNft), { fileHashImgCollec,
        symbolCollec,
        descriptionCollec,
        nameCollec,
        username,
        userAvatar });
    return newObjNft;
});
/* The above code is defining a Cloud Function in Parse Server called 'getTotalNftPageActivity'. This
function takes a request object as a parameter and performs a query on the 'Activity' class in the
Parse database based on the value of the 'typeTotal' parameter. */
node_1.default.Cloud.define('getTotalNftPageActivity', async (request) => {
    const query = new node_1.default.Query('Activity');
    const { typeTotal } = request.params;
    if (typeTotal === 'All') {
        const count = await query.count();
        return count;
    }
    if (typeTotal === 'purchased') {
        query.equalTo('stateOfHistory', 'purchased');
        const count = await query.count();
        return count;
    }
    if (typeTotal === 'createNft') {
        query.equalTo('stateOfHistory', 'createNft');
        const count = await query.count();
        return count;
    }
    if (typeTotal === 're-sold') {
        query.equalTo('stateOfHistory', 're-sold');
        const count = await query.count();
        return count;
    }
    if (typeTotal === 'createHighestBid') {
        query.equalTo('stateOfHistory', 'createHighestBid');
        const count = await query.count();
        return count;
    }
    if (typeTotal === 're-auctioned') {
        query.equalTo('stateOfHistory', 're-auctioned');
        const count = await query.count();
        return count;
    }
    return 'ok';
});
/* The above code is defining a Parse Cloud Function called 'getNftPageActivity'. This function takes
in two parameters: 'skip' and 'typePage'. */
node_1.default.Cloud.define('getNftPageActivity', async (request) => {
    const { skip, typePage } = request.params;
    const query = new node_1.default.Query('Activity');
    let newArr = [];
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    if (typePage === 'All') {
        query.descending('updatedAt');
        query.skip(skip);
        query.limit(8);
        const results = await query.find({ useMasterKey: true });
        const response = await Promise.all(results.map(async (value) => {
            const objStr = JSON.stringify(value);
            const objJson = JSON.parse(objStr);
            const { to_address } = objJson;
            const { username, userAvatar } = await getUser(to_address);
            newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
            return newArr;
        }));
        return response;
    }
    if (typePage === 'purchased') {
        query.descending('updatedAt');
        query.equalTo('stateOfHistory', 'purchased');
        query.skip(skip);
        query.limit(8);
        const results = await query.find({ useMasterKey: true });
        const response = await Promise.all(results.map(async (value) => {
            const objStr = JSON.stringify(value);
            const objJson = JSON.parse(objStr);
            const { to_address } = objJson;
            const { username, userAvatar } = await getUser(to_address);
            newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
            return newArr;
        }));
        return response;
    }
    if (typePage === 're-sold') {
        query.descending('updatedAt');
        query.equalTo('stateOfHistory', 're-sold');
        query.skip(skip);
        query.limit(8);
        const results = await query.find({ useMasterKey: true });
        const response = await Promise.all(results.map(async (value) => {
            const objStr = JSON.stringify(value);
            const objJson = JSON.parse(objStr);
            const { to_address } = objJson;
            const { username, userAvatar } = await getUser(to_address);
            newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
            return newArr;
        }));
        return response;
    }
    if (typePage === 'createNft') {
        query.descending('updatedAt');
        query.equalTo('stateOfHistory', 'createNft');
        query.skip(skip);
        query.limit(8);
        const results = await query.find({ useMasterKey: true });
        const response = await Promise.all(results.map(async (value) => {
            const objStr = JSON.stringify(value);
            const objJson = JSON.parse(objStr);
            const { to_address } = objJson;
            const { username, userAvatar } = await getUser(to_address);
            newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
            return newArr;
        }));
        return response;
    }
    if (typePage === 'createHighestBid') {
        query.descending('updatedAt');
        query.equalTo('stateOfHistory', 'createHighestBid');
        query.skip(skip);
        query.limit(8);
        const results = await query.find({ useMasterKey: true });
        const response = await Promise.all(results.map(async (value) => {
            const objStr = JSON.stringify(value);
            const objJson = JSON.parse(objStr);
            const { to_address } = objJson;
            const { username, userAvatar } = await getUser(to_address);
            newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
            return newArr;
        }));
        return response;
    }
    if (typePage === 're-auctioned') {
        query.descending('updatedAt');
        query.equalTo('stateOfHistory', 're-auctioned');
        query.skip(skip);
        query.limit(8);
        const results = await query.find({ useMasterKey: true });
        const response = await Promise.all(results.map(async (value) => {
            const objStr = JSON.stringify(value);
            const objJson = JSON.parse(objStr);
            const { to_address } = objJson;
            const { username, userAvatar } = await getUser(to_address);
            newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
            return newArr;
        }));
        return response;
    }
    return 'ok';
});
/* The above code is defining a Parse Cloud Function called "getActivityNft". This function takes in
two parameters: "itemIdActividad" and "collections". */
node_1.default.Cloud.define('getActivityNft', async (request) => {
    const { itemIdActividad, collections } = request.params;
    const query = new node_1.default.Query('Activity');
    const regex = /^[0-9]*$/;
    regex.test(itemIdActividad)
        ? query.equalTo('tokenId', itemIdActividad)
        : query.equalTo('tokenIdAdmin', itemIdActividad);
    query.equalTo('collectionAddress', collections);
    query.descending('updatedAt');
    const resultQuery = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(resultQuery.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const ownerAddress = objJson.to_address;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    return response;
});
/* The above code is defining a Parse Cloud Function called 'handleHighestRuleToAddress'. This function
takes two parameters: 'tokenId' and 'collectionAddress'. */
node_1.default.Cloud.define('handleHighestRuleToAddress', async (request) => {
    const { tokenId, collectionAddress } = request.params;
    try {
        const query = new node_1.default.Query('BidmadeLogs');
        query.equalTo('tokenId', tokenId.toString());
        query.equalTo('nftContractAddress', collectionAddress);
        query.descending('createAt');
        const result = await query.first({ useMasterKey: true });
        if (result) {
            const to_address = result === null || result === void 0 ? void 0 : result.get('bidder');
            return to_address;
        }
        throw new Error('No se encontraron resultados para la consulta');
    }
    catch (error) {
        throw error.message;
    }
});
/* The above code is defining a Cloud Function in Parse Server called 'getTotalNftExplore'. This
function takes a request object as a parameter and performs a query on the 'ItemsMinted' class in
the Parse database. */
node_1.default.Cloud.define('getTotalNftExplore', async (request) => {
    const query = new node_1.default.Query('ItemsMinted');
    const { typeTotal } = request.params;
    if (typeTotal === 'All') {
        const count = await query.count();
        return count;
    }
    if (typeTotal === 'On sale') {
        query.equalTo('forSale', true);
        const count = await query.count();
        return count;
    }
    if (typeTotal === 'No sale') {
        query.equalTo('forSale', false);
        const count = await query.count();
        return count;
    }
    if (typeTotal === 'Bids') {
        query.equalTo('marketType', 'bids');
        query.equalTo('forSale', true);
        const count = await query.count();
        return count;
    }
    return 'ok';
});
/* The above code is defining a Parse Cloud Function called 'getNftPageExplore'. This function takes a
'skip' parameter from the request and performs a query on the 'ItemsMinted' class in the Parse
database. It retrieves a list of items, skips a certain number of items based on the 'skip'
parameter, and limits the number of items to 8. */
node_1.default.Cloud.define('getNftPageExplore', async (request) => {
    const { skip } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    query.descending('updatedAt');
    query.skip(skip);
    query.limit(8);
    const results = await query.find({ useMasterKey: true });
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    const dataNft = JSON.stringify(response);
    const dataObjNft = JSON.parse(dataNft);
    const NewNftRender = dataObjNft
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    return NewNftRender;
});
/* The above code is defining a Parse Cloud function called 'getSearchExploreFilterCoincidence'. This
function takes an input value as a parameter and performs a search on the 'ItemsMinted' class in the
Parse database. It retrieves all the items from the class and filters them based on a condition. If
the name of an item matches the input value, it retrieves additional information about the owner of
the item from the 'User' class and adds it to the result. Finally, it returns the filtered result. */
node_1.default.Cloud.define('getSearchExploreFilterCoincidence', async (request) => {
    const { inputValue } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('ItemsMinted');
    query.limit(1000000);
    const resultQuery = await query.find();
    const objStr = JSON.stringify(resultQuery);
    const objJson = JSON.parse(objStr);
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    await Promise.all(objJson.map(async (element) => {
        if (inputValue.length > 0) {
            if (element.metadataNft.name.search(inputValue) === 0) {
                const { username, userAvatar } = await getUser(element.ownerAddress);
                element.username = username;
                element.userAvatar = userAvatar;
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a Parse Cloud Function called 'getSearchExplore'. This function takes in
two parameters: 'valueSearch' and 'valueSearchId'. */
node_1.default.Cloud.define('getSearchExplore', async (request) => {
    const { valueSearch, valueSearchId } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('ItemsMinted');
    query.limit(1000000);
    const resultQuery = await query.find();
    const objStr = JSON.stringify(resultQuery);
    const objJson = JSON.parse(objStr);
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    await Promise.all(objJson.map(async (element) => {
        if (valueSearch.length > 0) {
            if (element.metadataNft.name === valueSearch && element.tokenId === valueSearchId) {
                const { username, userAvatar } = await getUser(element.ownerAddress);
                element.username = username;
                element.userAvatar = userAvatar;
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a cloud function in Parse Server called 'getTotalNftPageArtworks'. This
function queries the 'ItemsMinted' class in the Parse database and retrieves the count of the total
number of items minted. The count is then returned as the result of the cloud function. */
node_1.default.Cloud.define('getTotalNftPageArtworks', async () => {
    const query = new node_1.default.Query('ItemsMinted');
    const count = await query.count();
    return count;
});
/* The above code is defining a Parse Cloud Function called "getNftPageArtworks". This function takes a
request parameter called "skip" and performs the following steps: */
node_1.default.Cloud.define('getNftPageArtworks', async (request) => {
    const { skip } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    query.descending('updatedAt');
    query.skip(skip);
    query.limit(8);
    const resultQueryAll = await query.find({ useMasterKey: true });
    const response = await Promise.all(resultQueryAll.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    return response;
});
/* The above code is defining a Parse Cloud function called 'getSearchArtworksPage'. This function
takes a parameter called 'valueSearch' and performs the following steps: */
node_1.default.Cloud.define('getSearchArtworksPage', async (request) => {
    const { valueSearch } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('tokenId', valueSearch);
    query.limit(1000000);
    const resultQuery = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(resultQuery);
    const objJson = JSON.parse(objStr);
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('_User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    await Promise.all(objJson.map(async (element) => {
        const { username, userAvatar } = await getUser(element.ownerAddress);
        element.username = username;
        element.userAvatar = userAvatar;
        resultFilter.push(element);
    }));
    return resultFilter;
});
/* The above code is defining a Parse Cloud Function called "getCollectionsFilterOptionsArtworks". This
function takes a parameter called "valueSearch" and performs the following steps: */
node_1.default.Cloud.define('getCollectionsFilterOptionsArtworks', async (request) => {
    const { valueSearch } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('CollectionsPolygon');
    query.limit(1000000);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(results);
    const objJson = JSON.parse(objStr);
    await Promise.all(objJson.map(async (element) => {
        if (valueSearch.length > 0) {
            if (element.name.search(valueSearch) === 0) {
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is a Parse Cloud function written in TypeScript. It defines a function called
"setPageColletionsArtworksFiterlOtionsAutocomplete" that takes an input value as a parameter. */
node_1.default.Cloud.define('setPageColletionsArtworksFiterlOtionsAutocomplete', async (request) => {
    const { inputValue } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('CollectionsPolygon');
    query.limit(1000000);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(results);
    const objJson = JSON.parse(objStr);
    const response = await Promise.all(objJson.map(async (element) => {
        if (inputValue.length > 0) {
            if (element.name.search(inputValue) === 0) {
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a cloud function in Parse Server called
'setFilterVariousCategoriesArtworks'. This function takes in two parameters: 'objFilter' and 'skip'. */
node_1.default.Cloud.define('setFilterVariousCategoriesArtworks', async (request) => {
    const { objFilter, skip } = request.params;
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('_User');
        queryUser.limit(10000);
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const query = new node_1.default.Query('ItemsMinted');
    query.descending('updatedAt');
    if (objFilter.status !== 'All') {
        if (objFilter.status === 'Buynow') {
            query.equalTo('forSale', true);
        }
        else if (objFilter.status === 'Bids') {
            query.equalTo('forSale', true);
            query.equalTo('marketType', 'bids');
        }
    }
    if (objFilter.minPrice !== 0) {
        // Filtrar por precio mayor que minPrice
        query.greaterThan('buyNowPrice', objFilter.minPrice);
        query.ascending('buyNowPrice');
    }
    if (objFilter.maxPrice !== 0) {
        // Y al mismo tiempo menor que maxPrice
        query.lessThan('buyNowPrice', objFilter.maxPrice);
        query.ascending('buyNowPrice');
    }
    if (objFilter.eggs !== 'All') {
        query.equalTo('metadataNft.type', objFilter.eggs);
    }
    if (objFilter.collectionsSearch !== 'All') {
        query.equalTo('collectionAddress', objFilter.collectionsSearch.id);
    }
    if (objFilter.ratio !== 'All') {
        if (objFilter.ratio === 'highRatio') {
            const items = await query.find();
            // // Aplicar el filtro personalizado aquí
            const order = { EasterEgg: 1, LegendaryEggs: 2, RareEggs: 3, UncommonEggs: 4, CommonEggs: 5 };
            const arrayOrder = [];
            const itemsMapHighRatio = await Promise.all(items.map(async (value) => {
                const objStr = JSON.stringify(value);
                let objJson = JSON.parse(objStr);
                const { ownerAddress } = objJson;
                const { username, userAvatar } = await getUser(ownerAddress);
                objJson = Object.assign(Object.assign({}, objJson), { username, userAvatar });
                arrayOrder.push(objJson);
            }));
            arrayOrder.sort((a, b) => {
                return order[a.metadataNft.type] - order[b.metadataNft.type];
            });
            const reverseSkip = reverseFormulaHigh(skip);
            const cort = (reverseSkip - 1) * 8;
            const limit = reverseSkip * 8;
            return arrayOrder.slice(cort, limit);
        }
        const items = await query.find();
        const order = { EasterEgg: 5, LegendaryEggs: 4, RareEggs: 3, UncommonEggs: 2, CommonEggs: 1 };
        const arrayOrder = [];
        const itemsMapHighRatio = await Promise.all(items.map(async (value) => {
            const objStr = JSON.stringify(value);
            let objJson = JSON.parse(objStr);
            const { ownerAddress } = objJson;
            const { username, userAvatar } = await getUser(ownerAddress);
            objJson = Object.assign(Object.assign({}, objJson), { username, userAvatar });
            arrayOrder.push(objJson);
        }));
        arrayOrder.sort((a, b) => {
            return order[a.metadataNft.type] - order[b.metadataNft.type];
        });
        const reverseSkip = reverseFormulaLow(skip);
        const cort = (reverseSkip - 1) * 8;
        const limit = reverseSkip * 8;
        return arrayOrder.slice(cort, limit);
    }
    query.limit(8);
    query.skip(skip);
    const resultQuery = await query.find({ useMasterKey: true });
    const response = await Promise.all(resultQuery.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        const { username, userAvatar } = await getUser(ownerAddress);
        return Object.assign(Object.assign({}, objJson), { username, userAvatar });
    }));
    return response;
});
/* The above code is defining a Parse Cloud Function called 'getTotalFilterVariousCategoriesArtworks'.
This function takes a request parameter 'objFilter' and performs various queries on the
'ItemsMinted' class in the Parse database based on the filter criteria provided in 'objFilter'. */
node_1.default.Cloud.define('getTotalFilterVariousCategoriesArtworks', async (request) => {
    const { objFilter } = request.params;
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('_User');
        queryUser.limit(10000);
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const query = new node_1.default.Query('ItemsMinted');
    query.descending('updatedAt');
    if (objFilter.status !== 'All') {
        if (objFilter.status === 'Buynow') {
            query.equalTo('forSale', true);
        }
        else if (objFilter.status === 'Bids') {
            query.equalTo('forSale', true);
            query.equalTo('marketType', 'bids');
        }
    }
    if (objFilter.minPrice !== 0) {
        // Filtrar por precio mayor que minPrice
        query.greaterThan('buyNowPrice', objFilter.minPrice);
        query.ascending('buyNowPrice');
    }
    if (objFilter.maxPrice !== 0) {
        // Y al mismo tiempo menor que maxPrice
        query.lessThan('buyNowPrice', objFilter.maxPrice);
        query.ascending('buyNowPrice');
    }
    if (objFilter.eggs !== 'All') {
        query.equalTo('metadataNft.type', objFilter.eggs);
    }
    if (objFilter.collectionsSearch !== 'All') {
        query.equalTo('collectionAddress', objFilter.collectionsSearch.id);
    }
    if (objFilter.ratio !== 'All') {
        if (objFilter.ratio === 'highRatio') {
            const items = await query.find();
            // // Aplicar el filtro personalizado aquí
            const order = { EasterEgg: 1, LegendaryEggs: 2, RareEggs: 3, UncommonEggs: 4, CommonEggs: 5 };
            const arrayOrder = [];
            const itemsMapHighRatio = await Promise.all(items.map(async (value) => {
                const objStr = JSON.stringify(value);
                let objJson = JSON.parse(objStr);
                const { ownerAddress } = objJson;
                const { username, userAvatar } = await getUser(ownerAddress);
                objJson = Object.assign(Object.assign({}, objJson), { username, userAvatar });
                arrayOrder.push(objJson);
            }));
            arrayOrder.sort((a, b) => {
                return order[a.metadataNft.type] - order[b.metadataNft.type];
            });
            const count = arrayOrder.length;
            return count;
        }
        const items = await query.find();
        const order = { EasterEgg: 5, LegendaryEggs: 4, RareEggs: 3, UncommonEggs: 2, CommonEggs: 1 };
        const arrayOrder = [];
        const itemsMapHighRatio = await Promise.all(items.map(async (value) => {
            const objStr = JSON.stringify(value);
            let objJson = JSON.parse(objStr);
            const { ownerAddress } = objJson;
            const { username, userAvatar } = await getUser(ownerAddress);
            objJson = Object.assign(Object.assign({}, objJson), { username, userAvatar });
            arrayOrder.push(objJson);
        }));
        arrayOrder.sort((a, b) => {
            return order[a.metadataNft.type] - order[b.metadataNft.type];
        });
        const count = arrayOrder.length;
        return count;
    }
    const count = await query.count();
    return count;
});
/* The above code is defining a Cloud Function in Parse Server that is named 'getTotalNftPageArtists'.
This function queries the 'User' class in the Parse database and retrieves the count of all users.
The count is then returned as the result of the Cloud Function. */
node_1.default.Cloud.define('getTotalNftPageArtists', async () => {
    const query = new node_1.default.Query('User');
    const count = await query.count({ useMasterKey: true });
    return count;
});
/* The above code is defining a Parse Cloud Function called "getNftPageArtists". This function takes a
"skip" parameter from the request and uses it to skip a certain number of results in a query. It
queries the "User" class in the Parse database, sorts the results in descending order based on the
"updatedAt" field, skips the specified number of results, and limits the number of results to 12. */
node_1.default.Cloud.define('getNftPageArtists', async (request) => {
    const { skip } = request.params;
    const query = new node_1.default.Query('User');
    query.descending('updatedAt');
    query.skip(skip);
    query.limit(12);
    const results = await query.find({ useMasterKey: true });
    async function getCountFollowers(ownerAddress, userNameUser) {
        const query = new node_1.default.Query('Followers');
        query.containedIn('followings', [{ userName: userNameUser, ethAddressFollowings: ownerAddress }]);
        const count = await query.count({ useMasterKey: true });
        return count;
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const userBanner = (objJson === null || objJson === void 0 ? void 0 : objJson.userBanner) ? objJson.userBanner : '';
        const userAvatar = (objJson === null || objJson === void 0 ? void 0 : objJson.userAvatar) ? objJson.userAvatar : '';
        const biography = (objJson === null || objJson === void 0 ? void 0 : objJson.biography) ? objJson.biography : '';
        const username = (objJson === null || objJson === void 0 ? void 0 : objJson.username) ? objJson.username : '';
        const fullname = (objJson === null || objJson === void 0 ? void 0 : objJson.fullname) ? objJson.fullname : '';
        const ethAddress = (objJson === null || objJson === void 0 ? void 0 : objJson.ethAddress) ? objJson.ethAddress : '';
        const theFollower = await getCountFollowers(ethAddress, username);
        let newArr = [];
        newArr = {
            userBanner,
            userAvatar,
            biography,
            username,
            fullname,
            ethAddress,
            theFollower,
        };
        return newArr;
    }));
    return response;
});
/* The above code is defining a Parse Cloud Function called 'getNftPageArtistsFilter'. This function
takes an input value as a parameter and performs a query on the 'User' class in the Parse database.
It retrieves all the users and filters them based on the input value. If the input value matches the
beginning of a user's username, the user's information (userBanner, userAvatar, biography, username,
fullname, ethAddress) is added to the resultFilter array. Finally, the function returns the
resultFilter array. */
node_1.default.Cloud.define('getNftPageArtistsFilter', async (request) => {
    const { inputValue } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('User');
    query.descending('updatedAt');
    query.limit(1000000);
    const results = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(results);
    const objJson = JSON.parse(objStr);
    await Promise.all(objJson.map(async (element) => {
        if (inputValue.length > 0) {
            if (element.username.search(inputValue) === 0) {
                const userBanner = (element === null || element === void 0 ? void 0 : element.userBanner) ? element.userBanner : '';
                const userAvatar = (element === null || element === void 0 ? void 0 : element.userAvatar) ? element.userAvatar : '';
                const biography = (element === null || element === void 0 ? void 0 : element.biography) ? element.biography : '';
                const username = (element === null || element === void 0 ? void 0 : element.username) ? element.username : '';
                const fullname = (element === null || element === void 0 ? void 0 : element.fullname) ? element.fullname : '';
                const ethAddress = (element === null || element === void 0 ? void 0 : element.ethAddress) ? element.ethAddress : '';
                const newArr = {
                    userBanner,
                    userAvatar,
                    biography,
                    username,
                    fullname,
                    ethAddress,
                };
                resultFilter.push(newArr);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a cloud function in Parse Server called 'getTotalPageExploreCollections'.
This function queries the 'CollectionsPolygon' class in the Parse database and retrieves the total
count of objects in that class. It then returns the count as the result of the cloud function. */
node_1.default.Cloud.define('getTotalPageExploreCollections', async () => {
    const query = new node_1.default.Query('CollectionsPolygon');
    const count = await query.count();
    return count;
});
/* The above code is defining a Cloud Function in Parse Server called "setPageExploreCollections". This
function takes a parameter called "skip" and performs the following steps: */
node_1.default.Cloud.define('setPageExploreCollections', async (request) => {
    const { skip } = request.params;
    const query = new node_1.default.Query('CollectionsPolygon');
    query.descending('updatedAt');
    query.skip(skip);
    query.limit(12);
    const results = await query.find({ useMasterKey: true });
    async function getUser(owner) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', owner);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const owner = objJson.owner.toLowerCase();
        let newArr = [];
        const { username, userAvatar } = await getUser(owner);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    return response;
});
/* The above code is defining a Parse Cloud function called
'setExploreCollectionsFilterOptionsAutocomplete'. This function takes an input value as a parameter
and performs a search on the 'CollectionsPolygon' class in the Parse database. It retrieves all the
objects in the class, filters them based on the input value, and returns the filtered results. The
function uses the 'useMasterKey' option to bypass any access restrictions on the database. */
node_1.default.Cloud.define('setExploreCollectionsFilterOptionsAutocomplete', async (request) => {
    const { inputValue } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('CollectionsPolygon');
    query.limit(1000000);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(results);
    const objJson = JSON.parse(objStr);
    await Promise.all(objJson.map(async (element) => {
        if (inputValue.length > 0) {
            if (element.name.search(inputValue) === 0) {
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a Parse Cloud function called 'setExploreCollectionsSearch'. This
function takes in two parameters: 'collectionName' and 'collectionAddress'. */
node_1.default.Cloud.define('setExploreCollectionsSearch', async (request) => {
    const { collectionName, collectionAddress } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('CollectionsPolygon');
    query.limit(1000000);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(results);
    const objJson = JSON.parse(objStr);
    await Promise.all(objJson.map(async (element) => {
        if (collectionName.length > 0) {
            if (element.name === collectionName && element.collectionAddress === collectionAddress) {
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a cloud function in Parse Server called 'getTotalExploreUser'. This
function queries the 'User' class in the Parse database and retrieves the total count of users. The
count is then returned as the result of the function. The 'useMasterKey' option is used to bypass
any access control restrictions and ensure that the count can be retrieved. */
node_1.default.Cloud.define('getTotalExploreUser', async () => {
    const query = new node_1.default.Query('User');
    const count = await query.count({ useMasterKey: true });
    return count;
});
/* The above code is defining a Cloud Function in Parse Server called "setPageExploreUser". This
function takes a parameter called "skip" and performs a query on the "User" class in the Parse
database. It retrieves the latest 12 users, skipping the specified number of users based on the
"skip" parameter. */
node_1.default.Cloud.define('setPageExploreUser', async (request) => {
    const { skip } = request.params;
    const query = new node_1.default.Query('User');
    query.descending('updatedAt');
    query.skip(skip);
    query.limit(12);
    const results = await query.find({ useMasterKey: true });
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const userBanner = (objJson === null || objJson === void 0 ? void 0 : objJson.userBanner) ? objJson.userBanner : '';
        const userAvatar = (objJson === null || objJson === void 0 ? void 0 : objJson.userAvatar) ? objJson.userAvatar : '';
        const biography = (objJson === null || objJson === void 0 ? void 0 : objJson.biography) ? objJson.biography : '';
        const username = (objJson === null || objJson === void 0 ? void 0 : objJson.username) ? objJson.username : '';
        const fullname = (objJson === null || objJson === void 0 ? void 0 : objJson.fullname) ? objJson.fullname : '';
        const ethAddress = (objJson === null || objJson === void 0 ? void 0 : objJson.ethAddress) ? objJson.ethAddress : '';
        let newArr = [];
        newArr = {
            userBanner,
            userAvatar,
            biography,
            username,
            fullname,
            ethAddress,
        };
        return newArr;
    }));
    return response;
});
/* The above code is a Parse Cloud function written in TypeScript. It defines a function called
'setExploreUserFilterOptionsAutocomplete' that takes an 'inputValue' parameter. */
node_1.default.Cloud.define('setExploreUserFilterOptionsAutocomplete', async (request) => {
    const { inputValue } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('_User');
    query.limit(1000000);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(results);
    const objJson = JSON.parse(objStr);
    await Promise.all(objJson.map(async (element) => {
        if (inputValue.length > 0) {
            if (element.username.search(inputValue) === 0) {
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a Parse Cloud Function called 'setExploreUserSearch'. This function takes
in two parameters, 'username' and 'ethAddress'. */
node_1.default.Cloud.define('setExploreUserSearch', async (request) => {
    const { username, ethAddress } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('_User');
    query.limit(1000000);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(results);
    const objJson = JSON.parse(objStr);
    await Promise.all(objJson.map(async (element) => {
        if (username.length > 0) {
            if (element.username === username && element.ethAddress === ethAddress) {
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a Parse Cloud Function called "getTotalPageCollections". This function
queries the "CollectionsPolygon" class in the Parse database and retrieves the total count of
objects in that class. It then returns the count as the result of the function. */
node_1.default.Cloud.define('getTotaPageCollections', async () => {
    const query = new node_1.default.Query('CollectionsPolygon');
    const count = await query.count();
    return count;
});
/* The above code is defining a Cloud Function in Parse Server called "setPageCollections". This
function takes a parameter called "skip" and performs the following steps: */
node_1.default.Cloud.define('setPageCollections', async (request) => {
    const { skip } = request.params;
    const query = new node_1.default.Query('CollectionsPolygon');
    query.descending('updatedAt');
    query.skip(skip);
    query.limit(6);
    const results = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const collecStr = JSON.stringify(value);
        const collecJson = JSON.parse(collecStr);
        const fileHash = collecJson.fileHash ? collecJson.fileHash : '';
        const name = collecJson.name ? collecJson.name : '';
        const owner = collecJson.owner ? collecJson.owner : '';
        const symbol = collecJson.symbol ? collecJson.symbol : '';
        const collectionAddress = collecJson.collectionAddress ? collecJson.collectionAddress : '';
        const description = collecJson.description ? collecJson.description : '';
        const newQuery = new node_1.default.Query('ItemsMinted');
        newQuery.equalTo('collectionAddress', collectionAddress);
        newQuery.descending('updatedAt');
        const resultsNfts = await newQuery.find({ useMasterKey: true });
        const nftcollecStr = JSON.stringify(resultsNfts);
        const nftCollecJson = JSON.parse(nftcollecStr);
        const { username, userAvatar } = await getUser(owner);
        let floorPriceMath = [];
        if (nftCollecJson.length > 0) {
            floorPriceMath = nftCollecJson.reduce((prev, curr) => {
                if (curr.buyNowPrice > 0 && (curr.buyNowPrice < prev.buyNowPrice || prev.buyNowPrice === 0)) {
                    return curr;
                }
                return prev;
            });
        }
        const floorPrice = floorPriceMath.buyNowPrice;
        const collect = nftCollecJson.length
            ? {
                colletions: { fileHash, name, owner, collectionAddress, symbol, description, username, userAvatar },
                Nft: {
                    nftCollecJson,
                    username,
                    userAvatar,
                    floorPrice,
                },
            }
            : {
                colletions: { fileHash, name, owner, collectionAddress, symbol, description, username, userAvatar },
            };
        return collect;
    }));
    return response;
});
/* The above code is defining a Parse Cloud Function called "PageCollectionsSearch". This function
takes a parameter called "valueSearch" and performs a search query on the "CollectionsPolygon" class
in the Parse database. It retrieves the first result that matches the search value. */
node_1.default.Cloud.define('PageCollectionsSearch', async (request) => {
    const { valueSearch } = request.params;
    const query = new node_1.default.Query('CollectionsPolygon');
    query.equalTo('collectionAddress', valueSearch);
    const results = await query.first({ useMasterKey: true });
    async function getUser(ownerAddress) {
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    try {
        if (results) {
            const collecStr = JSON.stringify(results);
            const collecJson = JSON.parse(collecStr);
            const fileHash = collecJson.fileHash ? collecJson.fileHash : '';
            const name = collecJson.name ? collecJson.name : '';
            const owner = collecJson.owner ? collecJson.owner : '';
            const symbol = collecJson.symbol ? collecJson.symbol : '';
            const collectionAddress = collecJson.collectionAddress ? collecJson.collectionAddress : '';
            const description = collecJson.description ? collecJson.description : '';
            const newQuery = new node_1.default.Query('ItemsMinted');
            newQuery.equalTo('collectionAddress', collectionAddress);
            newQuery.descending('updatedAt');
            const resultsItem = await newQuery.find({ useMasterKey: true });
            const nftcollecStr = JSON.stringify(resultsItem);
            const nftCollecJson = JSON.parse(nftcollecStr);
            const { username, userAvatar } = await getUser(owner);
            let floorPriceMath = [];
            if (nftCollecJson.length > 0) {
                floorPriceMath = nftCollecJson.reduce((prev, curr) => {
                    if (curr.buyNowPrice > 0 && curr.buyNowPrice < prev.buyNowPrice) {
                        return curr;
                    }
                    return prev;
                });
            }
            const floorPrice = floorPriceMath === null || floorPriceMath === void 0 ? void 0 : floorPriceMath.buyNowPrice;
            const collect = nftCollecJson.length
                ? {
                    colletions: { fileHash, name, owner, collectionAddress, symbol, description, username, userAvatar },
                    Nft: {
                        nftCollecJson,
                        username,
                        userAvatar,
                        floorPrice,
                    },
                }
                : {
                    colletions: { fileHash, name, owner, collectionAddress, symbol, description, username, userAvatar },
                };
            return collect;
        }
        return 'No found Collections search';
    }
    catch (error) {
        return error;
    }
});
/* The above code is a cloud function written in TypeScript using the Parse Server framework. It
defines a function called "setPageColletionsFiterlOtionsAutocomplete" that takes an input value as a
parameter. */
node_1.default.Cloud.define('setPageColletionsFiterlOtionsAutocomplete', async (request) => {
    const { inputValue } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('CollectionsPolygon');
    query.limit(1000000);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    const objStr = JSON.stringify(results);
    const objJson = JSON.parse(objStr);
    const response = await Promise.all(objJson.map(async (element) => {
        if (inputValue.length > 0) {
            if (element.name.search(inputValue) === 0) {
                resultFilter.push(element);
            }
        }
    }));
    return resultFilter;
});
/* The above code is defining a Parse Cloud function called "getArtistPerfilArtist". This function
takes a request parameter called "ethAddress". */
node_1.default.Cloud.define('getArtistPerfilArtist', async (request) => {
    const { ethAddress } = request.params;
    const query = new node_1.default.Query('User');
    query.equalTo('ethAddress', ethAddress);
    query.descending('updatedAt');
    const results = await query.first({ useMasterKey: true });
    const userStr = JSON.stringify(results);
    const userJson = JSON.parse(userStr);
    const userBanner = (userJson === null || userJson === void 0 ? void 0 : userJson.userBanner) ? userJson.userBanner : '';
    const userAvatar = (userJson === null || userJson === void 0 ? void 0 : userJson.userAvatar) ? userJson.userAvatar : '';
    const biography = (userJson === null || userJson === void 0 ? void 0 : userJson.biography) ? userJson.biography : '';
    const username = (userJson === null || userJson === void 0 ? void 0 : userJson.username) ? userJson.username : '';
    const fullname = (userJson === null || userJson === void 0 ? void 0 : userJson.fullname) ? userJson.fullname : '';
    let user = {};
    user = { userBanner, userAvatar, biography, username, fullname, ethAddress };
    return user;
});
/* The above code is defining a Parse Cloud Function called 'getNftPerfilArtistOwned'. This function
takes an Ethereum address as a parameter and queries the 'ItemsMinted' class in the Parse database
to find all items that are owned by the specified address. The results are sorted in descending
order based on the 'updatedAt' field. */
node_1.default.Cloud.define('getNftPerfilArtistOwned', async (request) => {
    const { ethAddress } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('ownerAddress', ethAddress);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    const dataNft = JSON.stringify(response);
    const dataObjNft = JSON.parse(dataNft);
    return dataObjNft;
});
/* The above code is defining a Parse Cloud Function called 'getNftPerfilArtistOnSale'. This function
takes an 'ethAddress' parameter and queries the 'ItemsMinted' class in the Parse database to find
items that have the specified 'ethAddress' as the owner and are marked as 'forSale'. The results are
sorted in descending order based on the 'updatedAt' field. */
node_1.default.Cloud.define('getNftPerfilArtistOnSale', async (request) => {
    const { ethAddress } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('ownerAddress', ethAddress);
    query.equalTo('forSale', true);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    const dataNft = JSON.stringify(response);
    const dataObjNft = JSON.parse(dataNft);
    return dataObjNft;
});
/* The above code is defining a Parse Cloud Function called 'getNftPerfilArtistCollection'. This
function takes an 'ethAddress' parameter and performs the following steps: */
node_1.default.Cloud.define('getNftPerfilArtistCollection', async (request) => {
    const { ethAddress } = request.params;
    const query = new node_1.default.Query('CollectionsPolygon');
    query.equalTo('owner', ethAddress);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    async function getUser(ethAddress) {
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ethAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        let newArr = [];
        const { username, userAvatar } = await getUser(ethAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    return response;
});
/* The above code is defining a Cloud Function in Parse Server called 'getCollectionPerfilCollection'.
This function takes a parameter called 'collectionAddress'. */
node_1.default.Cloud.define('getCollectionPerfilCollection', async (request) => {
    const { collectionAddress } = request.params;
    const query = new node_1.default.Query('CollectionsPolygon');
    query.equalTo('collectionAddress', collectionAddress);
    const results = await query.first({ useMasterKey: true });
    const collecStr = JSON.stringify(results);
    const collecJson = JSON.parse(collecStr);
    const fileHash = collecJson.fileHash ? collecJson.fileHash : '';
    const name = collecJson.name ? collecJson.name : '';
    const owner = collecJson.owner ? collecJson.owner : '';
    const symbol = collecJson.symbol ? collecJson.symbol : '';
    const description = collecJson.description ? collecJson.description : '';
    async function getUser(owner) {
        var _a, _b;
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', owner);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = ((_a = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _a === void 0 ? void 0 : _a.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = ((_b = resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes) === null || _b === void 0 ? void 0 : _b.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const { username, userAvatar } = await getUser(owner);
    const collect = {
        fileHash,
        name,
        owner,
        collectionAddress,
        symbol,
        description,
        username,
        userAvatar,
    };
    return collect;
});
/* The above code is defining a Parse Cloud Function called 'getNftPerfilCollectionOwned'. This
function takes a 'collectionAddress' parameter and performs a query on the 'ItemsMinted' class in
the Parse database. It retrieves all items that have a matching 'collectionAddress' value and sorts
them in descending order based on the 'updatedAt' field. */
node_1.default.Cloud.define('getNftPerfilCollectionOwned', async (request) => {
    const { collectionAddress } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('collectionAddress', collectionAddress);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    const dataNft = JSON.stringify(response);
    const dataObjNft = JSON.parse(dataNft);
    return dataObjNft;
});
/* The above code is defining a Parse Cloud Function called 'getNftPerfilCollectionOnSale'. This
function takes a 'collectionAddress' parameter and performs a query on the 'ItemsMinted' class in
the Parse database to retrieve items that have a matching 'collectionAddress'. The query results are
sorted in descending order based on the 'updatedAt' field. */
node_1.default.Cloud.define('getNftPerfilCollectionOnSale', async (request) => {
    const { collectionAddress } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('collectionAddress', collectionAddress);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    const dataNft = JSON.stringify(response);
    const dataObjNft = JSON.parse(dataNft);
    return dataObjNft;
});
/* The above code is defining a Parse Cloud Function called "getCountForTopSellers" in TypeScript. This
function takes a parameter called "collectionAddress" and performs the following steps: */
node_1.default.Cloud.define('getCountForTopSellers', async (request) => {
    const { collectionAddress } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('collectionAddress', collectionAddress);
    query.descending('updatedAt');
    const results = await query.find({ useMasterKey: true });
    async function getUser(ownerAddress) {
        const queryUser = new node_1.default.Query('User');
        queryUser.equalTo('ethAddress', ownerAddress);
        const resultUser = await queryUser.first({ useMasterKey: true });
        const username = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.username : '';
        const userAvatar = (resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar) != null || undefined ? resultUser === null || resultUser === void 0 ? void 0 : resultUser.attributes.userAvatar : '';
        return { username, userAvatar };
    }
    const response = await Promise.all(results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;
        let newArr = [];
        const { username, userAvatar } = await getUser(ownerAddress);
        newArr = Object.assign(Object.assign({}, objJson), { username, userAvatar });
        return newArr;
    }));
    const dataNft = JSON.stringify(response);
    const dataObjNft = JSON.parse(dataNft);
    return dataObjNft;
});
/* The above code is defining a Parse Cloud function called "getCountTopSeller" in TypeScript. This
function takes two parameters, "tokenId" and "collectionAddress". */
node_1.default.Cloud.define('getCountTopSeller', async (request) => {
    const { tokenId, collectionAddress } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('collectionAddress', collectionAddress);
    query.equalTo('tokenId', tokenId);
    const obj = await query.first({ useMasterKey: true });
    const countSell = (obj === null || obj === void 0 ? void 0 : obj.get('countSell')) ? obj === null || obj === void 0 ? void 0 : obj.get('countSell') : 0;
    return countSell;
});
/* The above code is a cloud function written in TypeScript using the Parse Server framework. It
defines a function called 'setTotalSoldInToken' that can be called remotely. */
node_1.default.Cloud.define('setTotalSoldInToken', async (request) => {
    const { ownerAddress, price } = request.params;
    const verifyQuery = new node_1.default.Query('User');
    verifyQuery.equalTo('ethAddress', ownerAddress);
    const obj = await verifyQuery.first({ useMasterKey: true });
    const TotalSoldInToken = (obj === null || obj === void 0 ? void 0 : obj.attributes.TotalSoldInToken) != null || undefined ? parseInt(obj === null || obj === void 0 ? void 0 : obj.attributes.TotalSoldInToken) : 0;
    if (TotalSoldInToken !== 0) {
        const amountTotal = price + TotalSoldInToken;
        obj === null || obj === void 0 ? void 0 : obj.set('TotalSoldInToken', amountTotal);
        await (obj === null || obj === void 0 ? void 0 : obj.save(null, { useMasterKey: true }));
        return 'add TotalSoldInToken successfully';
    }
    obj === null || obj === void 0 ? void 0 : obj.set('TotalSoldInToken', price);
    await (obj === null || obj === void 0 ? void 0 : obj.save(null, { useMasterKey: true }));
    return 'add new TotalSoldInToken successfully';
});
/* The above code is a Parse Cloud Code function written in TypeScript. It defines a cloud function
called 'setTotalCountSell'. */
node_1.default.Cloud.define('setTotalCountSell', async (request) => {
    const { ownerAddress } = request.params;
    const verifyQuery = new node_1.default.Query('User');
    verifyQuery.equalTo('ethAddress', ownerAddress);
    const obj = await verifyQuery.first({ useMasterKey: true });
    const TotalCountSell = (obj === null || obj === void 0 ? void 0 : obj.attributes.TotalCountSell) != null || undefined ? obj === null || obj === void 0 ? void 0 : obj.attributes.TotalCountSell : 0;
    if (TotalCountSell !== 0) {
        const totalCount = TotalCountSell + 1;
        obj === null || obj === void 0 ? void 0 : obj.set('TotalCountSell', totalCount);
        await (obj === null || obj === void 0 ? void 0 : obj.save(null, { useMasterKey: true }));
        return `add TotalSoldInToken successfully ${totalCount}`;
    }
    obj === null || obj === void 0 ? void 0 : obj.set('TotalCountSell', 1);
    await (obj === null || obj === void 0 ? void 0 : obj.save(null, { useMasterKey: true }));
    return 'add new TotalSoldInToken successfully in 1';
});
/* The above code is defining a Cloud Function in Parse Server using TypeScript. The function is named
'setColletionFilePath' and it takes a request object as a parameter. */
node_1.default.Cloud.define('setColletionFilePath', async (request) => {
    const { nameColletion } = request.params;
    const query = new node_1.default.Query('CollectionsPolygon');
    query.equalTo('collectionAddress', nameColletion);
    const results = await query.first({ useMasterKey: true });
    if (results) {
        const objStr = JSON.stringify(results);
        const objJson = JSON.parse(objStr);
        const nameFilePath = objJson.filePath;
        return nameFilePath;
    }
    return false;
});
/* The above code is defining a Parse Cloud Function called "reviewMovementCertificate". This function
queries the "generateTrafficLogs" class in the Parse database, retrieves the records in descending
order of their creation time, and returns an array of objects containing the "tokenId",
"transactionHash", and "createdAt" properties of each record. If there are no records, it returns
the string "no". */
node_1.default.Cloud.define('reviewMovementCertificate', async (request) => {
    const query = new node_1.default.Query('generateTrafficLogs');
    query.descending('createdAt');
    const results = await query.find({ useMasterKey: true });
    if (results) {
        const response = await Promise.all(results.map(async (value) => {
            const objStr = JSON.stringify(value);
            const objJson = JSON.parse(objStr);
            let newArr = [];
            const tokenId = (objJson === null || objJson === void 0 ? void 0 : objJson.tokenId) ? objJson.tokenId : '';
            const transactionHash = (objJson === null || objJson === void 0 ? void 0 : objJson.transactionHash) ? objJson.transactionHash : '';
            const createdAt = (objJson === null || objJson === void 0 ? void 0 : objJson.createdAt) ? objJson.createdAt : '';
            newArr = { tokenId, transactionHash, createdAt };
            return newArr;
        }));
        return response;
    }
    return 'no';
});
//# sourceMappingURL=renderNft.js.map