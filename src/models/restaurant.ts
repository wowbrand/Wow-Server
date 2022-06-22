import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  restaurantname: {
    type: String,
    required: true,
  },
  restaurantcity: {
    type: String,
    required: true,
  },
  restaurantzip: {
    type: String,
    required: true,
  },
  restaurantstreetnumber: {
    type: String,
    required: true,
  },
  restaurantdescription: {
    type: String,
    required: true,
  },
  restaurantdescriptionshort: {
    type: String,
    required: true,
  },
  restaurantMainImage: {
    type: String,
    required: false,
  },
});

const Restaurant = mongoose.model("Restaurant", userSchema);

export default Restaurant;
