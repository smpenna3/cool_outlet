// var http = require('http');
//
// http.createServer(function (req, res) {
// 	res.write('Hello World!');
// 	res.end();
// }).listen(8080);

const express = require('express')
const app = express()
const path = require('path');
const port = 7845

app.use(express.static('public'))

app.get('/hi', (req, res) => res.send('Hello World!'))
app.get('/hello', (req, res) => res.sendFile(path.join(__dirname+'/public/hello.html')))
app.get('/pickle', (req, res) => res.sendFile(path.join(__dirname+'/public/pickel.html')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
