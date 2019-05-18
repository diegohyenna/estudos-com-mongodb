const mongoose = require('mongoose')
const Schema = mongoose.Schema;
require('../models/Category')
const Category = mongoose.model('category')

const Post = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: Category,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  }
)

mongoose.model('post', Post)