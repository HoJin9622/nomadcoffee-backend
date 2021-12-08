import client from '../../client'

export default {
  Query: {
    seeCoffeeShops: async (_: any, { page }: { page: number }) =>
      client.coffeeShop.findMany({
        take: 5,
        skip: (page - 1) * 5,
        include: { photos: true, user: true },
      }),
  },
}
