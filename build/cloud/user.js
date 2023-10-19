"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
const node_1 = __importDefault(require("parse/node"));
/* The code `Parse.Cloud.define('SetSettingsUser', async (request: any) => { ... })` is defining a
cloud function called "SetSettingsUser". This function takes in a request object as a parameter. */
node_1.default.Cloud.define('SetSettingsUser', async (request) => {
    const query = new node_1.default.Query('_User');
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
node_1.default.Cloud.define('getNftPerfilUserOnSale', async (request) => {
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
/* The code `Parse.Cloud.define('getNftPerfilUserOwned', async (request: any) => { ... })` is defining
a cloud function called "getNftPerfilUserOwned". This function takes in a request object as a
parameter. */
node_1.default.Cloud.define('getNftPerfilUserOwned', async (request) => {
    const { ethAddress } = request.params;
    const query = new node_1.default.Query('ItemsMinted');
    query.equalTo('ownerAddress', ethAddress);
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
/* The code `Parse.Cloud.afterSave('_User', async (request: any) => { ... })` is defining an afterSave
cloud function for the "_User" class in the Parse database. This function is triggered after a new
user is saved or updated. */
node_1.default.Cloud.afterSave('_User', async (request) => {
    const user = request.object;
    const ethAddress = user.get('ethAddress');
    if (!ethAddress) {
        throw new Error('Usuario no autenticado');
    }
    const Followers = node_1.default.Object.extend('Followers');
    // Create a query to check if ethAddress already exists
    const query = new node_1.default.Query(Followers);
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
node_1.default.Cloud.define('checkUserRole', async (request) => {
    // Obtener el usuario actual
    const { user } = request;
    const { roleName } = request.params;
    try {
        if (user) {
            // Realizar una consulta para obtener el rol por su nombre
            const roleQuery = new node_1.default.Query(node_1.default.Role);
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
    }
    catch (error) {
        throw new Error(`Error al verificar el rol: ${error.message}`);
    }
});
/* The `Parse.Cloud.define('checkUserRoleFront', async (request: any) => { ... })` function is a cloud
function that checks if a user has a specific role based on their Ethereum address. */
node_1.default.Cloud.define('checkUserRoleFront', async (request) => {
    // Obtener el usuario actual
    const { roleName, ethAddress } = request.params;
    try {
        // Realizar una consulta para obtener el rol por su nombre
        const roleQuery = new node_1.default.Query(node_1.default.Role);
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
    }
    catch (error) {
        throw new Error(`Error al verificar el rol: ${error.message}`);
    }
});
/* The `Parse.Cloud.define('assignRoleToUser', async (request) => { ... })` function is a cloud
function that assigns a role to a user in the Parse database. */
node_1.default.Cloud.define('assignRoleToUser', async (request) => {
    const { userId, roleName } = request.params;
    try {
        // Verificar que el usuario esté autenticado
        const { user } = request;
        if (user) {
            // Crear un objeto ACL con permisos para el usuario actual
            const acl = new node_1.default.ACL();
            acl.setWriteAccess(user, true);
            // Crear el objeto de rol de Parse con el nombre del rol y el ACL
            const roleQuery = new node_1.default.Query(node_1.default.Role);
            roleQuery.equalTo('name', roleName);
            const role = await roleQuery.first({ useMasterKey: true });
            if (!role) {
                // Si el rol no existe, puedes crearlo antes de asignar el usuario
                const newRole = new node_1.default.Role(roleName, acl);
                await newRole.save({}, { useMasterKey: true });
            }
            // Obtener el usuario de Parse por su objectId
            const userToUpdate = new node_1.default.User();
            userToUpdate.id = userId;
            // Asignar el usuario al rol
            role === null || role === void 0 ? void 0 : role.getUsers().add(userToUpdate);
            await (role === null || role === void 0 ? void 0 : role.save({}, { useMasterKey: true }));
            return `Rol '${roleName}' asignado al usuario con ID '${userId}'.`;
        }
        throw new Error('El usuario no está autenticado.');
    }
    catch (error) {
        throw new Error('El usuario no está autenticado.');
    }
});
//# sourceMappingURL=user.js.map