import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectDB from "./db/connectDB.js";
import Player from "./models/player.models.js";
import cookieParser from "cookie-parser";
// import { playersData } from "./db/IPL_Player_Stat.csv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// app.get("/", async (req, res) => {
//     const data = await Player.insertMany([playersData]);
//     console.log("data inserted");
// });
app.use("/", authRouter);

app.listen(PORT, () => {
    connectDB();
    console.log("Server running at port http://localhost:" + PORT);
});
