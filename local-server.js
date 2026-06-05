const fs = require("fs");
const http = require("http");
const path = require("path");

const file = path.join(__dirname, "dist", "index.html");
const port = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    if (!fs.existsSync(file)) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end("Run npm run build first.");
      return;
    }

    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => {
    console.log(`Social Hub Studio running on http://localhost:${port}`);
  });
