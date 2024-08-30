const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

// Load models
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
const { v4: uuidv4 } = require('uuid');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/pos-db');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

// Ingredient list
const ingredientNames = [
  'Tomato',
  'Basil',
  'Mozzarella Cheese',
  'Garlic',
  'Olive Oil',
  'Parmesan Cheese',
  'Pasta',
  'Ground Beef',
  'Chicken Breast',
  'Mushrooms',
  'Bell Peppers',
  'Onions',
  'Spinach',
  'Eggplant',
  'Zucchini',
  'Balsamic Vinegar',
  'Capers',
  'Prosciutto',
  'Salami',
  'Ricotta Cheese',
  'Saffron',
  'Rosemary',
  'Thyme',
  'Oregano',
  'Chili Flakes',
  'Cream',
  'Butter',
  'Chicken Stock',
  'Beef Broth',
  'White Wine',
  'Red Wine',
  'Seafood Mix',
  'Bread Crumbs',
  'Fennel Seeds',
  'Lemon Juice',
  'Cucumber',
  'Avocado',
  'Dried Tomatoes',
  'Gorgonzola Cheese',
  'Artichokes',
];

const dishNames = [
  'Bruschetta al Pomodoro',
  'Arancini di Riso',
  'Caprese Salad',
  'Prosciutto e Melone',
  'Calamari Fritti',
  'Carpaccio di Manzo',
  'Crostini di Fegato',
  'Spaghetti Carbonara',
  'Lasagna alla Bolognese',
  'Margherita Pizza',
  'Risotto ai Funghi',
  'Osso Buco',
  'Fettuccine Alfredo',
  'Melanzane alla Parmigiana',
  'Penne Arrabbiata',
  'Saltimbocca alla Romana',
  'Gnocchi al Pesto',
  'Tiramisu',
  'Panna Cotta',
  'Cannoli',
  'Zabaglione',
  'Gelato',
  'Cassata Siciliana',
  'Affogato al Caffè',
  'Espresso',
  'Cappuccino',
  'Limoncello',
  'Negroni',
  'Aperol Spritz',
  'Chianti',
  'Prosecco',
];

const dishDescriptions = [
  'Toasted bread topped with a mixture of ripe tomatoes, garlic, basil, and olive oil.',
  'Crispy, golden rice balls stuffed with a cheesy filling and served with marinara sauce.',
  'A fresh salad featuring ripe tomatoes, mozzarella cheese, basil, and a drizzle of balsamic vinegar.',
  'Thin slices of cured ham served with sweet cantaloupe melon.',
  'Fried squid rings served with a side of marinara sauce or lemon wedges.',
  'Thinly sliced raw beef topped with arugula, Parmesan, and a drizzle of olive oil.',
  'Toasted bread slices topped with a savory chicken liver pâté.',
  'Pasta cooked with eggs, cheese, pancetta, and black pepper for a creamy, savory dish.',
  'Layers of pasta, beef ragu, and béchamel sauce baked to perfection.',
  'A classic pizza topped with fresh tomato sauce, mozzarella cheese, and basil leaves.',
  'Creamy risotto made with a variety of wild mushrooms and finished with Parmesan cheese.',
  'Braised veal shanks cooked with white wine, broth, and vegetables, served with gremolata.',
  'Pasta tossed with a rich cream sauce, Parmesan cheese, and butter.',
  'Eggplant slices baked with marinara sauce and melted mozzarella cheese.',
  'Pasta tubes in a spicy tomato sauce with garlic and chili flakes.',
  'Veal scaloppine topped with prosciutto and sage, then cooked in white wine sauce.',
  'Soft potato dumplings tossed with a basil pesto sauce and Parmesan cheese.',
  'A classic Italian dessert made with coffee-soaked ladyfingers, mascarpone cheese, and cocoa powder.',
  'A creamy vanilla custard dessert, often topped with fresh fruit or caramel sauce.',
  'Crispy pastry tubes filled with sweetened ricotta cheese and chocolate chips.',
  'A light, frothy dessert made with egg yolks, sugar, and Marsala wine.',
  'A smooth and creamy frozen dessert available in various flavors.',
  'A Sicilian dessert made with ricotta cheese, candied fruit, and chocolate chips.',
  'Espresso coffee topped with a scoop of vanilla gelato, creating a rich and creamy treat.',
  'Strong, dark coffee served in small, concentrated shots.',
  'A frothy coffee drink made with espresso and steamed milk, often topped with foam.',
  'A sweet, lemon-flavored liqueur often enjoyed as a digestif.',
  'A classic Italian cocktail made with gin, vermouth, and Campari, garnished with an orange twist.',
  'A refreshing Italian cocktail made with Prosecco, Aperol, and soda water.',
  'A robust red wine from Tuscany, known for its rich flavor and complex aroma.',
  'A sparkling white wine from the Veneto region, perfect for toasts and celebrations.',
];

const dishStations = [
  'cold',
  'hot',
  'cold',
  'cold',
  'hot',
  'cold',
  'hot',
  'hot',
  'hot',
  'hot',
  'hot',
  'hot',
  'hot',
  'hot',
  'hot',
  'hot',
  'cold',
  'cold',
  'cold',
  'cold',
  'cold',
  'cold',
  'beverages',
  'beverages',
  'beverages',
  'beverages',
  'beverages',
  'beverages',
  'beverages',
];

const orderStatus = [
  'received',
  'in_progress',
  'ready_for_assembly',
  'on_the_way',
  'ready_for_pickup',
];

let ingredientIds = [];
let dishIds = [];
let categoryIds = [];

// Helper function to get random elements from an array
function getRandomElements(arr, num) {
  const shuffled = arr.slice(0);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, num);
}

const getDishIds = async () => {
  try {
    // Query the database to retrieve all ingredients
    const dishes = await DishModel.find({}, '_id').exec();

    // Extract IDs into an array
    dishIds = dishes.map((dish) => dish._id);

    // Log the IDs
    console.log('Dish IDs:', dishIds);
  } catch (error) {
    console.error('Error retrieving dish IDs:', error);
  }
};

// Function to generate random data for ingredients
const generateIngredients = async () => {
  try {
    await connectDB();
    const ingredients = Array.from({ length: 50 }, () => {
      const randomIngredient = faker.helpers.arrayElement(ingredientNames);
      return new IngredientModel({
        name: randomIngredient,
        in_stock_qty: faker.number.int({ min: 1, max: 100 }),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      });
    });

    await IngredientModel.insertMany(ingredients);
    console.log('Ingredients seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

// Function to get ingredient IDs
const getIngredientIds = async () => {
  try {
    // Query the database to retrieve all ingredients
    const ingredients = await IngredientModel.find({}, '_id').exec();

    // Extract IDs into an array
    ingredientIds = ingredients.map((ingredient) => ingredient._id);

    // Log the IDs
    console.log('Ingredient IDs:', ingredientIds);
  } catch (error) {
    console.error('Error retrieving ingredient IDs:', error);
  }
};

// const getRandomElements = (arr, num) => {
//   const shuffled = arr.sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, num);
// };
const generateDishes = async () => {
  try {
    // Ensure the database is connected
    await connectDB();

    // Fetch ingredient IDs from the database
    const ingredientDocuments = await IngredientModel.find({}, '_id').exec();
    const ingredientIds = ingredientDocuments.map((doc) => doc._id.toString());

    // Verify that ingredientIds is populated
    // console.log('Ingredient IDs:', ingredientIds);

    const dishes = dishNames.map((name, index) => {
      const dishDescription = dishDescriptions[index];
      const dishStation = dishStations[index];

      // Select random ingredients
      const randomIngredients = getRandomElements(
        ingredientIds,
        faker.number.int({ min: 2, max: 6 })
      );

      // Verify randomIngredients
      // console.log('Random Ingredients for', name, ':', randomIngredients);

      // Create ingredients array with only ingredient IDs as strings
      const ingredients = randomIngredients.map((id) => ({
        ingredient_id: id,
        is_essential: faker.datatype.boolean(),
      }));

      // Generate image name with either .jpg or .png randomly
      const imageName = `${name
        .replace(/\s+/g, '_')
        .toLowerCase()}.${faker.helpers.arrayElement(['jpg', 'png'])}`;

      return {
        name,
        description: dishDescription,
        price: parseFloat(
          (
            Math.floor(faker.number.float({ min: 5, max: 20 }) / 1) + 0.99
          ).toFixed(2)
        ),
        image_name: imageName,
        station: dishStation,
        ingredients,
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      };
    });

    // Verify dishes
    console.log('Prepared dishes for insertion:', dishes);

    await DishModel.insertMany(dishes);
    console.log('Dishes seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

const generateOrders = async () => {
  try {
    await connectDB();

    const orders = Array.from({ length: 50 }, () => {
      const randomDishes = getRandomElements(
        dishIds,
        faker.number.int({ min: 2, max: 6 })
      );

      const randomOrderStatus = faker.helpers.arrayElement(orderStatus);

      // Randomly set scheduled_at to either a future date or null
      const scheduledAt = faker.datatype.boolean() ? faker.date.future() : null;

      return new OrderModel({
        given_name: faker.person.firstName(),
        table_number: faker.number.int({ min: 1, max: 30 }),
        status: randomOrderStatus,
        priority: faker.number.int({ min: 1, max: 5 }),
        dish_ids: randomDishes,
        scheduled_at: scheduledAt, // Can be null or a future date
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      });
    });

    await OrderModel.insertMany(orders);
    console.log('Orders seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

const generateCategories = async () => {
  try {
    await connectDB();

    // Fetch all dish IDs from the database
    const dishes = await DishModel.find({}, '_id');
    const dishIds = dishes.map((dish) => dish._id);

    // Check if dishIds array is populated
    if (dishIds.length === 0) {
      throw new Error(
        'No dishes found in the database. Ensure dishes are seeded.'
      );
    }

    // Iterate over categoryList to create categories
    const categories = categoryList.map((category) => {
      const randomDishes = getRandomElements(
        dishIds,
        faker.number.int({ min: 2, max: 6 })
      );

      return new CategoryModel({
        name: category,
        dish_ids: randomDishes,
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      });
    });

    // Insert the exact number of categories corresponding to the length of categoryList
    await CategoryModel.insertMany(categories);
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

const categoryList = ['Appetizers', 'Main Course', 'Dessert', 'Drinks'];

const menuList = ['Breakfast', 'Lunch', 'Dinner'];

const generateMenus = async () => {
  try {
    await connectDB();

    // Fetch all dish IDs from the database
    const categories = await CategoryModel.find({}, '_id');
    const categoryIds = categories.map((category) => category._id);

    // Check if dishIds array is populated
    if (categoryIds.length === 0) {
      throw new Error(
        'No categories found in the database. Ensure categories are seeded.'
      );
    }

    // Iterate over categoryList to create categories
    const menus = menuList.map((menu) => {
      // const randomDishes = getRandomElements(
      //   dishIds,
      //   faker.number.int({ min: 2, max: 6 })
      // );

      return new MenuModel({
        name: menu,
        category_ids: categoryIds,
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      });
    });

    // Insert the exact number of categories corresponding to the length of categoryList
    await MenuModel.insertMany(menus);
    console.log('Menus seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

const userNames = [
  'api_user01',
  'dev_user02',
  'tech_guru03',
  'coder_jane04',
  'dev_master05',
  'api_expert06',
  'backend_pro07',
  'frontend_dev08',
  'fullstack_ninja09',
  'sysadmin_joe10',
];

const passwords = [
  'Passw0rd123!',
  'SecureP@ss456',
  'Tech1234Guru!',
  'CoderJane$2023',
  'DevMaster@789',
  'ApiExpert#101',
  'BackendPro!202',
  'Frontend@Dev303',
  'FullstackN1nja!',
  'SysAdminJoe$404',
];

const emails = [
  'api.user01@example.com',
  'dev.user02@example.com',
  'tech.guru03@example.com',
  'coder.jane04@example.com',
  'dev.master05@example.com',
  'api.expert06@example.com',
  'backend.pro07@example.com',
  'frontend.dev08@example.com',
  'fullstack.ninja09@example.com',
  'sysadmin.joe10@example.com',
];

const roles = ['patron', 'expeditor', 'chef', 'manager'];

const generateUsers = async () => {
  try {
    await connectDB();

    // Create users using the data from the arrays
    const users = userNames.map((userName, index) => {
      // Choose a random role for each user
      const randomRole = faker.helpers.arrayElement(roles);

      return new UserModel({
        user_name: userName,
        password: passwords[index],
        email: emails[index],
        role: randomRole,
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      });
    });

    // Insert the generated users into the database
    await UserModel.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

const generateAuths = async () => {
  try {
    await connectDB();
    const auths = userNames.map((userName) => {
      return new AuthModel({
        access_token: uuidv4(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000),
        refresh_token: uuidv4(),
        token_type: 'Bearer',
        user_name: userName,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
    await AuthModel.insertMany(auths);
    console.log('Auths seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

const deleteAll = async (model) => {
  try {
    await connectDB();
    await model.deleteMany({});
    console.log(`All documents deleted successfully from ${model.modelName}`);
  } catch (error) {
    console.error(`Error deleting documents from ${model.modelName}:`, error);
  } finally {
    await mongoose.disconnect();
  }
};

// Example usage:
const deleteAllDishes = async () => await deleteAll(DishModel);
const deleteAllUsers = async () => await deleteAll(UserModel);

// Call your functions
// deleteAllDishes();
// deleteAllUsers();
// deleteAllCategories();
// deleteAllOrders();
// deleteAllMenus();
// deleteAllIngredients();
// deleteAllAuths();

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

// getCategories();
// getOrders();
// getMenus();
// getUsers();
// getIngredients();
// getDishes();
// getAuths();

// Main function to run the seed and get IDs
const main = async () => {
  try {
    await connectDB();
    await generateIngredients();
    // await getIngredientIds();
    // await deleteAllDishes();
    await generateDishes();
    // await getDishIds();
    await generateOrders();
    await generateCategories();
    // await getCategories();
    await generateMenus();
    // await deleteAllUsers();
    await generateUsers();
    // await getUsers();
    await generateAuths();
  } catch (error) {
    console.error('Error during operations:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
};

// Run the main function
main();

// FIX THE PRICE THING!!
