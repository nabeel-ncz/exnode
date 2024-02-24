"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const url_1 = require("url");
class Request {
    constructor(req) {
        this._req = req;
        this._url = req ? new url_1.URL(`http://${req.headers.host}${req.url}`) : new url_1.URL('');
        this._params = {};
    }
    get headers() {
        return this._req.headers;
    }
    set headers(val) {
        this._req.headers = val;
    }
    get url() {
        return this._req.url;
    }
    set method(val) {
        if (typeof val === 'string') {
            this._req.method = val;
        }
    }
    get body() {
        return new Promise((resolve, reject) => {
            let body = '';
            this._req.on('data', (chunk) => {
                body += chunk.toString('utf-8');
            });
            this._req.on('end', () => {
                try {
                    const parsedBody = body.length !== 0 ? JSON.parse(body) : null;
                    resolve(parsedBody);
                }
                catch (error) {
                    reject(error);
                }
            });
            this._req.on('error', (error) => {
                reject(error);
            });
        });
    }
    get path() {
        return this._url.pathname || '';
    }
    set path(path) {
        this._url.pathname = path;
    }
    get query() {
        return Object.fromEntries(this._url.searchParams.entries());
    }
    get params() {
        return this._params;
    }
    set params(obj) {
        this._params = obj;
    }
}
exports.Request = Request;
