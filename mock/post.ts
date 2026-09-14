export function post(server, route, callback) {
    server.middlewares.use(route, async (req, res) => {
        if (req.method === 'POST') {
            res.statusCode = 200;
            const chunks = [];
            for await (const chunk of req) {
                chunks.push(chunk);
            }
            const contentType = req.headers['content-type'] || '';
            let body;
            const applicationOctetStream = 'application/octet-stream';
            const applicationJson = 'application/json';
            if (contentType.startsWith(applicationOctetStream)) {
                const b = Buffer.concat(chunks), i = b.byteOffset;
                body = b.buffer.slice(i, i + b.byteLength);
            } else if (contentType.startsWith(applicationJson)) {
                body = JSON.parse(chunks.join(""))
            }
            let response = await callback(body, req.headers);
            if (response instanceof ArrayBuffer) {
                response = Buffer.from(response);
            } else if (typeof response === "object" && response !== null && !Buffer.isBuffer(response)) {
                response = JSON.stringify(response);
            }
            res.setHeader('Content-Type', typeof response === "string" ?
                applicationJson : applicationOctetStream);
            res.end(response);
        }
    });
}