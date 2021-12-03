import { Resolvers } from '../../type'

const resolvers: Resolvers = {
  Query: {
    seeProfile: (_: any, { username }: { username: string }, { client }) =>
      client.user.findUnique({ where: { username } }),
  },
}

export default resolvers
