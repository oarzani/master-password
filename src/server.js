// create Webserver
// const { readSecrets } = require("./lib/secret");
// const loadJson = readSecrets();

const http = require("http");
// const server = http.createServer(function(request, response) {
//   response.writeHead(200, { "Content-Type": "text/plain" });
//   response.end(JSON.stringify(loadJson));
// });

// Einrichten von Mongodb beispiel w3 ressorces
// const MongoClient = require("mongodb").MongoClient;
// const mongodburl = "mongodb://localhost:27017/mydb";

// MongoClient.connect(mongodburl, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });
// MongoClient.connect(mongodburl, function(err, db) {
//   if (err) throw err;
//   let dbo = db.db("mydb");
//   dbo.createCollection("Letssee", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

//Beispiel oben ruft nur die JSON auf
const fs = require("fs");
const { get, set } = require("./lib/commands");
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
      const secret = get("leon", res);
      response.write(secret);
    } else if (request.method === "POST") {
      let body = "";
      request.on("data", function(data) {
        body += data;
        console.log("Partial body: " + body);
      });
      request.on("end", async function() {
        console.log("Body: " + body);
        set("leon", res, body);
        response.end(`Set ${res}`);
      });
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
