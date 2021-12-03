require('dotenv').config()
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { graphqlUploadExpress } from 'graphql-upload'
import client from './client'
import { resolvers, typeDefs } from './schema'
import { getUser } from './users/users.utils'
import logger from 'morgan'

const PORT = process.env.PORT

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        // @ts-ignore
        loggedInUser: await getUser(req.headers.token),
        client,
      }
    },
  })

  await server.start()
  const app = express()
  app.use(graphqlUploadExpress())
  app.use(logger('tiny'))
  server.applyMiddleware({ app })
  app.use('/static', express.static('uploads'))
  // @ts-ignore
  await new Promise((func) => app.listen({ port: PORT }, func))
  console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`)
}
startServer()
