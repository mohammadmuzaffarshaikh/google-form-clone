import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./models/dbConnect";
import mainRouter from "./routes/index.routes";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;
const app = express();
app.use(express.json());
app.use(cors());

const main = async () => {
  try {
    await dbConnect();
    app.use("/api", mainRouter);
    app.listen(port, () => {
      console.log(`app is listening at port: ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

main();
