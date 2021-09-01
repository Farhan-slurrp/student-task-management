const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { typeDefs } = require("./schema");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation.js");

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

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: {
    User,
  },
});

// The `listen` method launches a web server.
server.listen({ port: 8001 }).then(({ url }) => {
  console.log(`Server ready at ${url}🚀`);
});
