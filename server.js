 //const express = require("express");
 const http = require("http");
const app = require("./app");
const server = http.createServer(app);


//////////////////server////////////////////
const port = process.env.PORT || 4444
server.listen(port , () => {
    console.log(`server runing port ${port}`);
})