import http from 'http';
import {env} from "./env";

/**
 * Starts The Server
 * @constructor
 */
async function main() {
    // using the default http module
    const server = http.createServer(function (req, res) {
        res.write('Hello World!'); //write a response to the client
        res.end(); //end the response
    })


    // Listen to port 3000
    server.listen(env.APP_PORT, function () {
        console.log(`Server is running on port ${env.APP_PORT}`);
    })
}

// Start Server
main().catch(console.error);
