"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// internal db model
exports.Menu = new Schema({
  name: String,
  category_ids: [String],
  created_at: Date,
  updated_at: Date,
});

// external model (API)
exports.Menu.methods.toResultFormat = function () {
  return {
    // ids have _id
    menu_id: this._id,
    created_at: this.created_at,
    updated_at: this.updated_at,
    name: this.name,
    category_ids: this.category_ids,
  };
};
