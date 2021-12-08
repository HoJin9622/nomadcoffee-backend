import client from '../../client'

export default {
  Query: {
    seeCoffeeShop: async (_: any, { id }: { id: number }) =>
      client.coffeeShop.findUnique({
        where: { id },
        include: { photos: true, user: true },
      }),
  },
}
