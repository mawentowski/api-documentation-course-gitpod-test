const mongoose = require('mongoose');
const IngredientModel = mongoose.model(
  'Ingredient',
  require('../models/Ingredient').Ingredient
);

// MongoDB connection URL
mongoose.connect('mongodb://localhost:27017/pos-db');

const getIngredientIds = async () => {
  try {
    // Query the database to retrieve all ingredients
    const ingredients = await IngredientModel.find({}, '_id').exec();

    // Extract IDs into an array
    const ingredientIds = ingredients.map((ingredient) => ingredient._id);

    // Log the IDs
    console.log('Ingredient IDs:', ingredientIds);
  } catch (error) {
    console.error('Error retrieving ingredient IDs:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
};

getIngredientIds();
