import mongoose from 'mongoose';

export async function connectDB() {
  try {
    let connStr = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!connStr) {
      const user = process.env.MONGO_USER || 'admin';
      const pass = process.env.MONGO_PASSWORD || 'password123';
      const host = process.env.MONGO_HOST || '127.0.0.1';
      const port = process.env.MONGO_PORT || '27017';
      const db = process.env.MONGO_DB || 'chatapp';

      if (user && pass) {
        connStr = `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`;
      } else {
        connStr = `mongodb://${host}:${port}/${db}`;
      }
    }

    try {
      const conn = await mongoose.connect(connStr);
      console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (authErr) {
      if (authErr.message.includes('Authentication failed') && connStr.includes('127.0.0.1')) {
        const fallbackStr = `mongodb://127.0.0.1:27017/chatapp`;
        console.warn(`[MongoDB Warning]: Auth failed on localhost, retrying without auth credentials...`);
        try {
          await mongoose.disconnect();
        } catch {}
        const fallbackConn = await mongoose.connect(fallbackStr);
        console.log(`[MongoDB Connected]: ${fallbackConn.connection.host}/${fallbackConn.connection.name} (local)`);
        return fallbackConn;
      }
      throw authErr;
    }
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
}
