import { Server } from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";

app.use(cors());
app.use(express.json());
let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url!);
    console.log("Connected to MongoDB");
    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

main();
