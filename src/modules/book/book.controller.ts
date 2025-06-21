import express, { Request, Response } from "express";
import Book from "./book.model";
export const booksRoutes = express.Router();

booksRoutes.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const book = await Book.create(req.body); // Let Mongoose validate everything

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const formattedErrors: Record<string, any> = {};

      for (const field in error.errors) {
        const err = error.errors[field];
        formattedErrors[field] = {
          message: err.message,
          name: err.name,
          properties: {
            message: err.properties?.message,
            type: err.properties?.type,
            min: err.properties?.min,
          },
          kind: err.kind,
          path: err.path,
          value: err.value,
        };
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: {
          name: "ValidationError",
          errors: formattedErrors,
        },
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: {
          name: "ValidationError",
          errors: {
            isbn: {
              message: `ISBN "${error.keyValue.isbn}" already exists`,
              name: "DuplicateKeyError",
              properties: {
                type: "unique",
                path: "isbn",
                value: error.keyValue.isbn,
              },
              kind: "duplicate",
              path: "isbn",
              value: error.keyValue.isbn,
            },
          },
        },
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
});

booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    const findQuery: any = {};
    if (filter) {
      findQuery.genre = filter;
    }

    const books = await Book.find(findQuery)
      .sort({ [sortBy as string]: sort === "asc" ? 1 : -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving books",
      success: false,
      error,
    });
  }
});

booksRoutes.get(
  "/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.bookId;

      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
          error: {
            name: "NotFoundError",
            message: `No book found with ID: ${id}`,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred while retrieving the book",
        error,
      });
    }
  }
);

booksRoutes.put(
  "/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.bookId;
      const body = req.body;

      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
          error: {
            name: "NotFoundError",
            message: `No book found with ID: ${id}`,
          },
        });
      }

      const originalCopies = book.copies;

      Object.assign(book, body);
      await book.save();

      // Only update availability if copies were updated
      if (body.copies !== undefined && body.copies !== originalCopies) {
        await Book.updateAvailability(book._id);
      }

      const updatedBook = await Book.findById(book._id);

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the book",
        error,
      });
    }
  }
);

booksRoutes.delete(
  "/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.bookId;

      const deletedBook = await Book.findByIdAndDelete(id);

      if (!deletedBook) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
          error: {
            name: "NotFoundError",
            message: `No book found with ID: ${id}`,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the book",
        error,
      });
    }
  }
);
