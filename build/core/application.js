"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const request_1 = __importDefault(require("./request"));
const response_1 = __importDefault(require("./response"));
const events_1 = require("events");
class Application extends events_1.EventEmitter {
    constructor(options) {
        super();
        this._middleware = [];
        this._request = new request_1.default();
        this._response = new response_1.default();
    }
    use(...args) {
        let path = '';
        let callback;
        if (args.length === 1) {
            callback = args[0];
        }
        else if (args.length === 2) {
            path = args[0];
            callback = args[1];
        }
        else {
            throw new Error('Invalid arguments for \'use\' method');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('Middleware function must be a function');
        }
        this._middleware.push({ path, method: '', callback });
    }
    listen(...args) {
        const server = http.createServer(this.handleRequest.bind(this));
        return server.listen(...args);
    }
    async handleRequest(req, res) {
        try {
            this._request = new request_1.default(req);
            this._response = new response_1.default(res);
            await this.processMiddleware(0);
        }
        catch (error) {
            console.error('Error handling request:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }
    async processMiddleware(index) {
        const { _middleware, _request, _response } = this;
        const currentLayer = _middleware[index];
        const next = () => this.processMiddleware(index + 1);
        if (!currentLayer) {
            return;
        }
        const { path, method, callback } = currentLayer;
        const url = _request.url?.split('?')[0];
        const requestMethod = _request.method.toLowerCase();
        if ((!path || url === path) && (!method || method.toLowerCase() === requestMethod)) {
            await callback(_request, _response, next);
        }
        else {
            await next();
        }
    }
    get(path, callback) {
        this._middleware.push({ path, method: 'GET', callback });
    }
    post(path, callback) {
        this._middleware.push({ path, method: 'POST', callback });
    }
    put(path, callback) {
        this._middleware.push({ path, method: 'PUT', callback });
    }
    delete(path, callback) {
        this._middleware.push({ path, method: 'DELETE', callback });
    }
    patch(path, callback) {
        this._middleware.push({ path, method: 'PATCH', callback });
    }
}
exports.default = Application;
