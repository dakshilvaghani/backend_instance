import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["importent", "remember", "longterm"],
      default: "remember",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Data", DataSchema);
