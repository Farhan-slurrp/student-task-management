const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { typeDefs } = require("./schema");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation.js");
const User = require("./resolvers/User");
const TaskSection = require("./resolvers/TaskSection");
const NoteSection = require("./resolvers/NoteSection");
const Room = require("./resolvers/Room");

require("dotenv").config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserModel = require("./models/UserSchema");
const TaskSectionModel = require("./models/TaskSectionSchema");
const PersonalTaskModel = require("./models/PersonalTaskSchema");
const NoteSectionModel = require("./models/NoteSectionSchema");
const PersonalNoteModel = require("./models/PersonalNoteSchema");
const RoomModel = require("./models/RoomSchema");

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
    User,
    Room,
    TaskSection,
    NoteSection,
  },
  context: {
    UserModel,
    TaskSectionModel,
    PersonalTaskModel,
    NoteSectionModel,
    PersonalNoteModel,
    RoomModel,
  },
});

// The `listen` method launches a web server.
server.listen({ port: 8001 }).then(({ url }) => {
  console.log(`Server ready at ${url}🚀`);
});
