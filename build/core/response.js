"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(res) {
        this._res = res;
    }
    get socket() {
        return this._res.socket;
    }
    get status() {
        return this._res.statusCode;
    }
    set status(code) {
        this._res.statusCode = code;
    }
    setHeader(name, value) {
        this._res.setHeader(name, value);
    }
    send(data) {
        switch (typeof data) {
            case "object":
                this.setHeader("Content-Type", "application/json");
                this._res.write(JSON.stringify(data));
                break;
            case "string":
                this.setHeader("Content-Type", "text/plain");
                this._res.write(data);
                break;
            default:
                this._res.write(data.toString());
        }
        this._res.end();
    }
    json(data) {
        this.setHeader("Content-Type", "application/json");
        this._res.write(JSON.stringify(data));
        this._res.end();
    }
    text(data) {
        this.setHeader("Content-Type", "text/plain");
        this._res.write(data);
        this._res.end();
    }
    html(data) {
        this.setHeader("Content-Type", "text/html");
        this._res.write(data);
        this._res.end();
    }
    redirect(url, statusCode = 302) {
        this.setHeader("Location", url);
        this.status = statusCode;
        this._res.end();
    }
    sendStatus(statusCode) {
        this.status = statusCode;
        this._res.statusMessage = `${statusCode}`;
        this._res.end();
    }
}
exports.default = Response;
