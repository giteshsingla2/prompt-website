import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this poster."],
    },
    category: {
      type: String,
      required: [true, "Please provide a category for this poster."],
    },
    date: {
      type: String,
    },
    author: {
      type: String,
      default: "Studio",
    },
    image: {
      type: String,
      required: [true, "Please provide an image URL for this poster."],
    },
    blurb: {
      type: String,
      required: [true, "Please provide a description/blurb for this poster."],
    },
    prompt: {
      type: String,
      required: [true, "Please provide the AI prompt for this poster."],
    },
  },
  {
    timestamps: true,
  }
);

// Format _id to id when converting to JSON
PostSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
