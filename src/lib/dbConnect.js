import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// collection helper
export const dbConnect = async (collectionName) => {
  const connectedClient = await clientPromise;

  return connectedClient.db(dbName).collection(collectionName);
};

// Furniture website collections
export const collections = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  CATEGORIES: "categories",
  REVIEWS: "reviews",
  FURNITURE: "furniture",
};

export default clientPromise;
