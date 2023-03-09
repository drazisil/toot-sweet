declare module "@small-tech/https" {
  import {
    ClientRequest,
    IncomingMessage,
    ServerResponse,
    RequestListener,
  } from "node:http";
  import { RequestOptions, Server } from "node:https";
  type Options = {
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
    options: Options,
    requestListener?: RequestListener<Request, Response>
  ): Server<Request, Response>;
}


declare module "http-signature" {
  import { ClientRequest } from "http";
  function sign(requestToSign: ClientRequest, options: {key: string, keyId: string, keyPassphrase?: string, headers?: string[]}): void
}

