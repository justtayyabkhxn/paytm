const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");


const app = express();
app.use(cors())
app.use(express.json())

app.use("/app/v1", rootRouter);

app.listen(3000)

