import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ContextType } from ".";
import { getMemberTypes } from "../../actions/memberTypeAction";
import { getPostById, getPosts } from "../../actions/postActions";
import { getProfiles } from "../../actions/profileActons";
import { getAllDataAboutUser, getAllDataAboutUsers, getUsers } from "../../actions/userActions";
import { AllDataAboutUserType, MemberTypeType, PostType, ProfileType, UserType } from "./model";

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: UserType,
      args: {
        id: {
          description:
            'User Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, {usersLoader}: ContextType) => usersLoader.load(id),
    },
    post: {
      type: PostType,
      args: {
        id: {
          description:
            'Post Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, {fastify}: ContextType) => getPostById(id, fastify),
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          description:
            'Profile Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, {profilesLoader}: ContextType) => profilesLoader.load(id),
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: {
          description:
            'MemberType Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, {memberTypesLoader}: ContextType) => memberTypesLoader.load(id),
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (_source, _args, {fastify}: ContextType) => getUsers(fastify),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (_source, _args, {fastify}: ContextType) => getPosts(fastify),
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (_source, _args, {fastify}: ContextType) => getProfiles(fastify),
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: (_source, _args, {fastify}: ContextType) => getMemberTypes(fastify),
    },
    allDataAboutUsers: {
      type: new GraphQLList(AllDataAboutUserType),
      resolve: (_source, _args, context: ContextType) => getAllDataAboutUsers(context),
    },
    allDataAboutUser: {
      type: AllDataAboutUserType,
      args: {
        id: {
          description:
            'User Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context: ContextType) => getAllDataAboutUser(id, context),
    }
  }),
});