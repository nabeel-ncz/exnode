import { IncomingMessage } from "http";
import { URL } from "url";

class Request {
	private _req: IncomingMessage;
	private _url: URL;
	private _params: any;

	constructor(req: IncomingMessage) {
		this._req = req;
		this._url = req ? new URL(`http://${req.headers.host}${req.url}`) : new URL("");
		this._params = {};
	}

	get headers() {
		return this._req.headers;
	}

	set headers(val) {
		this._req.headers = val;
	}

	get url(): string {
		return this._req.url ?? "";
	}

	get method(): string{
		return this._req.method ?? "";
	}

	set method(val: string) {
		if (typeof val === "string") {
			this._req.method = val;
		}
	}

	get body(): Promise<any> {
		return new Promise((resolve, reject) => {
			let body = "";

			this._req.on("data", (chunk) => {
				body += chunk.toString("utf-8");
			});

			this._req.on("end", () => {
				try {
					const parsedBody = body.length !== 0 ? JSON.parse(body) : null;
					resolve(parsedBody);
				} catch (error) {
					reject(error);
				}
			});

			this._req.on("error", (error) => {
				reject(error);
			});
		});
	}

	get path() {
		return this._url.pathname || "";
	}

	set path(path: string) {
		this._url.pathname = path;
	}

	get query() {
		return Object.fromEntries(this._url.searchParams.entries());
	}

	get params() {
		return this._params;
	}

	set params(obj: any) {
		this._params = obj;
	}
}
export default Request;
