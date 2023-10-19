"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable etc/no-commented-out-code */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable complexity */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
const node_1 = __importDefault(require("parse/node"));
// @ts-ignore
const ethers_1 = require("ethers");
function selectRandomUsers(usersArray, numUsers) {
    if (usersArray.length <= numUsers) {
        return usersArray;
    }
    const selectedUsers = [];
    const copyArray = [...usersArray];
    while (selectedUsers.length < numUsers) {
        const randomIndex = Math.floor(Math.random() * copyArray.length);
        const selectedUser = copyArray[randomIndex];
        if (!selectedUsers.includes(selectedUser)) {
            selectedUsers.push(selectedUser);
        }
    }
    if (selectedUsers.length < numUsers) {
        return selectRandomUsers(usersArray, numUsers);
    }
    return selectedUsers;
}
/* The above code is defining a Cloud Function in Parse Server called "tempData". This function queries
the "TempData" class in the Parse database for objects that have the "afterSave" field set to true.
It then sorts the results in ascending order based on the "updatedAt" field. */
node_1.default.Cloud.define('tempData', async () => {
    const TempData = new node_1.default.Query('TempData');
    TempData.equalTo('afterSave', true);
    TempData.ascending('updatedAt');
    const tempData = await TempData.find({ useMasterKey: true });
    if (tempData) {
        await node_1.default.Object.destroyAll(tempData, { useMasterKey: true });
        return true;
    }
    return false;
});
/* The above code is a beforeSave cloud function in Parse Server using TypeScript. It is triggered
before saving an object of class 'ItemsMinted'. */
node_1.default.Cloud.beforeSave('ItemsMinted', async (request) => {
    var _a, _b;
    const { user, object, context } = request;
    const validate = await node_1.default.Cloud.run('tempData');
    if (validate) {
        return;
    }
    if (user) {
        const ethAddress = user.get('ethAddress');
        const roleName = 'admin';
        const isAdmin = await node_1.default.Cloud.run('checkUserRole', { roleName });
        const isAdminFront = await node_1.default.Cloud.run('checkUserRoleFront', { roleName, ethAddress });
        if (isAdmin.hasRole || isAdminFront.hasRole) {
            return;
        }
    }
    const nftContractAddress = (_a = request.object) === null || _a === void 0 ? void 0 : _a.get('collectionAddress');
    const tokenId = (_b = request.object) === null || _b === void 0 ? void 0 : _b.get('tokenId');
    if (!nftContractAddress || tokenId === null || tokenId === undefined) {
        throw new Error('collectionAddress and tokenId must be provided.');
    }
    const query = new node_1.default.Query('SalecreatedLogs');
    query.equalTo('nftContractAddress', nftContractAddress);
    query.equalTo('tokenId', tokenId.toString());
    const objectExists = await query.first({ useMasterKey: true });
    if (!objectExists) {
        throw new Error('An object with the given nftContractAddress and tokenId already exists in SalecreatedLogs. Cannot create duplicate entry in ItemsMinted.');
    }
});
/* The above code is a TypeScript cloud code function in the Parse platform. It is an afterSave trigger
for the "ItemsMinted" class. */
node_1.default.Cloud.afterSave('ItemsMinted', async (request) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { object } = request;
    const token = ((_a = request === null || request === void 0 ? void 0 : request.object) === null || _a === void 0 ? void 0 : _a.get('tokenId'))
        ? (_b = request === null || request === void 0 ? void 0 : request.object) === null || _b === void 0 ? void 0 : _b.get('tokenId')
        : (_c = request === null || request === void 0 ? void 0 : request.object) === null || _c === void 0 ? void 0 : _c.get('tokenIdAdmin');
    const likes = node_1.default.Object.extend('LikesNfts');
    const query = new node_1.default.Query(likes);
    const regex = /^[0-9]*$/;
    regex.test(token) ? query.equalTo('tokenId', token) : query.equalTo('tokenIdAdmin', token);
    query.equalTo('collectionAddress', (_d = request === null || request === void 0 ? void 0 : request.object) === null || _d === void 0 ? void 0 : _d.get('collectionAddress'));
    const existingLikesNft = await query.first();
    if (!existingLikesNft) {
        const newLikes = new likes();
        newLikes.set('metadataNft', (_e = request === null || request === void 0 ? void 0 : request.object) === null || _e === void 0 ? void 0 : _e.get('metadataNft'));
        regex.test(token)
            ? newLikes.set('tokenId', token.toString() || undefined)
            : newLikes.set('tokenIdAdmin', token.toString() || undefined);
        newLikes.set('collectionAddress', (_f = request === null || request === void 0 ? void 0 : request.object) === null || _f === void 0 ? void 0 : _f.get('collectionAddress'));
        newLikes.set('ownerAddres', (_g = request === null || request === void 0 ? void 0 : request.object) === null || _g === void 0 ? void 0 : _g.get('ownerAddres'));
        newLikes.set('likesUsers');
        await newLikes.save();
    }
});
/* The above code is an afterSave cloud function in Parse Server using TypeScript. It is triggered
after a new object is saved in the "AuctionwithdrawnLogs" class. */
node_1.default.Cloud.afterSave('AuctionwithdrawnLogs', async (request) => {
    var _a, _b;
    const { tokenId, nftContractAddress } = request.object;
    const tokenIdReqtoInt = parseInt((_a = request === null || request === void 0 ? void 0 : request.object) === null || _a === void 0 ? void 0 : _a.get('tokenId'));
    const TempData = node_1.default.Object.extend('TempData');
    const tempData = new TempData();
    tempData.set('afterSave', true);
    await tempData.save(null, { useMasterKey: true });
    const queryItemsMinted = new node_1.default.Query('ItemsMinted');
    queryItemsMinted.equalTo('tokenId', tokenIdReqtoInt);
    queryItemsMinted.equalTo('collectionAddress', (_b = request === null || request === void 0 ? void 0 : request.object) === null || _b === void 0 ? void 0 : _b.get('nftContractAddress'));
    const objectItemsMinted = await queryItemsMinted.first({ useMasterKey: true });
    if (objectItemsMinted) {
        objectItemsMinted.set('buyNowPrice', 0);
        objectItemsMinted.set('minimumBid', 0);
        objectItemsMinted.set('forSale', false);
        await objectItemsMinted.save(null, { useMasterKey: true });
    }
});
/* The above code is an afterSave cloud function in Parse Server using TypeScript. It is triggered
after a new object is saved in the "NftauctioncreatedLogs" class. */
node_1.default.Cloud.afterSave('NftauctioncreatedLogs', async (request) => {
    var _a;
    const { nftContractAddress } = request.object;
    const tokenIdReqtoInt = parseInt((_a = request === null || request === void 0 ? void 0 : request.object) === null || _a === void 0 ? void 0 : _a.get('tokenId'));
    const TempData = node_1.default.Object.extend('TempData');
    const tempData = new TempData();
    tempData.set('afterSave', true);
    await tempData.save(null, { useMasterKey: true });
});
/* The above code is an afterSave cloud function in Parse Server using TypeScript. It is triggered
after a new object is saved in the "BidmadeLogs" class. */
node_1.default.Cloud.afterSave('BidmadeLogs', async (request) => {
    var _a, _b, _c, _d, _e;
    const higherBidBidmadeLogs = (0, ethers_1.formatUnits)((_a = request.object) === null || _a === void 0 ? void 0 : _a.get('tokenAmount'), 18);
    const higherBidBidmadeLogsConverted = Math.round(parseInt(higherBidBidmadeLogs));
    const queryNftauctioncreatedLogs = new node_1.default.Query('NftauctioncreatedLogs');
    queryNftauctioncreatedLogs.equalTo('nftContractAddress', (_b = request.object) === null || _b === void 0 ? void 0 : _b.get('nftContractAddress'));
    queryNftauctioncreatedLogs.equalTo('tokenId', (_c = request.object) === null || _c === void 0 ? void 0 : _c.get('tokenId'));
    const objectNftauctioncreated = await queryNftauctioncreatedLogs.first({ useMasterKey: true });
    const minimumBidItemsMinted = (0, ethers_1.formatUnits)(objectNftauctioncreated === null || objectNftauctioncreated === void 0 ? void 0 : objectNftauctioncreated.get('minPrice'), 18);
    const minimumBidItemsMintedConverted = Math.round(parseInt(minimumBidItemsMinted));
    const queryItemsMinted = new node_1.default.Query('ItemsMinted');
    queryItemsMinted.equalTo('collectionAddress', (_d = request.object) === null || _d === void 0 ? void 0 : _d.get('nftContractAddress'));
    queryItemsMinted.equalTo('tokenId', parseInt((_e = request.object) === null || _e === void 0 ? void 0 : _e.get('tokenId')));
    const objectItemsMinted = await queryItemsMinted.first({ useMasterKey: true });
    const forSale = objectItemsMinted === null || objectItemsMinted === void 0 ? void 0 : objectItemsMinted.get('forSale');
    if (objectNftauctioncreated && objectItemsMinted) {
        if (higherBidBidmadeLogsConverted > minimumBidItemsMintedConverted) {
            if (forSale) {
                const TempData = node_1.default.Object.extend('TempData');
                const tempData = new TempData();
                tempData.set('afterSave', true);
                await tempData.save(null, { useMasterKey: true });
                objectItemsMinted === null || objectItemsMinted === void 0 ? void 0 : objectItemsMinted.set('highestBid', higherBidBidmadeLogsConverted);
                await (objectItemsMinted === null || objectItemsMinted === void 0 ? void 0 : objectItemsMinted.save(null, { useMasterKey: true }));
            }
        }
    }
});
/* The above code is defining a Parse Cloud function called 'getTotalSelling'. This function takes a
parameter called 'ethAddress'. */
node_1.default.Cloud.define('getTotalSelling', async (request) => {
    var _a;
    const { ethAddress } = request.params;
    const query = new node_1.default.Query('User');
    query.equalTo('ethAddress', ethAddress);
    query.equalTo('totalSelling', true);
    const queryResult = await query.first({ useMasterKey: true });
    let resultTotal;
    const queryValueSell = ((_a = queryResult === null || queryResult === void 0 ? void 0 : queryResult.attributes) === null || _a === void 0 ? void 0 : _a.valueSell) ? queryResult === null || queryResult === void 0 ? void 0 : queryResult.attributes.valueSell : '';
    if (!queryResult) {
        return undefined;
    }
    if (queryValueSell === '') {
        resultTotal = await (queryResult === null || queryResult === void 0 ? void 0 : queryResult.get('valueSell'));
        await resultTotal.save(null, { useMasterKey: true });
    }
    else {
        resultTotal = await (queryResult === null || queryResult === void 0 ? void 0 : queryResult.get('valueSell'));
        await resultTotal.save(null, { useMasterKey: true });
    }
    return resultTotal;
});
/* The above code is defining a Parse Cloud function called "getItemsMinted". This function takes a
request parameter called "collectionAddress". */
node_1.default.Cloud.define('getItemsMinted', async (request) => {
    const { collectionAddress } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('ownerAddress', collectionAddress);
    const queryResult = await query.first();
    return queryResult;
});
/* The above code is defining a Parse Cloud function called 'getFilterItemsHome'. This function takes
an input value as a parameter and performs the following steps: */
node_1.default.Cloud.define('getFilterItemsHome', async (request) => {
    const { inputValue } = request.params;
    const resultFilter = [];
    const query = new node_1.default.Query('ItemsMinted');
    query.limit(1000000);
    const resultQuery = await query.find();
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
/* The above code is defining a Parse Cloud Function called "getTopSellers". This function retrieves
the top 12 sellers from the "User" class in the Parse database based on the "TotalSoldInToken" field
in descending order. It then maps over the query results and creates a new array of objects
containing the user's avatar, username, Ethereum address, and total sold in tokens. Finally, it
returns the new array of top sellers. */
node_1.default.Cloud.define('getTopSellers', async () => {
    const newArrayTopseller = [];
    const query = new node_1.default.Query('User');
    query.descending('TotalSoldInToken');
    query.limit(12);
    const resultQuery = await query.find({ useMasterKey: true });
    await Promise.all(resultQuery.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const userAvatar = (objJson === null || objJson === void 0 ? void 0 : objJson.userAvatar) ? objJson.userAvatar : '';
        const username = (objJson === null || objJson === void 0 ? void 0 : objJson.username) ? objJson.username : '';
        const ethAddress = (objJson === null || objJson === void 0 ? void 0 : objJson.ethAddress) ? objJson.ethAddress : '';
        const TotalSoldInToken = (objJson === null || objJson === void 0 ? void 0 : objJson.TotalSoldInToken) ? objJson.TotalSoldInToken : '';
        const newArr = {
            userAvatar,
            username,
            ethAddress,
            TotalSoldInToken,
        };
        newArrayTopseller.push(newArr);
    }));
    return newArrayTopseller;
});
/* The above code is defining a Cloud Function called "generateTraffic1" in Parse Server using
TypeScript. This function takes in a request object and retrieves the user and limit from the
request parameters. It then checks if the user is an admin by calling another Cloud Function called
"checkUserRole2" with the roleName and ethAddress. If the user is an admin, it performs a query on
the "ItemsMinted" class to retrieve a maximum of 1000 objects where the "adminMint" field is true.
It then iterates over the query results, extracts specific fields from each object */
node_1.default.Cloud.define('generateTraffic1', async (request) => {
    const { user } = request;
    const { limit } = request.params;
    const ethAddress = user.get('ethAddress');
    const roleName = 'admin';
    const isAdmin = await node_1.default.Cloud.run('checkUserRole2', { roleName, ethAddress });
    try {
        if (isAdmin) {
            const newArrayGenerateTraffic = [];
            const DataFiles = node_1.default.Object.extend('ItemsMinted');
            const query = new node_1.default.Query(DataFiles);
            query.limit(1000);
            query.equalTo('adminMint', true);
            const resultQuery = await query.find({ useMasterKey: true });
            resultQuery.forEach((value) => {
                const objJson = value.toJSON();
                const { objectId, createdAt, updatedAt, metadataNft, tx, collectionAddress, ownerAddress, NftFileMetadataHash, NftFileMetadataPath, forSale, royalties, marketType, contractType, buyNowPrice, minimumBid, type, tokenId, imageFilePath, imageFileHash, tokenIdAdmin, adminMint, } = objJson;
                const newArr = {
                    objectId,
                    createdAt,
                    updatedAt,
                    metadataNft,
                    tx,
                    collectionAddress,
                    ownerAddress,
                    NftFileMetadataHash,
                    NftFileMetadataPath,
                    forSale,
                    royalties,
                    marketType,
                    contractType,
                    buyNowPrice,
                    minimumBid,
                    type,
                    tokenId,
                    imageFilePath,
                    imageFileHash,
                    tokenIdAdmin,
                    adminMint,
                };
                newArrayGenerateTraffic.push(newArr);
            });
            return newArrayGenerateTraffic;
        }
        throw new Error('cant generate Traffic you are not an administrator');
    }
    catch (error) {
        return error;
    }
});
/* The above code is defining a Parse Cloud function called 'generateTraffic'. This function takes in a
request object and retrieves the 'user' and 'limit' parameters from it. It then checks if the user
has the 'admin' role by calling another Parse Cloud function called 'checkUserRoleFront' with the
role name and the user's Ethereum address. If the user has the 'admin' role, the function proceeds
to query the Parse User class to find random admin users. It selects two random admin users and
assigns their Ethereum addresses to the 'from' and 'to' variables, and assigns the */
node_1.default.Cloud.define('generateTraffic', async (request) => {
    const { user } = request;
    const { limit } = request.params;
    const ethAddress = user.get('ethAddress');
    const newArrayGenerateTraffic = [];
    const roleName = 'admin';
    const isAdmin = await node_1.default.Cloud.run('checkUserRoleFront', { roleName, ethAddress });
    try {
        if (isAdmin.hasRole) {
            const randomAdminUserQuery = new node_1.default.Query(node_1.default.User);
            randomAdminUserQuery.equalTo('adminUser', true);
            const randomAdminUsers = await randomAdminUserQuery.find({ useMasterKey: true });
            let randomTwoAdminUsers = selectRandomUsers(randomAdminUsers, 3);
            let from = randomTwoAdminUsers[0].get('ethAddress');
            let to = randomTwoAdminUsers[1].get('ethAddress');
            let other = randomTwoAdminUsers[2].get('ethAddress');
            const DataFiles = node_1.default.Object.extend('ItemsMinted');
            const query = new node_1.default.Query(DataFiles);
            query.limit(limit);
            query.equalTo('ownerAddress', from);
            query.equalTo('adminMint', true);
            const resultQuery = await query.find({ useMasterKey: true });
            resultQuery.forEach((value) => {
                const objJson = value.toJSON();
                const { objectId, createdAt, updatedAt, metadataNft, tx, collectionAddress, ownerAddress, NftFileMetadataHash, NftFileMetadataPath, forSale, royalties, marketType, contractType, buyNowPrice, minimumBid, type, tokenId, imageFilePath, imageFileHash, tokenIdAdmin, adminMint, } = objJson;
                const newArr = {
                    objectId,
                    createdAt,
                    updatedAt,
                    metadataNft,
                    tx,
                    collectionAddress,
                    ownerAddress,
                    NftFileMetadataHash,
                    NftFileMetadataPath,
                    forSale,
                    royalties,
                    marketType,
                    contractType,
                    buyNowPrice,
                    minimumBid,
                    type,
                    tokenId,
                    imageFilePath,
                    imageFileHash,
                    tokenIdAdmin,
                    adminMint,
                };
                newArrayGenerateTraffic.push(newArr);
            });
            return { from, to, other, newArrayGenerateTraffic };
        }
        throw new Error('No tienes permisos de administrador para generar tráfico.');
    }
    catch (error) {
        throw new Error(`error ${error}`);
    }
});
/* The above code is defining a Cloud Function in Parse Server called 'updateActivityNftAdminBuy'. This
function takes in a request object as a parameter and extracts the 'tokenIdAdmin',
'collectionAddress', and 'nftId' values from the request parameters. */
node_1.default.Cloud.define('updateActivityNftAdminBuy', async (request) => {
    const { tokenIdAdmin, collectionAddress, nftId } = request.params;
    const ActivityQuery = new node_1.default.Query('Activity');
    ActivityQuery.equalTo('collectionAddress', collectionAddress);
    ActivityQuery.equalTo('tokenIdAdmin', tokenIdAdmin);
    const ActivityQueryResult = await ActivityQuery.find({ useMasterKey: true });
    try {
        if (ActivityQueryResult) {
            ActivityQueryResult.forEach(async (element) => {
                element === null || element === void 0 ? void 0 : element.set('tokenIdAdmin', undefined);
                element === null || element === void 0 ? void 0 : element.set('tokenId', nftId.toString());
                await (element === null || element === void 0 ? void 0 : element.save(null, { useMasterKey: true }));
            });
        }
    }
    catch (error) {
        throw new Error(`error ${error}`);
    }
});
/* The above code is defining a Parse Cloud Function called 'handleBurnNft'. This function takes in two
parameters, 'tokenId' and 'collectionAddress'. */
node_1.default.Cloud.define('handleBurnNft', async (request) => {
    const { tokenId, collectionAddress } = request.params;
    if (tokenId !== '' && tokenId !== null && collectionAddress !== '' && collectionAddress !== null) {
        const handleBurnNftQuery = new node_1.default.Query('ItemsMinted');
        handleBurnNftQuery.equalTo('collectionAddress', collectionAddress);
        handleBurnNftQuery.equalTo('tokenId', tokenId);
        const handleBurnNftQueryResult = await handleBurnNftQuery.first({ useMasterKey: true });
        try {
            if (handleBurnNftQueryResult) {
                await handleBurnNftQueryResult.destroy({ useMasterKey: true });
                return 'Object destroy';
            }
        }
        catch (error) {
            throw new Error(`error ${error}`);
        }
    }
    return 'No exits object';
});
//# sourceMappingURL=functionMarket.js.map