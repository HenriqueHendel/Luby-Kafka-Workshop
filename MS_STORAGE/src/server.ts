import express from "express";
import cors from "cors";
import Consumer from "./kafkaService/Consumer";

import "./database";
import routes from "./routes";

const consumer = new Consumer("my-first-group");
consumer.consume({ topic: "new-purchase", fromBeginning: false });

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333, () => console.log("MS_STORAGE running on port 3333!"));
