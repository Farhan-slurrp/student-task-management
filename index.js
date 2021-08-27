const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require("./models/UserSchema");

db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to database");
});

const typeDefs = gql`
  scalar Date

  type Event {
    title: String
    date: Date
  }

  type User {
    email: String
    fullname: String
    profPict: String
    events: [Event]
  }

  type Query {
    users: [User]
    user(email: String): User
  }

  type Mutation {
    addUser(email: String!, fullname: String!, profPict: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();
      return users.map((user) => ({
        email: user.email,
        fullname: user.name,
        profPict: user.profPict,
        events: user.events,
      }));
    },
    user: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) return null;
      return {
        email: user.email,
        fullname: user.name,
        profPict: user.profPict,
        events: user.events,
      };
    },
  },

  Mutation: {
    addUser: async (_, { email, fullname, profPict }) => {
      const newUser = new User({
        email,
        name: fullname,
        profPict,
      });

      const success = await newUser.save();
      if (success) return true;
      return false;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
