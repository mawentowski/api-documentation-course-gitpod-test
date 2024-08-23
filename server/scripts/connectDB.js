export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/pos-db');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
