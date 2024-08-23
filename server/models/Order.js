"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// internal db model
exports.Order = new Schema({
  given_name: String,
  table_number: Number,
  status: String,
  priority: Number,
  dish_ids: [String],
  scheduled_at: String,
  created_at: Date,
  updated_at: Date,
});

// external model (API)
exports.Order.methods.toResultFormat = async function () {
  return {
    // ids have _id
    order_id: this._id,
    created_at: this.created_at,
    updated_at: this.updated_at,
    given_name: this.given_name,
    table_number: this.table_number,
    status: this.status,
    priority: this.priority,
    scheduled_at: this.scheduled_at,
    dish_ids: this.dish_ids,
  };
};
