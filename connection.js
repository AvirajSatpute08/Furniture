// // const mongoose = require('mongoose');
// // const { MongoClient } = require('mongodb');

// // const connectDB = async () => {
// //     try {
// //         await mongoose.connect('mongodb://localhost:27017/furniture', {
// //             useNewUrlParser: true,
// //             useUnifiedTopology: true,
// //         });
// //         console.log('MongoDB connected');
// //     } catch (err) {
// //         console.error('MongoDB connection failed:', err.message);
// //         process.exit(1); // Exit process with failure
// //     }
// // };
// // const uri = "mongodb://localhost:27017";  // Replace with your MongoDB URI
// // const dbName = "furniture";
// // async function connectToCollection(collectionName) {
// //     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// //     try {
// //         await client.connect();
// //         const db = client.db(dbName);
// //         return db.collection(collectionName);
// //     } catch (err) {
// //         console.error('Database connection error:', err);
// //         throw err;
// //     }
// // }


// // module.exports = connectDB;
// // module.exports = connectToCollection;



// const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');

// // Function to connect to MongoDB using Mongoose
// const connectDB = async () => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/furniture', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected with Mongoose');
//     } catch (err) {
//         console.error('Mongoose connection failed:', err.message);
//         process.exit(1); // Exit process with failure
//     }
// };

// // MongoDB URI and Database Name
// const uri = "mongodb://localhost:27017";  // Replace with your MongoDB URI
// const dbName = "furniture";

// // Function to connect to a MongoDB collection using MongoClient
// async function connectToCollection(collectionName) {
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     try {
//         await client.connect();
//         const db = client.db(dbName);
//         return db.collection(collectionName);
//     } catch (err) {
//         console.error('MongoClient connection error:', err);
//         throw err;
//     }
// }

// // Export both connectDB and connectToCollection functions
// module.exports = {
//     connectDB,
//     connectToCollection
// };


require('dotenv').config();  // Load environment variables from .env

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'furniture';

// Function to connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected with Mongoose');
    } catch (err) {
        console.error('Mongoose connection failed:', err.message);
        process.exit(1);
    }
};

// Function to connect to a MongoDB collection using MongoClient
async function connectToCollection(collectionName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return db.collection(collectionName);
    } catch (err) {
        console.error('MongoClient connection error:', err);
        throw err;
    }
}

module.exports = {
    connectDB,
    connectToCollection
};
