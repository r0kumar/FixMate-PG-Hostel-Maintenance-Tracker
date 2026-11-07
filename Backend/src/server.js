import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Await database connection before listening for traffic
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[FixMate Server] Running on http://localhost:${PORT}`);
    });

    return server;
  } catch (error) {
    console.error(`[FixMate Server] Startup aborted due to database connection failure: ${error.message}`);
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
      process.exit(1);
    }
  }
};

const server = await startServer();

export default server;

