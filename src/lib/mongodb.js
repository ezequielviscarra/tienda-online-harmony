import mongoose from "mongoose";

var conn = {
  isConnected: false,
};
export async function conexionDb() {
  if (conn.isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    //const db = await mongoose.connect("mongodb://127.0.0.1:27017/db_harmony");

    conn.isConnected = true;
    console.log(db.connection.db.databaseName);
  } catch (error) {
    console.log("el error es : " + error);
  }
}

