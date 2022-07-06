import { buildSchema } from "graphql";

export default buildSchema(`
type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
}

type User {
    _id: ID
    name: String!
    email: String!
    password: String
    status: String
    posts: [Post!]
}

type Restaurant {
     _id: ID
     restaurantname: String!
    restaurantcity: String!
    restaurantzip: String!
    restaurantstreet: String!
    restaurantstreetnumber: String!
    restaurantdescription: String!
    restaurantdescriptionshort: String!
    restaurantMainImage: String
    restaurantImage2: String
    restaurantImage3: String
    restaurantImage4: String
}

type RestaurantArr {
    restaurant: String
}

type likeUnlikeOutput {
    _id: ID
    likedAmount: String
    likedBoolean: String
}

type AuthData {
    token: String!
    userId: String!
}

type commentOutput {
    user: String
    comment: String
    restaurantId: String
    _id: ID
    serverTimeStamp: String
}

input UserInputData {
    email: String!
    name: String!
    password: String!
}

input RestaurantInputData {
    restaurantname: String!
    restaurantcity: String!
    restaurantzip: String!
    restaurantstreet: String!
    restaurantstreetnumber: String!
    restaurantdescription: String!
    restaurantdescriptionshort: String!
    restaurantMainImage: String
    restaurantImage2: String
    restaurantImage3: String
    restaurantImage4: String
}

input likeUnlikeInputData {
    likeId: String!
    user: String!
}
input commentsInputData {
    user: String
    comment: String
    option: String 
    restaurantId: String
    _id: ID
    token: String
}



type RootMutation {
    createUser(userInput: UserInputData): User!
    createRestaurant(restaurantInput: RestaurantInputData): Restaurant!
    createlikeUnlike(likeUnlikeInput: likeUnlikeInputData): likeUnlikeOutput!
    createComments(commentsInput: commentsInputData): commentOutput
    
}



type rootQuery{
        login(email: String!, password:String!): AuthData!
        viewRestaurant(restaurantname: String ): RestaurantArr
        likesCheck(restaurantId: String, user: String): likeUnlikeOutput
        viewComments(user: String, restaurantId: String): commentOutput
    }

schema {
     query: rootQuery
  mutation: RootMutation
}

`);
