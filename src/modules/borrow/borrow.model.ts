import { Schema, model } from "mongoose";
import { IBorrow } from "./borrow.interface";
import Book from "../book/book.model";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

borrowSchema.pre("save", async function (next) {
  const book = await Book.findById(this.book);

  if (book) {
    // Deduct copies
    book.copies -= this.quantity;

    // Save updated book
    await book.save();

    // Update availability based on copies
    await Book.updateAvailability(book._id);
  }

  next();
});

const Borrow = model<IBorrow>("Borrow", borrowSchema);

export default Borrow;
