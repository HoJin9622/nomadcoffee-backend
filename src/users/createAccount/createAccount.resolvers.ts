import client from '../../client'
import { ICreateAccountInput } from '../../type'
import bcrypt from 'bcrypt'

export default {
  Mutation: {
    createAccount: async (
      _: any,
      {
        username,
        email,
        name,
        location,
        avatarURL,
        githubUsername,
        password,
      }: ICreateAccountInput
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        })
        if (existingUser) {
          return {
            ok: false,
            error: 'This username/password is already taken.',
          }
        }
        const uglyPassword = await bcrypt.hash(password, 10)
        await client.user.create({
          data: {
            username,
            email,
            name,
            location,
            password: uglyPassword,
            avatarURL,
            githubUsername,
          },
        })
        return { ok: true }
      } catch (error) {
        return { ok: false, error }
      }
    },
  },
}
