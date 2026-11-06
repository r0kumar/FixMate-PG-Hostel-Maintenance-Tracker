import mongoose from 'mongoose';

const LOCALHOST_PATTERNS = ['127.0.0.1', 'localhost'];

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);

  if (!mongoUri) {
    if (isProduction) {
      const missingVarMsg =
        '[MongoDB] FATAL: Neither MONGO_URI nor MONGODB_URI is defined in your environment variables.\n' +
        'Please configure MONGO_URI in your Render Dashboard -> Environment Variables with your MongoDB Atlas connection string.';
      console.error(missingVarMsg);
      throw new Error(missingVarMsg);
    } else {
      console.warn('[MongoDB] No MONGO_URI found in environment. Falling back to local MongoDB for development.');
    }
  }

  const targetUri = mongoUri || 'mongodb://127.0.0.1:27017/fixmate';

  // Guard: Reject localhost/127.0.0.1 URIs in production.
  // This catches the case where MONGO_URI is set but still points to a local address
  // (e.g. the .env file value was accidentally used as the Render environment variable value).
  if (isProduction && LOCALHOST_PATTERNS.some((pattern) => targetUri.includes(pattern))) {
    const localUriMsg =
      '[MongoDB] FATAL: MONGO_URI is set to a localhost address, which is unreachable on Render.\n' +
      'Your Render Environment Variable "MONGO_URI" must be set to your MongoDB Atlas connection string.\n' +
      'Format: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority\n' +
      'Fix: Render Dashboard -> Your Service -> Environment -> MONGO_URI -> Edit -> paste your Atlas URI.';
    console.error(localUriMsg);
    throw new Error('[MongoDB] FATAL: MONGO_URI points to localhost, which is unreachable in production. See logs for fix instructions.');
  }

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Log the error message only — never log the URI itself to avoid exposing credentials.
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (isProduction) {
      console.error(
        '[MongoDB] Deployment Troubleshooting Tips:\n' +
        '1. Verify MONGO_URI secret is set in Render Environment Variables (not from your .env file).\n' +
        '2. In MongoDB Atlas -> Network Access, ensure IP 0.0.0.0/0 (Allow Access from Anywhere) is whitelisted.\n' +
        '3. Check database user credentials in Atlas (ensure special characters in password are URL-encoded).\n' +
        '4. Ensure the database name is specified in the URI (e.g. ...mongodb.net/fixmate?retryWrites=true).'
      );
      throw error;
    } else {
      console.warn('[MongoDB] Tip: Ensure your local MongoDB server is running or set MONGO_URI in .env');
    }
  }
};

export default connectDB;

