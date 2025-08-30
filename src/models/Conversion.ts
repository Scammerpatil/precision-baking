import mongoose, { Schema } from "mongoose";
const ConversionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Conversion =
  mongoose.models.Conversion || mongoose.model("Conversion", ConversionSchema);
export default Conversion;
