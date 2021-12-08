import { createWriteStream } from 'fs'
import client from '../../client'
import { protectedResolver } from '../../users/users.utils'

export default {
  Mutation: {
    createCoffeeShop: protectedResolver(
      async (
        _,
        { name, latitude, longitude, photos, categories },
        { loggedInUser }
      ) => {
        try {
          let categoryObj = []
          categoryObj = categories.map((category: string) => {
            const categoryName = category.trim().toLowerCase()
            const categorySlug = categoryName.replace(/ /g, '-')
            return {
              where: { slug: categorySlug },
              create: { slug: categorySlug, name: categoryName },
            }
          })
          const coffeeShop = await client.coffeeShop.create({
            data: {
              name,
              longitude,
              latitude,
              user: { connect: { id: loggedInUser?.id } },
              categories: { connectOrCreate: categoryObj },
            },
          })
          photos.forEach(async (photo: any) => {
            if (photo && loggedInUser) {
              let photoURL = null
              const {
                file: { createReadStream, filename },
              } = await photo
              const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`
              const readStream = createReadStream()
              const writeStream = createWriteStream(
                process.cwd() + '/uploads/' + newFilename
              )
              readStream.pipe(writeStream)
              photoURL = `http://localhost:4000/static/${newFilename}`
              await client.coffeeShopPhoto.create({
                data: {
                  url: photoURL,
                  coffeeShop: { connect: { id: coffeeShop.id } },
                },
              })
            }
          })
          return { ok: true }
        } catch (e) {
          return { ok: false, error: 'Failed to Create CoffeeShop' }
        }
      }
    ),
  },
}
