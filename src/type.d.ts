import { PrismaClient, User } from '.prisma/client'

export interface ICreateAccountInput {
  username: string
  email: string
  name: string
  location: string
  githubUsername: string
  password: string
}
export interface ILoginInput {
  username: string
  password: string
}

export interface IEditProfileInput {
  avatar: any
  password: string
  name: string
  location: string
  githubUsername: string
}

export interface ISeeFollowersInput {
  username: string
  page: number
}

export interface ISeeFollowingInput {
  username: string
  lastId: number
}

type Context = {
  loggedInUser?: User
  client: PrismaClient
}

export type Resolver = (
  root: any,
  args: any,
  context: Context,
  info: any
) => any

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver
  }
}
