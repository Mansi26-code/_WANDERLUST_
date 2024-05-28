const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const listingSchema = new mongoose.Schema({
  // Schema definition
}, { collection: 'listings' }); // Specify the collection name here


const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({
    ...obj, owner:"664f49d3ce163cc3aaf72b14",
  }));
  await Listing.insertMany(initData.data);
  console.log(initData)
  console.log("data was initialized");
};

initDB();

