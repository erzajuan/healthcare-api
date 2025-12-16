const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("debug", false); // or true if needed

    await mongoose.connect(
      `${process.env.MONGO_CLUSTER_URI}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
