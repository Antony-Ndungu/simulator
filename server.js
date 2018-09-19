const http = require('http');
const url = require("url");
const mongoUtil = require("./libs/mongoUtil");
mongoUtil.connect()
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
http.createServer((request, response) => {
    const headers = request.headers;
    const method = request.method;
    const parsedUrl = url.parse(request.url, true);
    let body = [];
    if (parsedUrl.pathname == "/simulator" && method === "GET") {
        const query = parsedUrl.query;
        const msisdn = query.msisdn;
        const accountNumber = query.accountNumber;
        const db = mongoUtil.getDb()
        const cursor = db.collection("bills").find(query)
        let projection = {
            accountNumber: 1,
            accountName: 1,
            accountBalance: 1,
            amountDue: 1,
            dueDate: 1,
            _id: 0
        };
        cursor.project(projection)
        cursor.hasNext().then(res => {
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            response.end(JSON.stringify(res));
        }).catch(err => {
            res.setHeader("Content-Type", "application/json");
            res.writeHead(500);
            response.end(JSON.stringify(err));
        })
    }

}).listen(port); // Activates this server, listening on port 3000


