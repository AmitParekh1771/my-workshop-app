const express = require('express');
const app = express();
const compression = require('compression');

app.use(compression());
app.use(express.static(__dirname + '/dist/my-workshop-app'));

app.all('*', (req, res) => {
    res.status(200).sendFile(__dirname + '/dist/my-workshop-app/index.html');
});

const port = process.env.PORT || 4300;

app.listen(port, () => { console.log(`Listening on http://localhost:${port}`) });