"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// internal db model
exports.Category = new Schema({
  name: String,
  dish_ids: [String],
  created_at: Date,
  updated_at: Date,
});

// External model (API)
exports.Category.methods.toResultFormat = function () {
  return {
    category_id: this._id,
    created_at: this.created_at,
    updated_at: this.updated_at,
    name: this.name,
    dish_ids: this.dish_ids,
  };
};
