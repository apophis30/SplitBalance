const express = require("express");
const rootRouter = require("./routes/index.js")
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 3000;

const app = express();

app.use(cors);
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/api/v1', rootRouter);

app.listen(PORT, (err) => {
    if(err) console.log(`Error in server setup: ${err}`);
    console.log(`Server running on: ${PORT}`);
})