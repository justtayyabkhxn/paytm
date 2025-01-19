const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require('dotenv').config({path:"./.env"});


console.log("Starting the server...");
const app = express();
app.use(cors())
app.use(express.json())

mongoose.connect(
    `${process.env.MONGO_LINK}`
)
    // Log when the database connects successfully
    .then(() => {
        console.log('Database connected!');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
    
    
app.use("/api/v1", rootRouter);


app.listen(3000)

