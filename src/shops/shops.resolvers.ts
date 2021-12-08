import client from '../client'

export default {
  Category: {
    totalShops: async ({ id }: { id: number }) =>
      client.coffeeShop.count({ where: { categories: { some: { id } } } }),
  },
}
