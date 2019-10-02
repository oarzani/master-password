// create Webserver
// const { readSecrets } = require("./lib/secret");
// const loadJson = readSecrets();

const http = require("http");
// const server = http.createServer(function(request, response) {
//   response.writeHead(200, { "Content-Type": "text/plain" });
//   response.end(JSON.stringify(loadJson));
// });

//Beispiel oben ruft nur die JSON auf
const fs = require("fs");
const { get } = require("./lib/commands");
const url = require("url");

const server = http.createServer(function(request, response) {
  const { pathname } = url.parse(request.url);
  // use url.parse to seperate url to pathname and search
  if (pathname === "/favicon.ico") {
    return response.end();
  }
  if (pathname === "/") {
    response.writeHead(200, { "Content-Type": "text/html" });
    const content = fs.readFileSync("src/view/index.html", "utf-8");
    return response.end(content);
  }
  console.log("Requested", pathname);

  try {
    const key = pathname;
    const res = key.slice(1);

    const secret = get("leon", res);
    response.write(secret);
  } catch (error) {
    response.write("Unknown URL");
  }

  response.end();
});

server.listen(7000, () => {
  console.log("Server listens n http://localhost:7000");
});
