const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
const pubsub = require("./utils/pubsub");
const { typeDefs } = require("./schema");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation.js");
const User = require("./resolvers/User");
const TaskSection = require("./resolvers/TaskSection");
const NoteSection = require("./resolvers/NoteSection");
const Room = require("./resolvers/Room");
const RoomTask = require("./resolvers/RoomTask");
const RoomNote = require("./resolvers/RoomNote");
const Subscription = require("./resolvers/Subscription");

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
const RoomTaskModel = require("./models/RoomTaskSchema");
const RoomNoteModel = require("./models/RoomNoteSchema");

db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to database");
});

(async function () {
  const app = express();
  app.use(cors);

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      User,
      Room,
      TaskSection,
      NoteSection,
      RoomTask,
      RoomNote,
      Subscription,
    },
  });

  const server = new ApolloServer({
    schema,
    context: {
      UserModel,
      TaskSectionModel,
      PersonalTaskModel,
      NoteSectionModel,
      PersonalNoteModel,
      RoomModel,
      RoomTaskModel,
      RoomNoteModel,
      pubsub,
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 8001;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
