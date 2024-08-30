const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

// Load models
const OrderModel = mongoose.model(
  'OrderModel',
  require('../models/Order').Order
);
const IngredientModel = mongoose.model(
  'Ingredient',
  require('../models/Ingredient').Ingredient
);
const AuthModel = mongoose.model('Auth', require('../models/Auth').Auth);
const UserModel = mongoose.model('User', require('../models/User').User);
const DishModel = mongoose.model('Dish', require('../models/Dish').Dish);

mongoose.connect('mongodb://localhost:27017/pos-db');

const getRandomElements = (arr, num) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const generateDishes = async () => {
  try {
    const dishes = dishNames.map((name, index) => {
      const dishDescription = dishDescriptions[index];
      const dishStation = dishStations[index];

      // Pull 2 or 3 random ingredients from the ingredientIds array
      const randomIngredients = getRandomElements(
        ingredientIds,
        faker.number.int({ min: 2, max: 3 })
      );

      // Create ingredients array with random ingredients and is_essential boolean
      const ingredients = randomIngredients.map((id) => ({
        ingredient_id: id,
        is_essential: faker.datatype.boolean(),
      }));

      // Generate image name with either .jpg or .png randomly
      const imageName = `${name
        .replace(/\s+/g, '_')
        .toLowerCase()}.${faker.helpers.arrayElement(['jpg', 'png'])}`;

      return new DishModel({
        name,
        description: dishDescription,
        price: faker.commerce.price(),
        image_name: imageName,
        station: dishStation,
        ingredients,
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      });
    });

    await DishModel.insertMany(dishes);
    console.log('Dishes seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

generateDishes();
