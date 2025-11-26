import { createServer } from "https";
import { parse } from "url";
import next from "next";
import { readFileSync } from "fs";

const dev = false;
const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpsOptions = {
    key: readFileSync("/app/certs/key.pem"),
    cert: readFileSync("/app/certs/cert.pem")
  };

  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, () => {
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
