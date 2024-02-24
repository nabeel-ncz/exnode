import { ServerResponse } from 'http';

class Response {
  private _res: ServerResponse;

  constructor(res?: ServerResponse) {
    this._res = res!;
  }

  get socket() {
    return this._res.socket;
  }

  get status() {
    return this._res.statusCode;
  }

  set status(code: number) {
    this._res.statusCode = code;
  }

  setHeader(name: string, value: string | string[]) {
    this._res.setHeader(name, value);
  }

  send(data: any) {
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
  }

  json(data: any) {
    this.setHeader('Content-Type', 'application/json');
    this._res.write(JSON.stringify(data));
    this._res.end();
  }

  text(data: string) {
    this.setHeader('Content-Type', 'text/plain');
    this._res.write(data);
    this._res.end();
  }

  html(data: string) {
    this.setHeader('Content-Type', 'text/html');
    this._res.write(data);
    this._res.end();
  }

  redirect(url: string, statusCode: number = 302) {
    this.setHeader('Location', url);
    this.status = statusCode;
    this._res.end();
  }

  sendStatus(statusCode: number) {
    this.status = statusCode;
    this._res.statusMessage = `${statusCode}`;
    this._res.end();
  }
}

export default Response;