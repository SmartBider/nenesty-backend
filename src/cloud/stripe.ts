/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
//@ts-nocheck
import Parse from 'parse/node';
import config from '../config';

const adminsAddress = [
  config.ADMIN_ADDRES1,
  config.ADMIN_ADDRES2,
  config.ADMIN_ADDRES3,
  config.ADMIN_ADDRES4,
  config.ADMIN_ADDRES5,
  config.ADMIN_ADDRES6,
];

/* The `Parse.Cloud.define("getCompletedTDCPayments", async (request: any) => { ... })` function is a
cloud function defined in the Parse server. It retrieves a list of completed TDC (Token Distribution
Center) payments. */
Parse.Cloud.define('getCompletedTDCPayments', async (request: any) => {
  const { user } = request;
  if (user) {
    const { page } = request.params;
    const userAddress = user.get('ethAddress');
    if (adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase())) {
      const query = new Parse.Query('Payments');
      query.descending('updatedAt');
      query.equalTo('fulfilled', true);
      query.equalTo('completed', true);
      query.withCount();
      query.limit(10);
      query.skip(10 * (page - 1));
      const payments: any = await query.find({ useMasterKey: true });
      return {
        result: payments.results.map((element: any) => {
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
Parse.Cloud.define('getFulfilledTDCPayments', async (request: any) => {
  const { user } = request;
  if (user) {
    const { page } = request.params;
    const userAddress = user.get('ethAddress');
    if (adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase())) {
      const query = new Parse.Query('Payments');
      query.descending('createdAt');
      query.equalTo('fulfilled', true);
      query.equalTo('completed', false);
      query.withCount();
      query.limit(10);
      query.skip(10 * (page - 1));
      const payments: any = await query.find({ useMasterKey: true });
      return {
        result: payments.results.map((element: any) => {
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
Parse.Cloud.define('isTDCAdmin', async (request: any) => {
  const { user } = request;
  if (user) {
    const userAddress = user.get('ethAddress');
    return adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase());
  }
  return false;
});

/* The `setTDCPayment` function is a cloud function defined in the Parse server. It is used to create a
new payment object in the "Payments" class. */
Parse.Cloud.define('setTDCPayment', async (request: any) => {
  const Payment = Parse.Object.extend('Payments');
  const payment = new Payment();

  const ACL = new Parse.ACL();
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
Parse.Cloud.define('fulfillTDCPayment', async (request: any) => {
  const query = new Parse.Query('Payments');
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
Parse.Cloud.define('completeTDCPayment', async (request: any) => {
  const { user } = request;
  if (user) {
    const userAddress = user.get('ethAddress');

    if (adminsAddress.some((element) => element.toLowerCase() === userAddress.toLowerCase())) {
      const { id, hashMatic, hashToken } = request.params;
      const query = new Parse.Query('Payments');
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
Parse.Cloud.define('cancelTDCPayment', async (request: any) => {
  const query = new Parse.Query('Payments');
  query.equalTo('objectId', request.params.id);
  const payment = await query.first({ useMasterKey: true });
  if (payment) {
    await payment.destroy({ useMasterKey: true });
  }
  return true;
});
