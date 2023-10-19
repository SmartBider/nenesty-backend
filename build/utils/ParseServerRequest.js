"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseServerRequest = void 0;
const common_core_1 = require("@moralisweb3/common-core");
const config_1 = __importDefault(require("../config"));
class ParseServerRequest {
    constructor() {
        this.getHeaders = (useMasterKey) => (Object.assign(Object.assign({}, (useMasterKey && { 'X-Parse-Master-Key': config_1.default.MASTER_KEY })), { 'X-Parse-Application-Id': config_1.default.APPLICATION_ID }));
        this.post = ({ endpoint, params, useMasterKey, }) => this.requestController.post(`${config_1.default.SERVER_URL}/${endpoint}`, undefined, params, {
            headers: this.getHeaders(useMasterKey),
        });
        this.put = ({ endpoint, params, useMasterKey, }) => this.requestController.put(`${config_1.default.SERVER_URL}/${endpoint}`, undefined, params, {
            headers: this.getHeaders(useMasterKey),
        });
        this.get = ({ endpoint, useMasterKey }) => this.requestController.get(`${config_1.default.SERVER_URL}/${endpoint}`, undefined, {
            headers: this.getHeaders(useMasterKey),
        });
        const core = common_core_1.CoreProvider.getDefault();
        this.requestController = common_core_1.RequestController.create(core);
    }
}
exports.ParseServerRequest = ParseServerRequest;
//# sourceMappingURL=ParseServerRequest.js.map