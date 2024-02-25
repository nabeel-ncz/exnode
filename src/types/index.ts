import EventEmitter from "events";
import * as http from "http";
import { URL } from "url";

declare class Request {
    private _req: http.IncomingMessage;
    private _url: URL;
    private _params: any;

    constructor(req: http.IncomingMessage);

    get headers(): http.IncomingMessage["headers"];
    set headers(val: http.IncomingMessage["headers"]);

    get url(): string;

    get method(): string;
    set method(val: string);

    get body(): Promise<any>;

    get path(): string;
    set path(path: string);

    get query(): Record<string, string>;

    get params(): any;
    set params(obj: any);
}

declare class Response {
    private _res: http.ServerResponse;

    constructor(res?: http.ServerResponse);

    get socket(): http.ServerResponse["socket"];

    get status(): number;
    set status(code: number);

    setHeader(name: string, value: string | string[]): void;

    send(data: any): void;

    json(data: any): void;

    text(data: string): void;

    html(data: string): void;

    redirect(url: string, statusCode?: number): void;

    sendStatus(statusCode: number): void;
}

type NextFunction = () => void;

declare class Application extends EventEmitter {
    private _middleware: {
        path: string;
        method: string;
        callback: (req: Request, res: Response, next?: () => void) => void;
    }[];
    private _request: Request;
    private _response: Response;

    constructor(options?: any);

    use(callback: (req: Request, res: Response, next?: NextFunction) => void): void;
    use(path: string, callback: (req: Request, res: Response, next?: NextFunction) => void): void;

    listen(port: number, callback?: () => void): http.Server;
    listen(port: number, hostname: string, callback?: () => void): http.Server;
    listen(port: number, hostname?: string, backlog?: number, callback?: () => void): http.Server;

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void>;

    private processMiddleware(index: number): Promise<void>;

    get(path: string): (callback: (req: Request, res: Response) => Promise<void> | void) => void;

    post(path: string): (callback: (req: Request, res: Response) => Promise<void> | void) => void;

    put(path: string): (callback: (req: Request, res: Response) => Promise<void> | void) => void;

    delete(path: string): (callback: (req: Request, res: Response) => Promise<void> | void) => void;

    patch(path: string): (callback: (req: Request, res: Response) => Promise<void> | void) => void;
}

export {
    Application,
    Request,
    Response,
    NextFunction
};
