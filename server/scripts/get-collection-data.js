const mongoose = require('mongoose');
const OrderModel = mongoose.model('Order', require('./models/Order').Order);
const IngredientModel = mongoose.model(
  'Ingredient',
  require('./models/Ingredient').Ingredient
);
const AuthModel = mongoose.model('Auth', require('./models/Auth').Auth);
const UserModel = mongoose.model('User', require('./models/User').User);
const DishModel = mongoose.model('Dish', require('./models/Dish').Dish);
const CategoryModel = mongoose.model(
  'Category',
  require('./models/Category').Category
);
const MenuModel = mongoose.model('Menu', require('./models/Menu').Menu);
import { connectDB } from './connectDB';

const getCollectionData = async (model) => {
  try {
    await connectDB();

    const data = await model.find();
    console.log(`${model.modelName}s:`, data);

    return data;
  } catch (error) {
    console.error(
      `Error fetching ${model.modelName}s from the database:`,
      error
    );
  }
};

const getCategories = async () => await getCollectionData(CategoryModel);
const getOrders = async () => await getCollectionData(OrderModel);
const getMenus = async () => await getCollectionData(MenuModel);
const getUsers = async () => await getCollectionData(UserModel);
const getIngredients = async () => await getCollectionData(IngredientModel);
const getDishes = async () => await getCollectionData(DishModel);
const getAuths = async () => await getCollectionData(AuthModel);

getCategories();
getOrders();
getMenus();
getUsers();
getIngredients();
getDishes();
getAuths();
