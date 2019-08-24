const http = require('http');
const port = process.env.port || 3309 ;
const app = require('./app');

const server = http.createServer(app);

server.listen(port);
console.log('server is now running on poer'+ port);