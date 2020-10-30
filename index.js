const fs          = require("fs");
const ytdl        = require("ytdl-core");
const path        = require("path");
const express     = require("express");
const bodyParser  = require("body-parser");
const favicon     = require("serve-favicon");
const { rejects } = require("assert");

const SERVER_PORT = process.env.PORT || 3000;
const app         = express();

app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, "favicon.ico")));

app.get("/", (req, res) => {
  const document = path.join(__dirname, "/public/index.html");

  fs.readFile(document, (err, html) => {
    if (err) {
      res.statusCode = 500;
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    }
  });
});

app.post("/api/info", async (request, response) => {
  response.setHeader("Content-Type", "application/json");

  try {
    const videoFormats = await (await ytdl.getInfo(request.body.link)).formats;
    response.statusCode = 200;
    response.end(JSON.stringify(videoFormats));
  } catch (error) {
    response.statusCode = 404;
    response.end(JSON.stringify({
      "error": {
        "message": error.message
      }
    }));
  }
});

app.post("/api/download", (req, res) => {
  //TODO: implement server-side input validation (#1);

  const video = ytdl(req.body.link, { quality: req.body.quality });
  const stream = video.pipe(res);

  stream.on('error', (error) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 404;
    res.end(JSON.stringify({
      "error": {
        "message": error.message
      } 
    }));
  });

  stream.on("finish", () => {
    res.statusCode = 200;
    res.end();
    });
  });

app.listen(SERVER_PORT);
console.log(`Listening on port ${SERVER_PORT}...`);
