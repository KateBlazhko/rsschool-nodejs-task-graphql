import { FastifyInstance } from "fastify"
import { ChangeUserDTO, CreateUserDTO, UserEntity } from "../utils/DB/entities/DBUsers"

export const getUsers = async (context: FastifyInstance): Promise<UserEntity[]> => {
  return await context.db.users.findMany()
}

export const getUserById = async (id: string, context: FastifyInstance): Promise<UserEntity> => {
  const founded = await context.db.users.findOne({key: 'id', equals: id})

      if (!founded) throw context.httpErrors.notFound()

      return founded
}

export const createUser = async (userDTO: CreateUserDTO, context: FastifyInstance): Promise<UserEntity> => {
  return await context.db.users.create(userDTO)
}

export const deleteUser = async (id: string, context: FastifyInstance): Promise<UserEntity> => {
  const founded = await context.db.users.findOne({key: 'id', equals: id})
      if (!founded) throw context.httpErrors.badRequest()

      const posts = await context.db.posts.findMany({key: 'userId', equals: id})
      await Promise.all(posts.map(async (post) => {
        await context.db.posts.delete(post.id)
      }))

      const profile = await context.db.profiles.findOne({key: 'userId', equals: id})
      profile && await context.db.profiles.delete(profile.id)

      const users = await context.db.users.findMany({key: 'subscribedToUserIds', inArray: id})
      await Promise.all(users.map(async (user) => {
        const {id: userId, ...changeDTO} = user

          const newSubscribedToUserIds = changeDTO.subscribedToUserIds.filter(userId => userId !== id)

          return await context.db.users.change(user.id, {...changeDTO, subscribedToUserIds: newSubscribedToUserIds})
      }))

      return await context.db.users.delete(id)
}

export const userSubscribeTo = async (userId: string, subscribedId: string, context: FastifyInstance): Promise<UserEntity> => {
  const founded = await context.db.users.findOne({key: 'id', equals: subscribedId})

      if (!founded) throw context.httpErrors.badRequest()

      founded.subscribedToUserIds.push(userId)

      const {id, ...changeDTO} = founded
      return await context.db.users.change(subscribedId, changeDTO)
}

export const userUnsubscribeTo = async (userId: string, unsubscribedId: string, context: FastifyInstance): Promise<UserEntity> => {
  const founded = await context.db.users.findOne({key: 'id', equals: unsubscribedId})

  if (!founded) throw context.httpErrors.badRequest()
  if (!founded.subscribedToUserIds.includes(userId)) throw context.httpErrors.badRequest()
  
  const newSubscribedToUserIds = founded.subscribedToUserIds.filter(id => id !== userId)

  const {id, ...changeDTO} = founded
  return await context.db.users.change(unsubscribedId, {...changeDTO, subscribedToUserIds: newSubscribedToUserIds})

}

export const updateUser = async (id: string, userDTO: ChangeUserDTO, context: FastifyInstance): Promise<UserEntity> => {
  const founded = await context.db.users.findOne({key: 'id', equals: id})

  if (!founded) throw context.httpErrors.badRequest()

  return await context.db.users.change(id, userDTO)
}