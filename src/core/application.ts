import * as http from "http";
import Request from "./request";
import Response from "./response";
import { EventEmitter } from "events";

class Application extends EventEmitter {
	private _middleware: {
		path: string;
		method: string;
		callback: (req: Request, res: Response, next?: () => void) => void;
	}[];
	private _request: Request;
	private _response: Response;

	constructor(options?: any) {
		super();
		this._middleware = [];
		this._request = Object.create(Request);
		this._response = Object.create(Response);
		console.log('\x1b[34;2m%s\x1b[0m', `▓█████ ▒██   ██▒ ███▄    █  ▒█████  ▓█████▄ ▓█████ `);
		console.log('\x1b[34;2m%s\x1b[0m', `▓█   ▀ ▒▒██ ██▒░ ██ ▀█   █ ▒██▒  ██▒▒██▀ ██▌▓█   ▀ `);
		console.log('\x1b[34;2m%s\x1b[0m', `▒███   ░░  █   ░▓██  ▀█ ██▒▒██░  ██▒░██   █▌▒███   `);
		console.log('\x1b[34;2m%s\x1b[0m', `▒▓█  ▄  ░██ ██▒ ▓██▒  ▐▌██▒▒██   ██░░▓█▄ ██▌▒▓█  ▄ `);
		console.log('\x1b[34;2m%s\x1b[0m', `░▒████▒▒██▒ ▒██▒▒██░   ▓██░░ ████▓▒░░█████▓ ░█████▒`);
		console.log('\x1b[34;2m%s\x1b[0m', `░░ ▒░ ░▒▒ ░ ░▓ ░░ ▒░   ▒ ▒ ░ ▒░▒░▒░  ▒▒▓  ▒ ░░ ▒░ ░`);
		console.log('\x1b[34;2m%s\x1b[0m', ` ░ ░  ░░░   ░▒ ░░ ░░   ░ ▒░  ░ ▒ ▒░  ░ ▒  ▒  ░ ░  ░`);
		console.log('\x1b[34;2m%s\x1b[0m', ` ░    ░    ░     ░   ░ ░ ░ ░ ░ ▒   ░ ░  ░    ░    `);
	}

	use(...args: any[]): void {
		let path = "";
		let callback: (req: Request, res: Response, next?: () => void) => void;

		if (args.length === 1) {
			callback = args[0];
		} else if (args.length === 2) {
			path = args[0];
			callback = args[1];
		} else {
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

	listen(...args: any[]): http.Server {
		const server = http.createServer(this.handleRequest.bind(this));
		return server.listen(...args);
	}

	private async handleRequest(
		req: http.IncomingMessage,
		res: http.ServerResponse,
	): Promise<void> {
		try {
			this._request = new Request(req);
			this._response = new Response(res);
			await this.processMiddleware(0);
		} catch (error) {
			console.error("Error handling request:", error);
			res.statusCode = 500;
			res.end("Internal Server Error");
		}
	}

	private async processMiddleware(index: number): Promise<void> {
		const { _middleware, _request, _response } = this;
		const currentLayer = _middleware[index];
		const next = () => this.processMiddleware(index + 1);

		if (!currentLayer) {
			return;
		}

		const { path, method, callback } = currentLayer;
		const url = _request.url?.split("?")[0];
		const requestMethod = _request.method?.toLowerCase();

		if ((!path || url === path) && (!method || method?.toLowerCase() === requestMethod)) {
			await callback(_request, _response, next);
		} else {
			await next();
		}
	}

	get(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void {
		this._middleware.push({ path, method: "GET", callback });
		this.processMiddleware(0);
	}

	post(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void {
		this._middleware.push({ path, method: "POST", callback });
		this.processMiddleware(0);
	}

	put(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void {
		this._middleware.push({ path, method: "PUT", callback });
		this.processMiddleware(0);
	}

	delete(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void {
		this._middleware.push({ path, method: "DELETE", callback });
		this.processMiddleware(0);
	}

	patch(path: string, callback: (req: Request, res: Response) => Promise<void> | void): void {
		this._middleware.push({ path, method: "PATCH", callback });
		this.processMiddleware(0);
	}
}

export { Application as exnode };