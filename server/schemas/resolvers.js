const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
// const bookSchema = require("../models/Book");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({_id: context.user._id}).select('-__v -password');
      }
      throw new AuthenticationError("Log In to Continue");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { newBook }, context) => {
      if (context.user) {
        try {
          return User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $push: { savedBooks: newBook },
            },
            {
              new: true,
            }
          )
        } catch(error) {
          console.log(error)
        }
      }
      throw new AuthenticationError("Log In to Continue");
    },

    removeBook: async (parent, {bookId}, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { savedBooks: {bookId} },
          },
          {
            new: true,
          }
        );
      }
      throw new AuthenticationError("Log In to Continue");
    },
  },
};

module.exports = resolvers;