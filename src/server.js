// create Webserver
// const { readSecrets } = require("./lib/secret");
// const loadJson = readSecrets();

const http = require("http");
// const server = http.createServer(function(request, response) {
//   response.writeHead(200, { "Content-Type": "text/plain" });
//   response.end(JSON.stringify(loadJson));
// });

//Beispiel oben ruft nur die JSON auf

const { get } = require("./lib/commands");

const server = http.createServer(function(request, response) {
  if (request.url === "/favicon.ico") {
    return response.end();
  }
  if (request.url === "/") {
    return response.end("Welcome to my secrets manager");
  }
  console.log("Requested", request.url);

  try {
    const key = request.url;
    const res = key.slice(1);

    const secret = get("leon", res);
    response.write(secret);
  } catch (error) {
    response.write("Unknown URL");
  }

  response.end();
});

server.listen(7000);
