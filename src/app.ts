import express, { Application, Request, Response } from "express";
import { booksRoutes } from "./modules/book/book.controller";

const app: Application = express();

app.use(express.json());

app.use("/api/books", booksRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management App");
});

export default app;
