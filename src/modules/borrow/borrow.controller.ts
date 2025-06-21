import express, { Request, Response } from "express";
import Borrow from "./borrow.model";
import Book from "../book/book.model";
export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response): Promise<any> => {
  const { book: bookId, quantity, dueDate } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
      error: "Invalid book ID",
    });
  }

  if (book.copies < quantity) {
    return res.status(400).json({
      success: false,
      message: "Insufficient copies available",
      error: "Not enough copies in stock",
    });
  }

  // Create borrow record
  const borrow = await Borrow.create({
    book: book._id,
    quantity,
    dueDate,
  });

  res.status(201).json({
    success: true,
    message: "Book borrowed successfully",
    data: borrow,
  });
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          totalQuantity: 1,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the borrowed books summary",
      error,
    });
  }
});
