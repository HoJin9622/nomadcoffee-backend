import client from '../../client'

export default {
  Query: {
    seeCategory: async (_: any, { page, id }: { page: number; id: number }) =>
      client.category.findUnique({
        where: { id },
        include: { shops: { take: 5, skip: (page - 1) * 5 } },
      }),
  },
}
