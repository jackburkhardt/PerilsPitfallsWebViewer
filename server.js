const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
require('dotenv').config();

const port = Number(process.env.SERVER_PORT || 8000);
const useHttps = Number(process.env.USE_HTTPS || 0) > 0;
const keyFilePath = process.env.HTTPS_KEY_FILE_PATH;
const certFilePath = process.env.HTTPS_CERT_FILE_PATH;
const httpsPort = Number(process.env.HTTPS_SERVER_PORT || 8080);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.', {
    setHeaders: function(res, path) {

        if(path.includes(".wasm")){
            res.set("Content-Type", "application/wasm");
        }

        if (path.endsWith(".gz")) {
            res.set("Content-Encoding", "gzip");
        } else if (path.endsWith(".br")) {
            res.set("Content-Encoding", "br");
        }
    }
}));

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
    console.log(`Unity WebGL server listening at http://localhost:${port}/`);
});

if (useHttps) {
    const httpsServer = https.createServer({
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    }, app);
    httpsServer.listen(httpsPort, () => {
        console.log(`Unity WebGL server listening on port ${httpsPort}`);
    });
}