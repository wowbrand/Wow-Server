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
}

type RestaurantArr {
    restaurant: String
}

type AuthData {
    token: String!
    userId: String!
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
}

type RootMutation {
    createUser(userInput: UserInputData): User!
    createRestaurant(restaurantInput: RestaurantInputData): Restaurant!
}

type rootQuery{
        login(email: String!, password:String!): AuthData!
        viewRestaurant(restaurantname: String ): RestaurantArr
    }

schema {
     query: rootQuery
  mutation: RootMutation
}

`);
