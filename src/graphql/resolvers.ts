import User from "../models/user";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Restaurant from "../models/restaurant";

const createUser = async function ({ userInput }: any, req: any) {
  const errors = [];
  if (!validator.isEmail(userInput.email)) {
    errors.push({
      message: "Email is invalid",
    });
  }
  if (
    validator.isEmpty(userInput.password) ||
    !validator.isLength(userInput.password, { min: 5 })
  ) {
    errors.push({ message: "Password to short" });
  }
  const existingUser = await User.findOne({ email: userInput.email });
  if (existingUser) {
    const errors = new Error("user exist already!");
    throw errors;
  }
  const hashedPw = await bcrypt.hash(userInput.password, 12);
  const user = new User({
    email: userInput.email,
    name: userInput.name,
    password: hashedPw,
  });
  if (errors.length > 0) {
    const error = new Error("invalid input");
    error.data = errors;
    error.code = 422;
    throw error;
  }
  const createdUser = await user.save();
  return { ...createdUser._doc, _id: createdUser.id.toString() };
};

const loginUser = async function ({ email, password }: any) {
  const user = await User.findOne({ email: email });
  console.log(user);
  if (!user) {
    const error = new Error("user not found");
    error.code = 401;
    throw error;
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = new Error("Password is incorrect.");
    error.code = 401;
    throw error;
  }
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    "process.env.SECRET_JWTyesiknowthisdoesnotworkbutatleastnowitsaveryhardkeytoguessifyoudontbelievemegiveitatrycloseyoureyesthinkofsomethingandifitisexactlythisstringiwillgiveyou2euro50andiwillbuyyouasnickers",
    { expiresIn: "3h" }
  );
  return { token: token, userId: user._id.toString() };
};

const createRestaurant = async function ({ restaurantInput }: any, req: any) {
  const existingRestaurant = await Restaurant.findOne({
    restaurantname: restaurantInput.restaurantname,
  });
  if (existingRestaurant) {
    const errors = new Error("restaurant exist already!");
    throw errors;
  }
  console.log(restaurantInput);

  const restaurant = new Restaurant({
    restaurantname: restaurantInput.restaurantname,
    restaurantcity: restaurantInput.restaurantcity,
    restaurantzip: restaurantInput.restaurantzip,
    restaurantstreet: restaurantInput.restaurantstreet,
    restaurantstreetnumber: restaurantInput.restaurantstreetnumber,
    restaurantdescription: restaurantInput.restaurantdescription,
    restaurantdescriptionshort: restaurantInput.restaurantdescriptionshort,
    restaurantMainImage: restaurantInput.restaurantMainImage,
    restaurantImage2: restaurantInput.restaurantImage2,
    restaurantImage3: restaurantInput.restaurantImage3,
    restaurantImage4: restaurantInput.restaurantImage4,
  });

  const createdRestaurant = await restaurant.save();
  return { ...createdRestaurant._doc, _id: createdRestaurant.id.toString() };
};

const viewRestaurant = async function ({ restaurantname }: any) {
  console.log("test");
  let restaurant: any;
  if (!restaurantname) {
    console.log("triggered");
    restaurant = await Restaurant.find({});
    console.log("check", restaurant);
  } else {
    restaurant = await Restaurant.find({ restaurantname: restaurantname });
    console.log(restaurant);
  }
  if (!restaurant) {
    const error = new Error("restaurant not found");
    error.code = 401;
    throw error;
  }
  console.log("restaurantarray", restaurant);
  return { restaurant: JSON.stringify(restaurant) };
};

const graphqlResolver = {
  login: loginUser,
  createUser: createUser,
  createRestaurant: createRestaurant,
  viewRestaurant: viewRestaurant,
};

export { graphqlResolver };
