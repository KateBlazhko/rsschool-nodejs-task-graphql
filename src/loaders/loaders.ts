import DataLoader = require("dataloader");
import { FastifyInstance } from "fastify";
import { getMemberTypeById} from "../actions/memberTypeAction";
import { getPostById } from "../actions/postActions";
import { getProfiles } from "../actions/profileActons";
import { getUserById, getUsers } from "../actions/userActions";
import { UserEntity } from "../utils/DB/entities/DBUsers";

const batchGetUsers = async (ids: readonly string[], context: FastifyInstance) => {
  // const users = await getUsers(context)
  const users = await Promise.all(ids.map(async (id) => await getUserById(id, context)))

  const dataMap: Record<string, UserEntity> = users.reduce((acc, user) => {
    return {
      ...acc,
      [user.id]: user
    };
  }, {});
  return ids.map((id) => dataMap[id]);
}

const batchGetUserSubscribedTo = async (ids: readonly string[], context: FastifyInstance) => {
  const users = await getUsers(context)
  
  const dataMap: Record<string, UserEntity[]> = ids.reduce((acc, id) => {
    return {
      ...acc,
      [id]: users.filter((user) => {
        if (user.subscribedToUserIds.some((item) => item === id)) return user;
      })
    };
  }, {});

  return ids.map((id) => dataMap[id]);
}

const batchGetMemberTypes = async (ids: readonly string[], context: FastifyInstance) => {
  // const memberTypes = await getMemberTypes(context)
  const memberTypes = await Promise.all(ids.map(async (id) => await getMemberTypeById(id, context)))

  const dataMap: Record<string, UserEntity[]> = memberTypes.reduce((acc, memberType) => {
    return {
      ...acc,
      [memberType.id]: memberType
    };
  }, {});

  return ids.map((id) => dataMap[id]);
}

const batchGetProfiles = async (ids: readonly string[], context: FastifyInstance) => {
  // const profiles = await Promise.all(ids.map(async (id) => await getProfileById(id, context)))
  const profiles = await getProfiles(context)

  const dataMap: Record<string, UserEntity[]> = profiles.reduce((acc, profile) => {
    return {
      ...acc,
      [profile.id]: profile
    };
  }, {});

  return ids.map((id) => dataMap[id]);
}

const batchGetPosts = async (ids: readonly string[], context: FastifyInstance) => {
  const posts = await Promise.all(ids.map(async (id) => await getPostById(id, context)))
  // const posts = await getPosts(context)

  const dataMap: Record<string, UserEntity[]> = posts.reduce((acc, post) => {
    return {
      ...acc,
      [post.id]: post
    };
  }, {});

  return ids.map((id) => dataMap[id]);
}

export const createLoaders = (context: FastifyInstance) => {
  return {
    usersLoader: new DataLoader( async (ids: readonly string[]) => batchGetUsers(ids, context)),
    userSubscribedToLoader: new DataLoader( async (ids: readonly string[]) => batchGetUserSubscribedTo(ids, context)),
    memberTypesLoader: new DataLoader( async (ids: readonly string[]) => batchGetMemberTypes(ids, context)),
    profilesLoader: new DataLoader( async (ids: readonly string[]) => batchGetProfiles(ids, context)),
    postsLoader: new DataLoader( async (ids: readonly string[]) => batchGetPosts(ids, context)),
  }
}
