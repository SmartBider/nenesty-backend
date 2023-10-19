/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import Parse from 'parse/node';

/* The code `Parse.Cloud.define('SetSettingsUser', async (request: any) => { ... })` is defining a
cloud function called "SetSettingsUser". This function takes in a request object as a parameter. */
Parse.Cloud.define('SetSettingsUser', async (request: any) => {
  const query = new Parse.Query('_User');
  const { owner } = request.params;

  query.equalTo('ethAddress', owner);
  const queryResult = await query.first({ useMasterKey: true });

  if (!queryResult) {
    return undefined;
  }

  queryResult.set('bio', request.params.bio);

  await queryResult.save(null, { useMasterKey: true });
  return 'ok';
});

/* The code `Parse.Cloud.define('getNftPerfilUserOnSale', async (request: any) => { ... })` is defining
a cloud function called "getNftPerfilUserOnSale". This function takes in a request object as a
parameter. */
Parse.Cloud.define('getNftPerfilUserOnSale', async (request: any) => {
  const { ethAddress } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('ownerAddress', ethAddress);
  query.equalTo('forSale', true);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value: any) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );
  const dataNft = JSON.stringify(response);
  const dataObjNft = JSON.parse(dataNft);

  return dataObjNft;
});

/* The code `Parse.Cloud.define('getNftPerfilUserOwned', async (request: any) => { ... })` is defining
a cloud function called "getNftPerfilUserOwned". This function takes in a request object as a
parameter. */
Parse.Cloud.define('getNftPerfilUserOwned', async (request: any) => {
  const { ethAddress } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('ownerAddress', ethAddress);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value: any) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );
  const dataNft = JSON.stringify(response);
  const dataObjNft = JSON.parse(dataNft);

  return dataObjNft;
});

/* The code `Parse.Cloud.afterSave('_User', async (request: any) => { ... })` is defining an afterSave
cloud function for the "_User" class in the Parse database. This function is triggered after a new
user is saved or updated. */
Parse.Cloud.afterSave('_User', async (request: any) => {
  const user = request.object;
  const ethAddress = user.get('ethAddress');

  if (!ethAddress) {
    throw new Error('Usuario no autenticado');
  }

  const Followers = Parse.Object.extend('Followers');

  // Create a query to check if ethAddress already exists
  const query = new Parse.Query(Followers);
  query.equalTo('ethAddress', ethAddress);
  const existingFollower = await query.first();

  // If ethAddress does not exist, then save a new one
  if (!existingFollower) {
    const newFollower = new Followers();
    newFollower.set('ethAddress', ethAddress);
    newFollower.set('followings');
    await newFollower.save();
  }
});

/* The code `Parse.Cloud.define('checkUserRole', async (request: any) => { ... })` is defining a cloud
function called "checkUserRole". This function takes in a request object as a parameter. */
Parse.Cloud.define('checkUserRole', async (request: any) => {
  // Obtener el usuario actual
  const { user } = request;
  const { roleName } = request.params;

  try {
    if (user) {
      // Realizar una consulta para obtener el rol por su nombre
      const roleQuery = new Parse.Query(Parse.Role);
      roleQuery.equalTo('name', roleName);

      const role = await roleQuery.first({ useMasterKey: true });

      if (role) {
        // Consultar si el usuario tiene una relación con el rol
        const userRolesRelation = role.relation('users');
        const userRolesQuery = userRolesRelation.query();
        userRolesQuery.equalTo('objectId', user.id);

        const userWithRole = await userRolesQuery.first({ useMasterKey: true });

        if (userWithRole) {
          return { hasRole: roleName };
        }
      }
    }

    return { hasRole: null };
  } catch (error) {
    throw new Error(`Error al verificar el rol: ${error.message}`);
  }
});

/* The `Parse.Cloud.define('checkUserRoleFront', async (request: any) => { ... })` function is a cloud
function that checks if a user has a specific role based on their Ethereum address. */
Parse.Cloud.define('checkUserRoleFront', async (request: any) => {
  // Obtener el usuario actual

  const { roleName, ethAddress } = request.params;

  try {
    // Realizar una consulta para obtener el rol por su nombre
    const roleQuery = new Parse.Query(Parse.Role);
    roleQuery.equalTo('name', roleName);

    const role = await roleQuery.first({ useMasterKey: true });

    if (role) {
      // Consultar si el usuario tiene una relación con el rol
      const userRolesRelation = role.relation('users');
      const userRolesQuery = userRolesRelation.query();
      userRolesQuery.equalTo('ethAddress', ethAddress);

      const userWithRole = await userRolesQuery.first({ useMasterKey: true });

      if (userWithRole) {
        return { hasRole: roleName };
      }
    }

    return { hasRole: null };
  } catch (error) {
    throw new Error(`Error al verificar el rol: ${error.message}`);
  }
});

/* The `Parse.Cloud.define('assignRoleToUser', async (request) => { ... })` function is a cloud
function that assigns a role to a user in the Parse database. */
Parse.Cloud.define('assignRoleToUser', async (request) => {
  const { userId, roleName } = request.params;

  try {
    // Verificar que el usuario esté autenticado
    const { user } = request;
    if (user) {
      // Crear un objeto ACL con permisos para el usuario actual
      const acl = new Parse.ACL();
      acl.setWriteAccess(user, true);

      // Crear el objeto de rol de Parse con el nombre del rol y el ACL
      const roleQuery = new Parse.Query(Parse.Role);
      roleQuery.equalTo('name', roleName);
      const role = await roleQuery.first({ useMasterKey: true });

      if (!role) {
        // Si el rol no existe, puedes crearlo antes de asignar el usuario
        const newRole = new Parse.Role(roleName, acl);
        await newRole.save({}, { useMasterKey: true });
      }

      // Obtener el usuario de Parse por su objectId
      const userToUpdate = new Parse.User();
      userToUpdate.id = userId;

      // Asignar el usuario al rol
      role?.getUsers().add(userToUpdate);
      await role?.save({}, { useMasterKey: true });

      return `Rol '${roleName}' asignado al usuario con ID '${userId}'.`;
    }
    throw new Error('El usuario no está autenticado.');
  } catch (error) {
    throw new Error('El usuario no está autenticado.');
  }
});
