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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exnode = void 0;
const http = __importStar(require("http"));
const request_1 = __importDefault(require("./request"));
const response_1 = __importDefault(require("./response"));
const events_1 = require("events");
class Application extends events_1.EventEmitter {
    constructor(options) {
        super();
        this._middleware = [];
        this._request = Object.create(request_1.default);
        this._response = Object.create(response_1.default);
        console.log('\x1b[34;2m%s\x1b[0m', `▓█████ ▒██   ██▒ ███▄    █  ▒█████  ▓█████▄ ▓█████ `);
        console.log('\x1b[34;2m%s\x1b[0m', `▓█   ▀ ▒▒██ ██▒░ ██ ▀█   █ ▒██▒  ██▒▒██▀ ██▌▓█   ▀ `);
        console.log('\x1b[34;2m%s\x1b[0m', `▒███   ░░  █   ░▓██  ▀█ ██▒▒██░  ██▒░██   █▌▒███   `);
        console.log('\x1b[34;2m%s\x1b[0m', `▒▓█  ▄  ░██ ██▒ ▓██▒  ▐▌██▒▒██   ██░░▓█▄ ██▌▒▓█  ▄ `);
        console.log('\x1b[34;2m%s\x1b[0m', `░▒████▒▒██▒ ▒██▒▒██░   ▓██░░ ████▓▒░░█████▓ ░█████▒`);
        console.log('\x1b[34;2m%s\x1b[0m', `░░ ▒░ ░▒▒ ░ ░▓ ░░ ▒░   ▒ ▒ ░ ▒░▒░▒░  ▒▒▓  ▒ ░░ ▒░ ░`);
        console.log('\x1b[34;2m%s\x1b[0m', ` ░ ░  ░░░   ░▒ ░░ ░░   ░ ▒░  ░ ▒ ▒░  ░ ▒  ▒  ░ ░  ░`);
        console.log('\x1b[34;2m%s\x1b[0m', ` ░    ░    ░     ░   ░ ░ ░ ░ ░ ▒   ░ ░  ░    ░    `);
    }
    use(...args) {
        let path = "";
        let callback;
        if (args.length === 1) {
            callback = args[0];
        }
        else if (args.length === 2) {
            path = args[0];
            callback = args[1];
        }
        else {
            throw new Error("Invalid arguments for 'use' method");
        }
        if (path && typeof path !== "string") {
            throw new TypeError("Path must be a string");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Middleware must be a function");
        }
        this._middleware.push({ path, method: "", callback });
    }
    listen(...args) {
        const server = http.createServer(this.handleRequest.bind(this));
        return server.listen(...args);
    }
    handleRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._request = new request_1.default(req);
                this._response = new response_1.default(res);
                yield this.processMiddleware(0);
            }
            catch (error) {
                console.error("Error handling request:", error);
                res.statusCode = 500;
                res.end("Internal Server Error");
            }
        });
    }
    processMiddleware(index) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { _middleware, _request, _response } = this;
            const currentLayer = _middleware[index];
            const next = () => this.processMiddleware(index + 1);
            if (!currentLayer) {
                return;
            }
            const { path, method, callback } = currentLayer;
            const url = (_a = _request.url) === null || _a === void 0 ? void 0 : _a.split("?")[0];
            const requestMethod = (_b = _request.method) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            if ((!path || url === path) && (!method || (method === null || method === void 0 ? void 0 : method.toLowerCase()) === requestMethod)) {
                yield callback(_request, _response, next);
            }
            else {
                yield next();
            }
        });
    }
    get(path, callback) {
        this._middleware.push({ path, method: "GET", callback });
        this.processMiddleware(0);
    }
    post(path, callback) {
        this._middleware.push({ path, method: "POST", callback });
        this.processMiddleware(0);
    }
    put(path, callback) {
        this._middleware.push({ path, method: "PUT", callback });
        this.processMiddleware(0);
    }
    delete(path, callback) {
        this._middleware.push({ path, method: "DELETE", callback });
        this.processMiddleware(0);
    }
    patch(path, callback) {
        this._middleware.push({ path, method: "PATCH", callback });
        this.processMiddleware(0);
    }
}
exports.exnode = Application;
