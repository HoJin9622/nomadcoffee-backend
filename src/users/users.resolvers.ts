import { User } from '.prisma/client'
import client from '../client'

export default {
  User: {
    following: async ({ id }: { id: number }, { page }: { page: number }) =>
      await client.user
        .findUnique({ where: { id } })
        .following({ take: 5, skip: (page - 1) * 5 }),
    followers: ({ id }: { id: number }, { page }: { page: number }) =>
      client.user
        .findUnique({ where: { id } })
        .followers({ take: 5, skip: (page - 1) * 5 }),
    totalFollowing: ({ id }: { id: number }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    totalFollowers: ({ id }: { id: number }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    isMe: (
      { id }: { id: number },
      _: any,
      { loggedInUser }: { loggedInUser: User }
    ) => {
      if (!loggedInUser) {
        return false
      }
      return id === loggedInUser.id
    },
    isFollowing: async (
      { id }: { id: number },
      _: any,
      { loggedInUser }: { loggedInUser: User }
    ) => {
      if (!loggedInUser) {
        return false
      }
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: { some: { id } },
        },
      })
      return Boolean(exists)
    },
  },
}
