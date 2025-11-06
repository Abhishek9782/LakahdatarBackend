const mongoose = require("mongoose");

const mongodbConnect = async () => {
  try {
    let db = await mongoose.connect(process.env.MONGO_URL);
    console.log(`db Connect successfully...`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { mongodbConnect };
