declare module "@small-tech/https" {
  import {
    ClientRequest,
    IncomingMessage,
    ServerResponse,
    RequestListener,
  } from "node:http";
  import { RequestOptions, Server } from "node:https";
  type SmallOptions = {
    domains?: string[];
  };
  function request(
    options: RequestOptions | string | URL,
    callback?: (res: IncomingMessage) => void
  ): ClientRequest;
  function request(
    url: string | URL,
    options: RequestOptions,
    callback?: (res: IncomingMessage) => void
  ): ClientRequest;
  function createServer<
    Request extends typeof IncomingMessage = typeof IncomingMessage,
    Response extends typeof ServerResponse = typeof ServerResponse
  >(
    requestListener?: RequestListener<Request, Response>
  ): Server<Request, Response>;
  function createServer<
    Request extends typeof IncomingMessage = typeof IncomingMessage,
    Response extends typeof ServerResponse = typeof ServerResponse
  >(
    options: SmallOptions,
    requestListener?: RequestListener<Request, Response>
  ): Server<Request, Response>;
}
