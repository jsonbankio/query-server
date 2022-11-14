import http from 'http';
import {env} from "./env";
import {jsb_queryObject} from "./functions";

/**
 * Starts The Server
 * @constructor
 */
async function main() {
    // log ENV
    console.log(`Environment: ${env.NODE_ENV}`);

    // using the default http module
    const server = http.createServer(async function (req, res) {
        let isValidRequest = req.method == 'POST';
        let url: URL | null = null;

        try {
            // parse the url
            url = new URL(req.url || '', `https://${req.headers.host}`);

            if (!["/query", "/"].includes(url.pathname)) {
                isValidRequest = false;
            }
        } catch (e) {
            isValidRequest = false;
        }


        if (isValidRequest && url) {
            // if jsb query does not exist return error
            if (!url.searchParams.has('query')) {
                 sendJson(res, {
                    error: {code: 'missingQuery', message: 'Missing jsb query'}
                }, 400);
                 return
            }


            const body = await convertBodyToObject(req);
            if(body === null) {
                 sendJson(res, {
                    error: {code: 'invalidBody', message: 'Invalid body'}
                }, 400);
                 return
            }


            // check if body has content
            if (!body.hasOwnProperty('content')) {
                sendJson(res, {error: {code: 'missingContent', message: 'Missing content'}}, 400);
                return;
            }

            // check if content is string
            if (typeof body.content !== 'string') {
                // check if content is object
                if (typeof body.content !== 'object') {
                    sendJson(res, {error: {code: 'invalidContent', message: 'Invalid content'}}, 400);
                    return;
                }

                // if content is object, try to stringify it
                try {
                    body.content = JSON.stringify(body.content);
                } catch (e) {
                    sendJson(res, {error: {code: 'invalidContent', message: 'Invalid content'}}, 400);
                    return;
                }
            }

            jsb_queryObject(body.content, url, (data, status) =>
                sendJson(res, data, status));
        } else {
            sendJson(res, {
                endpoint: 'https://query.jsonbank.io',
                message: 'Only POST requests are allowed.',
            }, 400);
        }
    })


    // Listen to port 3000
    server.listen(env.JSB_QUERY_SERVER_PORT, function () {

        console.log(`${env.APP_NAME} is running on port ${env.JSB_QUERY_SERVER_PORT}`);
        // log link to console
        console.log(`http://localhost:${env.JSB_QUERY_SERVER_PORT}`);
    })
}

// Start Server
main().catch(console.error);


// ================================ Functions ================================

// Send JSON Response
function sendJson(res: http.ServerResponse, data: string | object, status = 200) {
    // set status code
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.write(typeof data === 'string' ? data : JSON.stringify(data));
    res.end();
}

// Convert Body to Object
function convertBodyToObject(req: http.IncomingMessage): Promise<Record<string, any>|null> {
    return new Promise((resolve) => {

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                resolve(null);
            }
        });
    });
}
