const fs          = require("fs");
const ytdl        = require("ytdl-core");
const path        = require("path");
const express     = require("express");
const bodyParser  = require("body-parser");
const favicon     = require("serve-favicon");

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

app.post("/api/info", (req, res) => {
  ytdl.getInfo(req.body.link).then((result) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  });
});

app.post("/api/download", (req, res) => {
  const video = ytdl(req.body.link, { quality: req.body.quality });
  const stream = video.pipe(res);

  res.setHeader("Content-Disposition", 'attachment; filename="video.flv"');
  try {
    stream.on("finish", () => {
      res.statusCode = 200;
      res.end();
      console.log("File served");
    });
  } catch (error) {
    res.statusCode = 400;
    res.end(error.message);
    console.log("Error ocurred:", error);
  }
});

app.listen(SERVER_PORT);
console.log(`Listening on port ${SERVER_PORT}...`);
