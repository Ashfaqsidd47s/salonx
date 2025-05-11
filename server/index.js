import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors"
import authRouter from "./routes/auth.js"
import salonRouter from "./routes/salon.js"

const app = express();

app.use(express.json())
dotenv.config()

app.use(
    cors({
        origin: [process.env.CLIENT_URL,"http://localhost:5173"],
        methodName: "GET, POST, PUT, DELTE",
        credentials: true
    })
)


// connecting to the mongodb database
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:',err);
});

//ROUTES
app.use("/api/auth", authRouter);
app.use("/api/salon", salonRouter);

// Root Router
app.get("/",  (req, res) => {
    res.send("Server is working fine...");
})


// server initilization 
const PORT = 8080;

app.listen(PORT, () => {
    console.log("Server started at port :", PORT);
})