"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
var url_1 = require("url");
var Request = /** @class */ (function () {
    function Request(req) {
        this._req = req;
        this._url = req ? new url_1.URL("http://".concat(req.headers.host).concat(req.url)) : new url_1.URL('');
        this._params = {};
    }
    Object.defineProperty(Request.prototype, "headers", {
        get: function () {
            return this._req.headers;
        },
        set: function (val) {
            this._req.headers = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "url", {
        get: function () {
            return this._req.url;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "method", {
        set: function (val) {
            if (typeof val === 'string') {
                this._req.method = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "body", {
        get: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var body = '';
                _this._req.on('data', function (chunk) {
                    body += chunk.toString('utf-8');
                });
                _this._req.on('end', function () {
                    try {
                        var parsedBody = body.length !== 0 ? JSON.parse(body) : null;
                        resolve(parsedBody);
                    }
                    catch (error) {
                        reject(error);
                    }
                });
                _this._req.on('error', function (error) {
                    reject(error);
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "path", {
        get: function () {
            return this._url.pathname || '';
        },
        set: function (path) {
            this._url.pathname = path;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "query", {
        get: function () {
            return Object.fromEntries(this._url.searchParams.entries());
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "params", {
        get: function () {
            return this._params;
        },
        set: function (obj) {
            this._params = obj;
        },
        enumerable: false,
        configurable: true
    });
    return Request;
}());
exports.Request = Request;
