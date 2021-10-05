const { withFilter } = require("graphql-subscriptions");
const pubsub = require("../utils/pubsub");

const Subscription = {
  roomTaskCreated: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(["ROOM_TASK_CREATED"]),
      (payload, variables) => {
        // Only push an update if the comment is on
        // the correct repository for this operation
        return payload.roomTaskCreated.roomId === variables.roomId;
      }
    ),
  },
};

module.exports = Subscription;
