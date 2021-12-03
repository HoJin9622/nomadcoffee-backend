import jwt from 'jsonwebtoken'
import client from '../client'
import { Resolver } from '../type'

export const getUser = async (token: string) => {
  try {
    if (!token) {
      return null
    }
    if (!process.env.SECRET_KEY) {
      return null
    }
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY)
    if ('id' in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken['id'] },
      })
      if (user) {
        return user
      }
    }
    return null
  } catch {
    return null
  }
}

// @ts-ignore
export function protectedResolver(ourResolver: Resolver) {
  // @ts-ignore
  return function (root, args, context, info) {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: 'Please log in to perform this action.',
      }
    }
    return ourResolver(root, args, context, info)
  }
}
