/// <reference types="node" />
import { IncomingMessage } from "http";
declare class Request {
    private _req;
    private _url;
    private _params;
    constructor(req: IncomingMessage);
    get headers(): import("http").IncomingHttpHeaders;
    set headers(val: import("http").IncomingHttpHeaders);
    get url(): string;
    get method(): string;
    set method(val: string);
    get body(): Promise<any>;
    get path(): string;
    set path(path: string);
    get query(): {
        [k: string]: string;
    };
    get params(): any;
    set params(obj: any);
}
export default Request;
