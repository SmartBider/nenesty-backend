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
import Parse from 'parse/node';
// @ts-ignore
import { formatUnits } from 'ethers';

function selectRandomUsers(usersArray: any[], numUsers: any): any[] {
  if (usersArray.length <= numUsers) {
    return usersArray;
  }

  const selectedUsers: any[] = [];
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
Parse.Cloud.define('tempData', async () => {
  const TempData = new Parse.Query('TempData');
  TempData.equalTo('afterSave', true);
  TempData.ascending('updatedAt');
  const tempData: any = await TempData.find({ useMasterKey: true });

  if (tempData) {
    await Parse.Object.destroyAll(tempData, { useMasterKey: true });
    return true;
  }
  return false;
});

/* The above code is a beforeSave cloud function in Parse Server using TypeScript. It is triggered
before saving an object of class 'ItemsMinted'. */
Parse.Cloud.beforeSave('ItemsMinted', async (request: any) => {
  const { user, object, context } = request;

  const validate = await Parse.Cloud.run('tempData');

  if (validate) {
    return;
  }

  if (user) {
    const ethAddress = user.get('ethAddress');

    const roleName = 'admin';
    const isAdmin = await Parse.Cloud.run('checkUserRole', { roleName });
    const isAdminFront = await Parse.Cloud.run('checkUserRoleFront', { roleName, ethAddress });

    if (isAdmin.hasRole || isAdminFront.hasRole) {
      return;
    }
  }

  const nftContractAddress = request.object?.get('collectionAddress');
  const tokenId = request.object?.get('tokenId');

  if (!nftContractAddress || tokenId === null || tokenId === undefined) {
    throw new Error('collectionAddress and tokenId must be provided.');
  }

  const query = new Parse.Query('SalecreatedLogs');
  query.equalTo('nftContractAddress', nftContractAddress);
  query.equalTo('tokenId', tokenId.toString());

  const objectExists = await query.first({ useMasterKey: true });

  if (!objectExists) {
    throw new Error(
      'An object with the given nftContractAddress and tokenId already exists in SalecreatedLogs. Cannot create duplicate entry in ItemsMinted.',
    );
  }
});

/* The above code is a TypeScript cloud code function in the Parse platform. It is an afterSave trigger
for the "ItemsMinted" class. */
Parse.Cloud.afterSave('ItemsMinted', async (request: any) => {
  const { object } = request;

  const token = request?.object?.get('tokenId')
    ? request?.object?.get('tokenId')
    : request?.object?.get('tokenIdAdmin');

  const likes = Parse.Object.extend('LikesNfts');
  const query = new Parse.Query(likes);

  const regex = /^[0-9]*$/;
  regex.test(token) ? query.equalTo('tokenId', token) : query.equalTo('tokenIdAdmin', token);
  query.equalTo('collectionAddress', request?.object?.get('collectionAddress'));
  const existingLikesNft = await query.first();

  if (!existingLikesNft) {
    const newLikes = new likes();
    newLikes.set('metadataNft', request?.object?.get('metadataNft'));
    regex.test(token)
      ? newLikes.set('tokenId', token.toString() || undefined)
      : newLikes.set('tokenIdAdmin', token.toString() || undefined);
    newLikes.set('collectionAddress', request?.object?.get('collectionAddress'));
    newLikes.set('ownerAddres', request?.object?.get('ownerAddres'));
    newLikes.set('likesUsers');
    await newLikes.save();
  }
});

/* The above code is an afterSave cloud function in Parse Server using TypeScript. It is triggered
after a new object is saved in the "AuctionwithdrawnLogs" class. */
Parse.Cloud.afterSave('AuctionwithdrawnLogs', async (request: any) => {
  const { tokenId, nftContractAddress } = request.object;

  const tokenIdReqtoInt = parseInt(request?.object?.get('tokenId'));

  const TempData = Parse.Object.extend('TempData');
  const tempData = new TempData();
  tempData.set('afterSave', true);
  await tempData.save(null, { useMasterKey: true });

  const queryItemsMinted = new Parse.Query('ItemsMinted');
  queryItemsMinted.equalTo('tokenId', tokenIdReqtoInt);
  queryItemsMinted.equalTo('collectionAddress', request?.object?.get('nftContractAddress'));

  const objectItemsMinted: any = await queryItemsMinted.first({ useMasterKey: true });

  if (objectItemsMinted) {
    objectItemsMinted.set('buyNowPrice', 0);
    objectItemsMinted.set('minimumBid', 0);
    objectItemsMinted.set('forSale', false);
    await objectItemsMinted.save(null, { useMasterKey: true });
  }
});
/* The above code is an afterSave cloud function in Parse Server using TypeScript. It is triggered
after a new object is saved in the "NftauctioncreatedLogs" class. */

Parse.Cloud.afterSave('NftauctioncreatedLogs', async (request: any) => {
  const { nftContractAddress } = request.object;

  const tokenIdReqtoInt = parseInt(request?.object?.get('tokenId'));

  const TempData = Parse.Object.extend('TempData');
  const tempData = new TempData();
  tempData.set('afterSave', true);
  await tempData.save(null, { useMasterKey: true });
});

/* The above code is an afterSave cloud function in Parse Server using TypeScript. It is triggered
after a new object is saved in the "BidmadeLogs" class. */
Parse.Cloud.afterSave('BidmadeLogs', async (request: any) => {
  const higherBidBidmadeLogs = formatUnits(request.object?.get('tokenAmount'), 18);
  const higherBidBidmadeLogsConverted = Math.round(parseInt(higherBidBidmadeLogs));

  const queryNftauctioncreatedLogs = new Parse.Query('NftauctioncreatedLogs');
  queryNftauctioncreatedLogs.equalTo('nftContractAddress', request.object?.get('nftContractAddress'));
  queryNftauctioncreatedLogs.equalTo('tokenId', request.object?.get('tokenId'));
  const objectNftauctioncreated = await queryNftauctioncreatedLogs.first({ useMasterKey: true });

  const minimumBidItemsMinted = formatUnits(objectNftauctioncreated?.get('minPrice'), 18);
  const minimumBidItemsMintedConverted = Math.round(parseInt(minimumBidItemsMinted));

  const queryItemsMinted = new Parse.Query('ItemsMinted');
  queryItemsMinted.equalTo('collectionAddress', request.object?.get('nftContractAddress'));
  queryItemsMinted.equalTo('tokenId', parseInt(request.object?.get('tokenId')));
  const objectItemsMinted = await queryItemsMinted.first({ useMasterKey: true });

  const forSale = objectItemsMinted?.get('forSale');

  if (objectNftauctioncreated && objectItemsMinted) {
    if (higherBidBidmadeLogsConverted > minimumBidItemsMintedConverted) {
      if (forSale) {
        const TempData = Parse.Object.extend('TempData');
        const tempData = new TempData();
        tempData.set('afterSave', true);
        await tempData.save(null, { useMasterKey: true });

        objectItemsMinted?.set('highestBid', higherBidBidmadeLogsConverted);
        await objectItemsMinted?.save(null, { useMasterKey: true });
      }
    }
  }
});

/* The above code is defining a Parse Cloud function called 'getTotalSelling'. This function takes a
parameter called 'ethAddress'. */
Parse.Cloud.define('getTotalSelling', async (request: any) => {
  const { ethAddress } = request.params;
  const query = new Parse.Query('User');
  query.equalTo('ethAddress', ethAddress);
  query.equalTo('totalSelling', true);
  const queryResult = await query.first({ useMasterKey: true });

  let resultTotal;

  const queryValueSell = queryResult?.attributes?.valueSell ? queryResult?.attributes.valueSell : '';

  if (!queryResult) {
    return undefined;
  }

  if (queryValueSell === '') {
    resultTotal = await queryResult?.get('valueSell');
    await resultTotal.save(null, { useMasterKey: true });
  } else {
    resultTotal = await queryResult?.get('valueSell');
    await resultTotal.save(null, { useMasterKey: true });
  }

  return resultTotal;
});

/* The above code is defining a Parse Cloud function called "getItemsMinted". This function takes a
request parameter called "collectionAddress". */
Parse.Cloud.define('getItemsMinted', async (request: any) => {
  const { collectionAddress } = request.params;

  const query = new Parse.Query('ItemsMinted');
  query.equalTo('ownerAddress', collectionAddress);
  const queryResult = await query.first();

  return queryResult;
});

/* The above code is defining a Parse Cloud function called 'getFilterItemsHome'. This function takes
an input value as a parameter and performs the following steps: */
Parse.Cloud.define('getFilterItemsHome', async (request: any) => {
  const { inputValue } = request.params;
  const resultFilter: any = [];

  const query = new Parse.Query('ItemsMinted');
  query.limit(1000000);
  const resultQuery = await query.find();
  const objStr = JSON.stringify(resultQuery);
  const objJson = JSON.parse(objStr);

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('_User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  await Promise.all(
    objJson.map(async (element: any) => {
      if (inputValue.length > 0) {
        if (element.metadataNft.name.search(inputValue) === 0) {
          const { username, userAvatar } = await getUser(element.ownerAddress);
          element.username = username;
          element.userAvatar = userAvatar;
          resultFilter.push(element);
        }
      }
    }),
  );

  return resultFilter;
});

/* The above code is defining a Parse Cloud Function called "getTopSellers". This function retrieves
the top 12 sellers from the "User" class in the Parse database based on the "TotalSoldInToken" field
in descending order. It then maps over the query results and creates a new array of objects
containing the user's avatar, username, Ethereum address, and total sold in tokens. Finally, it
returns the new array of top sellers. */
Parse.Cloud.define('getTopSellers', async () => {
  const newArrayTopseller: any = [];
  const query = new Parse.Query('User');
  query.descending('TotalSoldInToken');
  query.limit(12);
  const resultQuery = await query.find({ useMasterKey: true });

  await Promise.all(
    resultQuery.map(async (value: any) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const userAvatar = objJson?.userAvatar ? objJson.userAvatar : '';
      const username = objJson?.username ? objJson.username : '';
      const ethAddress = objJson?.ethAddress ? objJson.ethAddress : '';
      const TotalSoldInToken = objJson?.TotalSoldInToken ? objJson.TotalSoldInToken : '';

      const newArr = {
        userAvatar,
        username,
        ethAddress,
        TotalSoldInToken,
      };

      newArrayTopseller.push(newArr);
    }),
  );

  return newArrayTopseller;
});

/* The above code is defining a Cloud Function called "generateTraffic1" in Parse Server using
TypeScript. This function takes in a request object and retrieves the user and limit from the
request parameters. It then checks if the user is an admin by calling another Cloud Function called
"checkUserRole2" with the roleName and ethAddress. If the user is an admin, it performs a query on
the "ItemsMinted" class to retrieve a maximum of 1000 objects where the "adminMint" field is true.
It then iterates over the query results, extracts specific fields from each object */
Parse.Cloud.define('generateTraffic1', async (request: any) => {
  const { user } = request;
  const { limit } = request.params;

  const ethAddress = user.get('ethAddress');

  const roleName = 'admin';
  const isAdmin = await Parse.Cloud.run('checkUserRole2', { roleName, ethAddress });

  try {
    if (isAdmin) {
      const newArrayGenerateTraffic: any = [];
      const DataFiles = Parse.Object.extend('ItemsMinted');
      const query = new Parse.Query(DataFiles);
      query.limit(1000);
      query.equalTo('adminMint', true);

      const resultQuery = await query.find({ useMasterKey: true });

      resultQuery.forEach((value) => {
        const objJson = value.toJSON();

        const {
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
        } = objJson;

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
  } catch (error) {
    return error;
  }
});

/* The above code is defining a Parse Cloud function called 'generateTraffic'. This function takes in a
request object and retrieves the 'user' and 'limit' parameters from it. It then checks if the user
has the 'admin' role by calling another Parse Cloud function called 'checkUserRoleFront' with the
role name and the user's Ethereum address. If the user has the 'admin' role, the function proceeds
to query the Parse User class to find random admin users. It selects two random admin users and
assigns their Ethereum addresses to the 'from' and 'to' variables, and assigns the */
Parse.Cloud.define('generateTraffic', async (request: any) => {
  const { user } = request;
  const { limit } = request.params;

  const ethAddress = user.get('ethAddress');
  const newArrayGenerateTraffic: any = [];

  const roleName = 'admin';
  const isAdmin = await Parse.Cloud.run('checkUserRoleFront', { roleName, ethAddress });

  try {
    if (isAdmin.hasRole) {
      const randomAdminUserQuery = new Parse.Query(Parse.User);
      randomAdminUserQuery.equalTo('adminUser', true);

      const randomAdminUsers = await randomAdminUserQuery.find({ useMasterKey: true });
      let randomTwoAdminUsers: any = selectRandomUsers(randomAdminUsers, 3);

      let from = randomTwoAdminUsers[0].get('ethAddress');
      let to = randomTwoAdminUsers[1].get('ethAddress');
      let other = randomTwoAdminUsers[2].get('ethAddress');

      const DataFiles = Parse.Object.extend('ItemsMinted');
      const query = new Parse.Query(DataFiles);
      query.limit(limit);
      query.equalTo('ownerAddress', from);
      query.equalTo('adminMint', true);

      const resultQuery = await query.find({ useMasterKey: true });

      resultQuery.forEach((value) => {
        const objJson = value.toJSON();

        const {
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
        } = objJson;

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
  } catch (error) {
    throw new Error(`error ${error}`);
  }
});

/* The above code is defining a Cloud Function in Parse Server called 'updateActivityNftAdminBuy'. This
function takes in a request object as a parameter and extracts the 'tokenIdAdmin',
'collectionAddress', and 'nftId' values from the request parameters. */
Parse.Cloud.define('updateActivityNftAdminBuy', async (request: any) => {
  const { tokenIdAdmin, collectionAddress, nftId } = request.params;
  const ActivityQuery = new Parse.Query('Activity');
  ActivityQuery.equalTo('collectionAddress', collectionAddress);
  ActivityQuery.equalTo('tokenIdAdmin', tokenIdAdmin);
  const ActivityQueryResult: any = await ActivityQuery.find({ useMasterKey: true });

  try {
    if (ActivityQueryResult) {
      ActivityQueryResult.forEach(async (element: any) => {
        element?.set('tokenIdAdmin', undefined);
        element?.set('tokenId', nftId.toString());
        await element?.save(null, { useMasterKey: true });
      });
    }
  } catch (error: any) {
    throw new Error(`error ${error}`);
  }
});

/* The above code is defining a Parse Cloud Function called 'handleBurnNft'. This function takes in two
parameters, 'tokenId' and 'collectionAddress'. */
Parse.Cloud.define('handleBurnNft', async (request: any) => {
  const { tokenId, collectionAddress } = request.params;
  if (tokenId !== '' && tokenId !== null && collectionAddress !== '' && collectionAddress !== null) {
    const handleBurnNftQuery = new Parse.Query('ItemsMinted');

    handleBurnNftQuery.equalTo('collectionAddress', collectionAddress);
    handleBurnNftQuery.equalTo('tokenId', tokenId);
    const handleBurnNftQueryResult: any = await handleBurnNftQuery.first({ useMasterKey: true });
    try {
      if (handleBurnNftQueryResult) {
        await handleBurnNftQueryResult.destroy({ useMasterKey: true });
        return 'Object destroy';
      }
    } catch (error: any) {
      throw new Error(`error ${error}`);
    }
  }
  return 'No exits object';
});
