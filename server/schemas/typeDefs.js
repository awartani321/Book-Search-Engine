const { gql } = require('apollo-server-express');

// typeDefs
const typeDefs = gql`
    type Book {
        _id: ID
        bookId: String
        authors: [String]
        description: String        
        title: String
        image: String        
        link: String
    }
    
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]        
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }
  
    input SaveBookInput {
        authors: [String]
        description: String
        bookId: String
        title: String
        image: String        
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: SaveBookInput): User
        removeBook(bookId: String!): User
    }
`;

// export the typeDefs
module.exports = typeDefs;