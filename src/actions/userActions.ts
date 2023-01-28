import { FastifyInstance } from "fastify"
import { MemberTypeEntity } from "../utils/DB/entities/DBMemberTypes"
import { PostEntity } from "../utils/DB/entities/DBPosts"
import { ProfileEntity } from "../utils/DB/entities/DBProfiles"
import { ChangeUserDTO, CreateUserDTO, UserEntity } from "../utils/DB/entities/DBUsers"

type UserExtantion = UserEntity & {
  userSubscribedTo: UserEntity[]
}

type AllDataAboutUserType = UserEntity & {
  subscribedToUser: UserExtantion[],
  posts: PostEntity[];
  profile: ProfileEntity | null;
  memberType: MemberTypeEntity | null;
  userSubscribedTo: UserExtantion[]
}

export const getUsers = async (context: FastifyInstance): Promise<UserEntity[]> => {
  return await context.db.users.findMany()
}

const gatherAllDataAboutUsers = async (user: UserEntity, context: FastifyInstance): Promise<AllDataAboutUserType> => {
  const profile = await context.db.profiles.findOne({key: 'userId', equals: user.id})

  const subscribedToUserIdsExt: UserExtantion[] = await Promise.all(user.subscribedToUserIds.map(async (id) => {
    const user = await getUserById(id, context)
    const userSubscribedTo = await context.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id})
    
    return {
      ...user,
      userSubscribedTo
    }
  }))

  const userSubscribedTo = await context.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id})
  const userSubscribedToExt: UserExtantion[] = await Promise.all(userSubscribedTo.map(async (user) => {
    const userSubscribedTo = await context.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id})
    
    return {
      ...user,
      userSubscribedTo
    }
  }))

  return {
    ...user,
    subscribedToUser: subscribedToUserIdsExt,
    posts: await context.db.posts.findMany({key: 'userId', equals: user.id}),
    profile,
    memberType: profile ? await context.db.memberTypes.findOne({key: 'id', equals: profile?.memberTypeId}) : null,
    userSubscribedTo: userSubscribedToExt
  }
}

export const getAllDataAboutUsers = async (context: FastifyInstance): Promise<AllDataAboutUserType[]> => {
  const users = await context.db.users.findMany()
  return await Promise.all(users.map(async (user) => {
    return await gatherAllDataAboutUsers(user, context)
  }))
}

export const getAllDataAboutUser = async (id: string, context: FastifyInstance): Promise<AllDataAboutUserType> => {
  const user = await getUserById(id, context)
  return await gatherAllDataAboutUsers(user, context)
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