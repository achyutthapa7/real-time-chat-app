import mongoose from "mongoose";
const connection_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_CONNECTION_URI_PRODUCTION
    : process.env.MONGO_CONNECTION_URI_DEVELOPMENT;

export const dbConnect = async () => {
  try {
    await mongoose
      .connect(connection_URI as string)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
      });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
