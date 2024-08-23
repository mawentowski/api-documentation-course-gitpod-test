"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// internal db model
exports.Dish = new Schema({
  name: String,
  description: String,
  price: Number,
  image_name: String,
  station: String,
  ingredients: [
    {
      ingredient_id: String,
      is_essential: Boolean,
    },
  ],
  created_at: Date,
  updated_at: Date,
});

// this is only returned for GET operations
// external model (API)
exports.Dish.methods.toResultFormat = function () {
  return {
    // ids have _id
    dish_id: this._id,
    created_at: this.created_at,
    updated_at: this.updated_at,
    name: this.name,
    description: this.description,
    price: this.price,
    image_name: this.image_name,
    station: this.station,
    ingredients: this.ingredients,
  };
};
