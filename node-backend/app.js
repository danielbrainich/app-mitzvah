const express = require('express');
const routes = require('./routes');

const app = express();
const port = 8000;

app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
