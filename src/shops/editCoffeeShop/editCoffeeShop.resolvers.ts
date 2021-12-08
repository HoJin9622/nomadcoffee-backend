import client from '../../client'
import { protectedResolver } from '../../users/users.utils'

export default {
  Mutation: {
    editCoffeeShop: protectedResolver(
      async (
        _,
        { id, name, latitude, longitude, categories },
        { loggedInUser }
      ) => {
        try {
          let categoryObj = []
          if (categories) {
            categoryObj = categories.map((category: string) => {
              const categoryName = category.trim().toLowerCase()
              const categorySlug = categoryName.replace(/ /g, '-')
              return {
                where: { slug: categorySlug },
                create: { slug: categorySlug, name: categoryName },
              }
            })
          }
          const coffeeShop = await client.coffeeShop.findFirst({
            where: { id },
            include: { categories: { select: { id: true } } },
          })
          if (!coffeeShop) {
            return { ok: false, error: 'Not Found CoffeeShop' }
          }
          if (coffeeShop.userId !== loggedInUser?.id) {
            return { ok: false, error: 'Not your cofffee shop' }
          }
          const updatedCoffeeShop = await client.coffeeShop.update({
            where: { id: coffeeShop.id },
            data: {
              name,
              latitude,
              longitude,
              ...(categories && {
                categories: {
                  disconnect: coffeeShop.categories,
                  connectOrCreate: categoryObj,
                },
              }),
            },
          })
          if (updatedCoffeeShop.id) {
            return { ok: true }
          }
        } catch (e) {
          console.log(e)
          return { ok: false, error: 'Could not update coffee shop' }
        }
      }
    ),
  },
}
