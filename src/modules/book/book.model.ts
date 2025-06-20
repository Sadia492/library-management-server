import { Model, model, Schema } from "mongoose";
import { BookStaticMethods, IBook } from "./book.interface";

const bookSchema = new Schema<IBook, BookStaticMethods>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message:
          "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
      },
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      validate: {
        validator: function (value: string) {
          // Very basic ISBN pattern (optional: use a library like `validator`)
          return /^[\d-]+$/.test(value);
        },
        message: (props: any) => `ISBN ${props.value} is not a valid format`,
      },
    },
    description: {
      type: String,
      default: "",
    },
    copies: {
      type: Number,
      required: [true, "Copies field is required"],
      min: [0, "Copies must be a positive number"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.static("updateAvailability", async function (bookId: string) {
  const book = await this.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }
  book.available = book.copies > 0;
  await book.save();
});

const Book = model<IBook, BookStaticMethods>("Book", bookSchema);

export default Book;
