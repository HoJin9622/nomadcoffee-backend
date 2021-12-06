import { gql } from 'apollo-server'

export default gql`
  type User {
    id: String!
    username: String!
    email: String!
    name: String!
    location: String!
    avatarURL: String!
    githubUsername: String!
    createdAt: String!
    updatedAt: String!
    following(page: Int!): [User]
    followers(page: Int!): [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
  }
`
