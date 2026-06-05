const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");

fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(root, "index.html"), path.join(dist, "index.html"));

console.log("Social Hub Studio built to dist/index.html");
