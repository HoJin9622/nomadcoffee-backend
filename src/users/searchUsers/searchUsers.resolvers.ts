import client from '../../client'

export default {
  Query: {
    searchUsers: async (_: any, { keyword }: { keyword: string }) =>
      client.user.findMany({
        where: { username: { startsWith: keyword.toLowerCase() } },
      }),
  },
}
