import { createServer } from "node:http";
import { setTimeout as setTimeout$ } from "node:timers/promises";
import { createSchema, createYoga, createPubSub } from "graphql-yoga";
import { GraphQLError } from "graphql";

const pubSub = createPubSub();

const chatRooms = new Map();

const err = (message) => new GraphQLError(message);

// Provide your schema
const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String
        getChatRooms: [String!]!
        getChat(room: String!): [String!]!
      }

      type Subscription {
        countdown(from: Int!): Int!
        chatRoom(room: String!): String!
      }

      type Mutation {
        sendMessage(room: String!, message: String!): String!
        createChatRoom(room: String!): String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => "world",
        getChatRooms: () => Array.from(chatRooms.keys()),
        getChat: (_, { room }) => {
          if (!chatRooms.has(room)) {
            return err(`Chat room ${room} does not exist!`);
          }
          return chatRooms.get(room);
        },
      },
      Subscription: {
        countdown: {
          // This will return the value on every 1 sec until it reaches 0
          subscribe: async function* (_, { from }) {
            for (let i = from; i >= 0; i--) {
              await setTimeout$(1000);
              yield { countdown: i };
            }
          },
        },
        chatRoom: {
          subscribe: (_, { room }) => {
            if (!chatRooms.has(room)) {
              return err(`Chat room ${room} does not exist!`);
            }

            return pubSub.subscribe(`chatRoom:${room}`);
          },
          resolve: (payload) => payload.chatRoom,
        },
      },
      Mutation: {
        sendMessage: (_, { room, message }) => {
          if (!chatRooms.has(room)) {
            return err(`Chat room ${room} does not exist!`);
          }

          const payload = { chatRoom: message };
          pubSub.publish(`chatRoom:${room}`, payload);
          chatRooms.get(room).push(message);
          return payload.chatRoom;
        },
        createChatRoom: (_, { room }) => {
          if (chatRooms.has(room)) {
            return err(`Chat room ${room} already exists!`);
          }

          chatRooms.set(room, []);
          const payload = { chatRoom: `Chat room ${room} created!` };
          pubSub.publish(`chatRoom:${room}`, payload);
          return room;
        },
      },
    },
  }),
});

const server = createServer(yoga);
server.listen(4001, () => {
  console.info("Server is running on http://localhost:4001/graphql");
});
