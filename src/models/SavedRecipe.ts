import mongoose, { Schema } from "mongoose";

const SavedRecipeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SavedRecipe =
  mongoose.models.SavedRecipe ||
  mongoose.model("SavedRecipe", SavedRecipeSchema);
export default SavedRecipe;
