"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_evm_utils_1 = require("@moralisweb3/common-evm-utils");
const upgradeRequest_1 = require("./upgradeRequest");
describe('upgradeRequest', () => {
    const ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    it('converts field names to camel case', () => {
        const request = (0, upgradeRequest_1.upgradeRequest)({
            block_number_or_hash: '123456',
        }, common_evm_utils_1.getBlockOperation);
        expect(request.blockNumberOrHash).toBe('123456');
        expect(request.block_number_or_hash).toBeUndefined();
    });
    it('does not convert to camel case field names of passed objects', () => {
        const request = (0, upgradeRequest_1.upgradeRequest)({
            address: ADDRESS,
            function_name: 'example_function',
            chain: '0x1',
            abi: [],
            params: {
                user_id: 'some_value',
            },
        }, common_evm_utils_1.runContractFunctionOperation);
        expect(request.address).toBe(ADDRESS);
        expect(request.functionName).toBe('example_function');
        expect(request.chain).toBe('0x1');
        expect(Array.isArray(request.abi)).toBe(true);
        expect(request.params.user_id).toBe('some_value');
        expect(request.params.userId).toBeUndefined();
    });
    it('removes address and chain if not supported', () => {
        const request = (0, upgradeRequest_1.upgradeRequest)({
            domain: 'x.crypto',
            address: ADDRESS,
            chain: '0x1',
        }, common_evm_utils_1.resolveDomainOperation);
        expect(request['domain']).toBe('x.crypto');
        expect(request['address']).toBeUndefined();
        expect(request['chain']).toBeUndefined();
    });
    it('keeps address and chain if supported', () => {
        const request = (0, upgradeRequest_1.upgradeRequest)({
            address: ADDRESS,
            chain: '0x1',
        }, common_evm_utils_1.getNativeBalanceOperation);
        expect(request['address']).toBeDefined();
        expect(request['chain']).toBeDefined();
    });
    it('upgrades chain', () => {
        const request = (0, upgradeRequest_1.upgradeRequest)({
            address: ADDRESS,
            chain: 'avalanche',
        }, common_evm_utils_1.getNativeBalanceOperation);
        expect(request.address).toBe(ADDRESS);
        expect(request.chain).toBe('0xa86a');
    });
});
//# sourceMappingURL=upgradeRequest.test.js.map