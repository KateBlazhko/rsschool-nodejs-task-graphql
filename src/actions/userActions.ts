import { FastifyInstance } from "fastify"
import { ContextType } from "../routes/graphql"
import { MemberTypeEntity } from "../utils/DB/entities/DBMemberTypes"
import { PostEntity } from "../utils/DB/entities/DBPosts"
import { ProfileEntity } from "../utils/DB/entities/DBProfiles"
import { ChangeUserDTO, CreateUserDTO, UserEntity } from "../utils/DB/entities/DBUsers"

type UserExtantion = UserEntity & {
  userSubscribedTo: UserEntity[]
  subscribedToUser: UserEntity[]
}

type UserWithSubscribesType = UserEntity & {
  userSubscribedTo?: UserWithSubscribesType[]
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

const gatherAllDataAboutUser = async (user: UserEntity, {
  fastify, 
  userSubscribedToLoader, 
  usersLoader, 
  memberTypesLoader,
  profilesLoader
}: ContextType): Promise<AllDataAboutUserType> => {
  const profile = await profilesLoader.load(user.id)
  // const profile = await fastify.db.profiles.findOne({key: 'userId', equals: user.id})

  const memberType = profile && await memberTypesLoader.load(profile?.memberTypeId)
  // const memberType = await fastify.db.memberTypes.findOne({key: 'id', equals: user.id})


  const subscribedToUserIdsExt: UserExtantion[] = await Promise.all(user.subscribedToUserIds.map(async (id) => {
    const user = await usersLoader.load(id)
    // const user = await getUserById(id, context)
    
    const userSubscribedTo = await userSubscribedToLoader.load(user.id)
    // const userSubscribedTo = await context.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id})
    
    return {
      ...user,
      subscribedToUser: await Promise.all(user.subscribedToUserIds.map(async (id) => {
        return await usersLoader.load(id)
        // return await getUserById(id, context)
      })),
      userSubscribedTo
    }
  }))

  const userSubscribedTo = await userSubscribedToLoader.load(user.id)
  // const userSubscribedTo = await context.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id})
  const userSubscribedToExt: UserExtantion[] = await Promise.all(userSubscribedTo.map(async (user) => {
    const userSubscribedTo = await userSubscribedToLoader.load(user.id)
    // const userSubscribedTo = await context.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id})
    
    return {
      ...user,
      subscribedToUser: await Promise.all(user.subscribedToUserIds.map(async (id) => {
        return await usersLoader.load(id)
        // return await getUserById(id, context)
      })),
      userSubscribedTo
    }
  }))

  return {
    ...user,
    subscribedToUser: subscribedToUserIdsExt,
    posts: await fastify.db.posts.findMany({key: 'userId', equals: user.id}),
    profile,
    memberType: memberType ? memberType: null,
    userSubscribedTo: userSubscribedToExt
  }
}

export const getAllDataAboutUsers = async (context: ContextType): Promise<AllDataAboutUserType[]> => {
  const users = await context.fastify.db.users.findMany()
  return await Promise.all(users.map(async (user) => {

    context.usersLoader.prime(user.id, user)

    return await gatherAllDataAboutUser(user, context)
  }))
}

export const getAllDataAboutUser = async (id: string, context: ContextType): Promise<AllDataAboutUserType> => {
  // const user = await getUserById(id, context)
  const user = await context.usersLoader.load(id)

  return await gatherAllDataAboutUser(user, context)
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

const MAXDEPTH = 6
export const getSubscribes = async (context: ContextType) => {
  const users = await context.fastify.db.users.findMany()
  users.forEach((user) => context.usersLoader.prime(user.id, user))

  const result =  await gatherSubscribes(context, users)
  console.log(result)
  return result
}

export const gatherSubscribes = async (context: ContextType, users: UserEntity[], i: number = 0): Promise<UserWithSubscribesType[]> => {
  if (i > MAXDEPTH) {
    return users
  }

  return await Promise.all(users.map(async (user) => {

    const userSubscribedTo = await context.userSubscribedToLoader.load(user.id)

    return {
      ...user,
      userSubscribedTo: await gatherSubscribes(context, userSubscribedTo, i++)
    }
  }))

}