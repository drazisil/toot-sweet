declare module "@small-tech/https" {
  import { ClientRequest, IncomingMessage } from "node:http";
  import { RequestOptions } from "node:https";
  function request(
    options: RequestOptions | string | URL,
    callback?: (res: IncomingMessage) => void,
): ClientRequest;
function request(
  url: string | URL,
  options: RequestOptions,
  callback?: (res: IncomingMessage) => void,
): ClientRequest;
}


