"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
var Response = /** @class */ (function () {
    function Response(res) {
        this._res = res;
    }
    Object.defineProperty(Response.prototype, "socket", {
        get: function () {
            return this._res.socket;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "status", {
        get: function () {
            return this._res.statusCode;
        },
        set: function (code) {
            this._res.statusCode = code;
        },
        enumerable: false,
        configurable: true
    });
    Response.prototype.setHeader = function (name, value) {
        this._res.setHeader(name, value);
    };
    Response.prototype.send = function (data) {
        switch (typeof data) {
            case 'object':
                this.setHeader('Content-Type', 'application/json');
                this._res.write(JSON.stringify(data));
                break;
            case 'string':
                this.setHeader('Content-Type', 'text/plain');
                this._res.write(data);
                break;
            default:
                this._res.write(data.toString());
        }
        this._res.end();
    };
    Response.prototype.json = function (data) {
        this.setHeader('Content-Type', 'application/json');
        this._res.write(JSON.stringify(data));
        this._res.end();
    };
    Response.prototype.text = function (data) {
        this.setHeader('Content-Type', 'text/plain');
        this._res.write(data);
        this._res.end();
    };
    Response.prototype.html = function (data) {
        this.setHeader('Content-Type', 'text/html');
        this._res.write(data);
        this._res.end();
    };
    Response.prototype.redirect = function (url, statusCode) {
        if (statusCode === void 0) { statusCode = 302; }
        this.setHeader('Location', url);
        this.status = statusCode;
        this._res.end();
    };
    Response.prototype.sendStatus = function (statusCode) {
        this.status = statusCode;
        this._res.statusMessage = "".concat(statusCode);
        this._res.end();
    };
    return Response;
}());
exports.Response = Response;
