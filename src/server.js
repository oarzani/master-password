// create Webserver

const http = require("http");

//Beispiel oben ruft nur die JSON auf
const fs = require("fs");
const { get, set, unset } = require("./lib/commands");
const url = require("url");
const { initDatabase } = require("./lib/database");

const server = http.createServer(async function(request, response) {
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
  console.log("Requested", pathname, request.method);

  try {
    const key = pathname;
    const res = key.slice(1);
    if (request.method === "GET") {
      const secret = await get("leon", res);
      response.write(secret);
    } else if (request.method === "POST") {
      let body = "";
      request.on("data", function(data) {
        body += data;
        console.log("Partial body: " + body);
      });
      request.on("end", async function() {
        console.log("Body: " + body);
        await set("leon", res, body);
        response.end(`Set ${res}`);
      });
    } else if (request.method === "DELETE") {
      await unset("leon", res);
      response.end(`Delete ${res}`);
    }
  } catch (error) {
    response.write("Unknown URL");
  }

  response.end();
});

initDatabase().then(() => {
  console.log("Database connected");
  server.listen(7000, () => {
    console.log("Server listens to http://localhost:7000");
  });
});
