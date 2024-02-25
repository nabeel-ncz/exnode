/// <reference types="node" />
/// <reference types="node" />
import * as http from "http";
import Request from "./request";
import Response from "./response";
import { EventEmitter } from "events";
declare class Application extends EventEmitter {
    private _middleware;
    private _request;
    private _response;
    constructor(options?: any);
    use(...args: any[]): void;
    listen(...args: any[]): http.Server;
    private handleRequest;
    private processMiddleware;
    get(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void;
    post(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void;
    put(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void;
    delete(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void;
    patch(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void;
}
export { Application as exnode };
