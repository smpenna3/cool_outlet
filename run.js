const express = require('express')
const app = express()
const path = require('path');
const port = 7845

app.use(express.static('scrolling_map'));
app.use(express.static('mcsnacks19/public'));

app.get('/hi', (req, res) => res.send('Hello World!'))
app.get('/map', (req, res) => res.sendFile(path.join(__dirname+'/scrolling_map/map.html')))
app.get('/bowdoin', (req, res) => res.sendFile(path.join(__dirname+'/mcsnacks19/public/bowdoin.html')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
