/// <reference types="node" />
/// <reference types="node" />
import { ServerResponse } from 'http';
declare class Response {
    private _res;
    constructor(res?: ServerResponse);
    get socket(): import("net").Socket;
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
export default Response;
//# sourceMappingURL=response.d.ts.map