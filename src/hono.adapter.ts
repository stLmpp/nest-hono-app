import { AbstractHttpAdapter } from '@nestjs/core';
import * as http from 'node:http';
import * as https from 'node:https';
import { Context, Hono, HonoRequest, Next } from 'hono';
import { NestApplicationOptions } from '@nestjs/common';
import { createAdaptorServer } from '@hono/node-server';
import { Server } from 'node:net';
import { Http2SecureServer, Http2Server } from 'http2';
import { bodyLimit as honoBodyLimit } from 'hono/body-limit';
import { RequestHandler } from '@nestjs/common/interfaces';
// TODO check if these imports exists
import {
  RedirectStatusCode,
  StatusCode,
} from 'hono/dist/types/utils/http-status.js';
import { RESPONSE_ALREADY_SENT } from '@hono/node-server/utils/response';
import { cors } from 'hono/cors';

type HonoHandler = RequestHandler<HonoRequest, Context>;
type ServerType = Server | Http2Server | Http2SecureServer;

export class HonoAdapter extends AbstractHttpAdapter<
  ServerType,
  HonoRequest,
  Context
> {
  constructor() {
    super(new Hono());
  }

  protected declare readonly instance: Hono;

  override initHttpServer(options: NestApplicationOptions): void {
    const createServer = options.httpsOptions
      ? https.createServer
      : http.createServer;
    this.httpServer = createAdaptorServer({
      fetch: this.instance.fetch,
      overrideGlobalObjects: false,
      createServer,
    });
  }

  override getType(): string {
    return 'hono';
  }

  override registerParserMiddleware(
    _prefix?: string,
    _rawBody?: boolean,
  ): void {
    this.instance.use(
      honoBodyLimit({
        maxSize: 100 * 1024,
      }),
    );
  }

  override head(
    pathOrHandler: string | HonoHandler,
    maybeHandler?: HonoHandler,
  ): void {
    const [path, handler] = this.#getPathAndHandler(
      pathOrHandler,
      maybeHandler,
    );
    this.instance.get(path, this.#getHandler(handler));
  }

  override get(
    pathOrHandler: string | HonoHandler,
    maybeHandler?: HonoHandler,
  ): void {
    const [path, handler] = this.#getPathAndHandler(
      pathOrHandler,
      maybeHandler,
    );
    this.instance.get(path, this.#getHandler(handler));
  }

  override post(
    pathOrHandler: string | HonoHandler,
    maybeHandler?: HonoHandler,
  ): void {
    const [path, handler] = this.#getPathAndHandler(
      pathOrHandler,
      maybeHandler,
    );
    this.instance.post(path, this.#getHandler(handler));
  }

  override delete(
    pathOrHandler: string | HonoHandler,
    maybeHandler?: HonoHandler,
  ): void {
    const [path, handler] = this.#getPathAndHandler(
      pathOrHandler,
      maybeHandler,
    );
    this.instance.delete(path, this.#getHandler(handler));
  }

  override put(
    pathOrHandler: string | HonoHandler,
    maybeHandler?: HonoHandler,
  ): void {
    const [path, handler] = this.#getPathAndHandler(
      pathOrHandler,
      maybeHandler,
    );
    this.instance.put(path, this.#getHandler(handler));
  }

  override patch(
    pathOrHandler: string | HonoHandler,
    maybeHandler?: HonoHandler,
  ): void {
    const [path, handler] = this.#getPathAndHandler(
      pathOrHandler,
      maybeHandler,
    );
    this.instance.patch(path, this.#getHandler(handler));
  }

  override use(
    pathOrHandler: string | HonoHandler,
    maybeHandler?: HonoHandler,
  ): void {
    const [path, handler] = this.#getPathAndHandler(
      pathOrHandler,
      maybeHandler,
    );
    this.instance.use(path, this.#getHandler(handler));
  }

  override options(
    pathOrHandler: string | HonoHandler,
    maybeHandler?: HonoHandler,
  ): void {
    const [path, handler] = this.#getPathAndHandler(
      pathOrHandler,
      maybeHandler,
    );
    this.instance.options(path, this.#getHandler(handler));
  }

  override all() {
    // TODO
    throw new Error('Method not implemented');
  }
  override search() {
    // TODO
    throw new Error('Method not implemented');
  }

  override listen(port: string | number, ...args: any[]): ServerType {
    return this.httpServer.listen(port, ...args);
  }

  override setHeader(c: Context, name: string, value: string): any {
    c.res.headers.set(name, value);
  }

  override getHeader(c: Context, name: string): string | undefined {
    return c.req.header(name);
  }

  override appendHeader(ctx: Context, name: string, value: string) {
    ctx.res.headers.append(name, value);
  }

  override reply(c: Context, body: unknown, statusCode?: StatusCode): void {
    if (statusCode) {
      c.status(statusCode);
    }
    c.set('body', body);
  }

  override status(ctx: Context, statusCode: StatusCode) {
    ctx.status(statusCode);
  }

  override end(): Response {
    return RESPONSE_ALREADY_SENT;
  }

  override redirect(ctx: Context, statusCode: RedirectStatusCode, url: string) {
    ctx.redirect(url, statusCode);
  }

  override isHeadersSent(_ctx: Context): boolean {
    return true;
  }

  override getRequestHostname(ctx: Context): string {
    return ctx.req.header().host || 'localhost';
  }

  override getRequestMethod(request: HonoRequest): string {
    return request.method;
  }

  override getRequestUrl(request: HonoRequest): string {
    return request.url;
  }

  override enableCors(options: any) {
    // TODO any
    this.instance.use(cors(options));
  }

  #getPathAndHandler(
    pathOrHandler: string | HonoHandler,
    handler?: HonoHandler,
  ): [string, HonoHandler] {
    if (typeof pathOrHandler === 'string') {
      if (!handler) {
        // TODO improve error
        throw new Error('Could not get handler');
      }
      return [pathOrHandler, handler];
    }
    return ['', pathOrHandler];
  }

  #getHandler(handler: HonoHandler) {
    return async (c: Context, next: Next) => {
      await handler(c.req, c, next);
      const body = c.get('body');
      return typeof body === 'string' || !body ? c.text(body) : c.json(body);
    };
  }
}
