import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { handleRequest } from './src/handleRequest.js';

// Create a local server to receive data from
const server = createServer(handleRequest);

server.addListener("listening", () => {
  console.log('Server is listening')
})

server.addListener("close", () => {
  console.debug('Connection closed')
})

server.listen(9000, "0.0.0.0");