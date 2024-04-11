import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
    //it is optional value and if it is returned is number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }
 try {
       const db = await mongoose.connect(process.env.MOGODB_URI||'', {});
       connection.isConnected = db.connections[0].readyState;

       console.log("Connected to database successfully");
 } catch (error) {
     console.error("database connection failed", error);
     process.exit(1);
    
 }
}

export default dbConnect;