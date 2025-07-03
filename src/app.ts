import cors from "cors";
import express, { Application, Request, Response } from "express";
import { booksRoutes } from "./modules/book/book.controller";
import { borrowRoutes } from "./modules/borrow/borrow.controller";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://library-management-client-sigma.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management App");
});

export default app;
