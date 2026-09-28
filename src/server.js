import app from "./app.js";
import { env, validateRequiredEnv } from "./config/env.js";
import { connectMongoDB } from "./config/database.js";

async function startServer() {
  try {
    validateRequiredEnv();
    await connectMongoDB();
    app.listen(env.port, () => console.log(`Portfolio API running on http://localhost:${env.port}`));
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

startServer();
