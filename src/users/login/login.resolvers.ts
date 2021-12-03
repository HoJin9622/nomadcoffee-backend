import client from '../../client'
import { ILoginInput } from '../../type'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default {
  Mutation: {
    login: async (_: any, { username, password }: ILoginInput) => {
      try {
        const user = await client.user.findFirst({ where: { username } })
        if (!user) {
          return { ok: false, error: 'User not found.' }
        }
        const passwordOk = await bcrypt.compare(password, user.password)
        if (!passwordOk) {
          return { ok: false, error: 'Incorrect password.' }
        }
        if (!process.env.SECRET_KEY) {
          return { ok: false, error: 'Server Error' }
        }
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY)
        return { ok: true, token }
      } catch (error) {
        return { ok: false, error }
      }
    },
  },
}
