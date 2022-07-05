import User from "../models/user";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Restaurant from "../models/restaurant";
import Likes from "../models/likes";
import Comments from "../models/comments";

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
  console.log("tvg", user);
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
    console.log("checkxl", restaurant);
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

const likeUnlike = async function ({ likeUnlikeInput }: any) {
  console.log("checkout", likeUnlikeInput.likeId);
  try {
    const countDocs = await Likes.countDocuments({
      likeId: likeUnlikeInput.likeId,
    });
    const checkLike = await Likes.findOne({
      user: likeUnlikeInput.user,
      likeId: likeUnlikeInput.likeId,
    });
    if (checkLike) {
      const countDocs = await Likes.countDocuments({
        likeId: likeUnlikeInput.likeId,
      });
      const validation = await Likes.deleteOne({
        user: likeUnlikeInput.user,
        likeId: likeUnlikeInput.likeId,
      });

      console.log(validation);
      return { likedBoolean: "false", likedAmount: countDocs - 1 };
    } else {
      const newLike = new Likes({
        _ID: likeUnlikeInput._ID,
        user: likeUnlikeInput.user,
        likeId: likeUnlikeInput.likeId,
      });
      try {
        const savedLike = await newLike.save();
        return {
          likedBoolean: "true",
          likedAmount: countDocs + 1,
        };
      } catch (error) {
        return { error: error };
      }
    }
  } catch (error) {
    return { error: error };
  }
};

const likesCheck = async function ({ restaurantId, user }: any) {
  console.log("blablatest", restaurantId, user);

  let checkLike: any = "";
  try {
    const countDocs = await Likes.countDocuments({
      likeId: restaurantId,
    });
    if (user) {
      checkLike = await Likes.find({
        user: user,
        likeId: restaurantId,
      });
    }
    let likeTrueFalse = false;
    console.log("blabel", checkLike.length);
    if (checkLike.length > 0) likeTrueFalse = true;
    return { likedBoolean: likeTrueFalse, likedAmount: countDocs.toString() };
  } catch (error) {
    return { error: error };
  }
};

const handleComments = async function ({ commentsInput }: any) {
  //Create Section
  if (commentsInput.option === "create") {
    let current = new Date();
    console.log(current.toString());
    const comment = new Comments({
      user: commentsInput.user,
      comment: commentsInput.comment,
      restaurantId: commentsInput.restaurantId,
      serverTimeStamp: current.toString(),
    });
    await comment.save();
  }
  //end of create section
  //modify section
  if (commentsInput.option === "edit") {
    const restaurantComment = await Comments.findById({
      _id: commentsInput._id,
    });
    restaurantComment.comment = commentsInput.comment;
    await restaurantComment.save();
  }
  //end of modify section
  //delete section
  if (commentsInput.option === "delete") {
    await Comments.deleteOne({
      _id: commentsInput._id,
    });
  }
  //end of delete section
};

const viewComments = async function ({ user, restaurantId }) {
  let viewCommentlist: any;
  console.log(user, restaurantId);
  if (!user && !restaurantId) {
    viewCommentlist = await Comments.find({});
    console.log("check", viewCommentlist);
  } else if (user && restaurantId) {
    viewCommentlist = await Comments.find({
      user: user,
      restaurantId: restaurantId,
    });
  } else if (user) {
    viewCommentlist = await Comments.find({
      user: user,
    });
    console.log("test");
  } else {
    viewCommentlist = await Comments.find({
      restaurantId: restaurantId,
    });
  }
  //console.log("viewCommentlist", viewCommentlist);
  return { user: JSON.stringify(viewCommentlist) };
};

const graphqlResolver = {
  login: loginUser,
  createUser: createUser,
  createRestaurant: createRestaurant,
  viewRestaurant: viewRestaurant,
  createlikeUnlike: likeUnlike,
  createComments: handleComments,
  viewComments: viewComments,
  likesCheck: likesCheck,
};

export { graphqlResolver };
