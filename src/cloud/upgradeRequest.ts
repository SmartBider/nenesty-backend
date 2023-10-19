/* eslint-disable @typescript-eslint/no-explicit-any */
import { Operation, toCamel } from '@moralisweb3/common-core';

// TODO: we need to remove this type and use `UnknownOperation` from `@moralisweb3/common-core`.
export type UnknownOperation = Operation<unknown, unknown, unknown, unknown>;

/**
 * The `upgradeRequest` function takes in parameters and an operation, and returns an upgraded request
 * object by converting parameter keys to camel case and modifying certain properties based on the
 * operation.
 * @param {any} params - An object containing various parameters for the upgrade request.
 * @param {UnknownOperation} operation - The parameter `operation` is of type `UnknownOperation`.
 * @returns the modified `request` object.
 */
export function upgradeRequest(params: any, operation: UnknownOperation): any {
  const request = Object.keys(params).reduce<Record<string, any>>((value, key) => {
    value[toCamel(key)] = params[key];
    return value;
  }, {});

  if (request['address'] && !hasParam(operation, 'address')) {
    delete request['address'];
  }

  if (request['chain']) {
    if (!hasParam(operation, 'chain')) {
      delete request['chain'];
    } else {
      request['chain'] = upgradeChain(request['chain']);
    }
  }
  return request;
}

/**
 * The function `hasParam` checks if a given parameter name exists in the body, URL path, or URL search
 * parameters of an operation.
 * @param {UnknownOperation} operation - The `operation` parameter is of type `UnknownOperation`. It
 * represents an operation or function that has some parameters associated with it. The specific type
 * of `UnknownOperation` is not provided in the code snippet, so it could be any type that has the
 * properties `bodyParamNames`, `urlPathParam
 * @param {string} name - The `name` parameter is a string that represents the name of a parameter.
 * @returns a boolean value.
 */
function hasParam(operation: UnknownOperation, name: string): boolean {
  return (
    (operation.bodyParamNames as string[] | undefined)?.includes(name) ||
    (operation.urlPathParamNames as string[] | undefined)?.includes(name) ||
    (operation.urlSearchParamNames as string[] | undefined)?.includes(name) ||
    false
  );
}
/* The `chainMap` constant is a TypeScript object that maps different chain names to their
corresponding chain IDs. Each key-value pair in the object represents a chain name and its
associated chain ID. For example, the key `'eth'` maps to the value `'0x1'`, indicating that the
Ethereum chain has a chain ID of `'0x1'`. */

const chainMap: Record<string, string> = {
  eth: '0x1',
  goerli: '0x5',
  sepolia: '0xaa36a7',
  polygon: '0x89',
  mumbai: '0x13881',
  bsc: '0x38',
  'bsc testnet': '0x61',
  avalanche: '0xa86a',
  'avalanche testnet': '0xa869',
  fantom: '0xfa',
  cronos: '0x19',
  'cronos testnet': '0x152',
};

/**
 * The function "upgradeChain" takes a string parameter "chain" and returns the upgraded value of the
 * chain if it exists in the "chainMap" object, otherwise it returns the original chain.
 * @param {string} chain - The `chain` parameter is a string that represents a value in a chain.
 * @returns the upgraded value of the input chain if it exists in the chainMap object. If the input
 * chain does not have an upgraded value in the chainMap, the function returns the original chain.
 */
function upgradeChain(chain: string): string {
  const upgradedValue = chainMap[chain];
  return upgradedValue ?? chain;
}
