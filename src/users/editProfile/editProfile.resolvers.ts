import { IEditProfileInput } from '../../type'
import bcrypt from 'bcrypt'
import { protectedResolver } from '../users.utils'
import { PrismaClient, User } from '.prisma/client'
import { createWriteStream } from 'fs'

const resolveFn = async (
  _: any,
  {
    password: newPassword,
    avatar,
    name,
    location,
    githubUsername,
  }: IEditProfileInput,
  { loggedInUser, client }: { loggedInUser?: User; client: PrismaClient }
) => {
  let avatarURL = null
  if (avatar && loggedInUser) {
    const {
      file: { createReadStream, filename },
    } = await avatar
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`
    const readStream = createReadStream()
    const writeStream = createWriteStream(
      process.cwd() + '/uploads/' + newFilename
    )
    readStream.pipe(writeStream)
    avatarURL = `http://localhost:4000/static/${newFilename}`
  }
  let uglyPassword = null
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10)
  }
  if (!loggedInUser) {
    return { ok: false, error: 'You are not Logged In.' }
  }
  const updatedUser = await client.user.update({
    where: { id: loggedInUser.id },
    data: {
      ...(avatarURL && { avatarURL }),
      ...(uglyPassword && { password: uglyPassword }),
      name,
      location,
      githubUsername,
    },
  })
  if (updatedUser.id) {
    return { ok: true }
  } else {
    return { ok: false, error: 'Could not update profile.' }
  }
}

export default {
  Mutation: {
    editProfile: protectedResolver(resolveFn),
  },
}
