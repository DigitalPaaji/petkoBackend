import mongoose from "mongoose";
import { genteratSlug } from "../helper/generateSlug.js";

const sectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  paragraphs: {
    type: [String],
    default: [],
  },
  points: {
    type: [String],
    default: [],
  },
});

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
      maxlength: [150, "Title can't be longer than 150 characters"],
    },
    images: {
      type: [String],
      default: [],
    },
   
    tag: {
      type: String,
      trim: true,
      default: "General",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    author: {
      type: String,
      trim: true,
      default: "Anonymous",
    },
    readingTime: {
      type: Number,
      min: [1, "Reading time must be at least 1 minute"],
      default: 3,
    },
    
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("blog", blogSchema);
export default Blog;
