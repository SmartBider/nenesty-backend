/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable etc/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
//@ts-nocheck
import Parse from 'parse/node';
import config from '../config';
import { contracts } from '../config/moralis-connect';

const adminsAddress = [
  config.ADMIN_ADDRES1,
  config.ADMIN_ADDRES2,
  config.ADMIN_ADDRES3,
  config.ADMIN_ADDRES4,
  config.ADMIN_ADDRES5,
  config.ADMIN_ADDRES6,
];

/* The `Parse.Cloud.define('getUserByCollection', async (request: any) => { ... })` function is
defining a cloud function called `getUserByCollection`. */
Parse.Cloud.define('getUserByCollection', async (request: any) => {
  try {
    const { owner } = request.params;

    const query = new Parse.Query('User');
    query.equalTo('ethAddress', owner);
    const results = await query.first({ useMasterKey: true });

    const userAvatar = results?.attributes.userAvatar != null || undefined ? results?.attributes.userAvatar : '';
    const userBanner = results?.attributes.userBanner != null || undefined ? results?.attributes.userBanner : '';
    const username = results?.attributes.username != null || undefined ? results?.attributes.username : '';
    const ethAddress = results?.attributes.ethAddress != null || undefined ? results?.attributes.ethAddress : '';

    const user = {
      info: 'entro en getUserByCollection',
      "userAvatar": userAvatar,
      "userBanner": userBanner,
      "username": username,
      "ethAddress": ethAddress,
    };

    return user;
  } catch (e) {
    return e;
  }
});

/* The `Parse.Cloud.define('getCollectionsAdmin', async (request: any) => { ... })` function is
defining a cloud function called `getCollectionsAdmin`. */
Parse.Cloud.define('getCollectionsAdmin', async (request: any) => {
  const { user } = request;
  if (user) {
    const userAddress = user.get('ethAddress');
    if (adminsAddress.some((element: any) => element.toLowerCase() === userAddress.toLowerCase())) {
      const CollectionAdmins = new Parse.Query('CollectionsAdmins');
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
Parse.Cloud.define('getCollectionFunc', async () => {
  const query = new Parse.Query('CollectionsPolygon');
  const results = await query.find();

  return results;
});

/* The `Parse.Cloud.afterSave` function is a Parse Cloud Code function that is triggered after a new
object is saved to the specified class in the Parse database. In this case, it is triggered after a
new object is saved to the "TransferLogs" class. */
Parse.Cloud.afterSave('TransferLogs', async (request: any) => {
  const marketContract = contracts.auction.toLowerCase();

  const tokenIdTransfer = request.object?.get('tokenId');
  const toAddress = request.object?.get('to');
  const fromAddress = request.object?.get('from');
  const collectionAddress = request.object?.get('address');

  const query = new Parse.Query('ItemsMinted');
  query.equalTo('collectionAddress', collectionAddress);
  query.equalTo('tokenId', parseInt(tokenIdTransfer));

  const object = await query.first({ useMasterKey: true });

  const ownerAddress = object?.get('ownerAddress');
  const minimumBid = object?.get('minimumBid');

  if (
    toAddress !== marketContract &&
    ownerAddress !== toAddress &&
    fromAddress === marketContract &&
    minimumBid === 0
  ) {
    object?.set('forSale', false);
    object?.set('minimumBid', 0);
    object?.set('buyNowPrice', 0);
    object?.set('ownerAddress', toAddress);
    object?.set('highestBid', 0);

    await object?.save(null, { useMasterKey: true });
  }

  if (
    toAddress !== marketContract &&
    ownerAddress !== toAddress &&
    fromAddress === marketContract &&
    minimumBid !== 0
  ) {
    object?.set('forSale', false);
    object?.set('minimumBid', 0);
    object?.set('buyNowPrice', 0);
    object?.set('highestBid', 0);
    object?.set('ownerAddress', toAddress);
    await object?.save(null, { useMasterKey: true });
  }
});
