import { gql } from 'apollo-server'

export default gql`
  scalar Upload
  type EditProfileResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    editProfile(
      password: String
      avatar: Upload
      name: String
      location: String
      githubUsername: String
    ): EditProfileResult!
  }
`
