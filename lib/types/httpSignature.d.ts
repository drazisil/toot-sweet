
declare module "http-signature" {
  import { ClientRequest } from "http";
  function sign(requestToSign: ClientRequest, options: {key: string, keyId: string, keyPassphrase?: string, headers?: string[]}): void
}
