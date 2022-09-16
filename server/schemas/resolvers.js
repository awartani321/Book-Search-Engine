const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                try {
                    const user = await User.findOne({ _id: context.user._id });
                    
                    return user;
                } catch(e) {
                    throw new AuthenticationError('Invalid User'); 
                }
            }

            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            try {
                const user = await User.create(args);
                const token = signToken(user);

                return { token, user };
            } catch(e) {
                throw new UserInputError(e);
            }
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne( { email });
            if (!user) {
                throw new AuthenticationError("Can't find this user")
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError("Wrong password!")
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                try {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $addToSet: {savedBooks: book} },
                        { new: true, runValidators: true }
                    )

                    return updatedUser;
                } catch(e) {
                    throw new UserInputError(e);
                }
                
            }
            throw new AuthenticationError('You need to be logged in!')
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                try {
                    const updatedUser = await User.findOneAndUpdate(
                        {_id: context.user._id},
                        { $pull: { savedBooks: { bookId: bookId } } },
                        { new: true }
                    )
                    return updatedUser;
                } catch(e) {
                    throw new UserInputError(e);
                }
            }
        }
    }
};
  
module.exports = resolvers;