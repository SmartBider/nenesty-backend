import { Operation } from '@moralisweb3/common-core';
export type UnknownOperation = Operation<unknown, unknown, unknown, unknown>;
/**
 * The `upgradeRequest` function takes in parameters and an operation, and returns an upgraded request
 * object by converting parameter keys to camel case and modifying certain properties based on the
 * operation.
 * @param {any} params - An object containing various parameters for the upgrade request.
 * @param {UnknownOperation} operation - The parameter `operation` is of type `UnknownOperation`.
 * @returns the modified `request` object.
 */
export declare function upgradeRequest(params: any, operation: UnknownOperation): any;
