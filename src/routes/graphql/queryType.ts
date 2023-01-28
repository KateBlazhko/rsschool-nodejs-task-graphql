import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { getMemberTypeById, getMemberTypes } from "../../actions/memberTypeAction";
import { getPostById, getPosts } from "../../actions/postActions";
import { getProfileById, getProfiles } from "../../actions/profileActons";
import { getAllDataAboutUser, getAllDataAboutUsers, getUserById, getUsers } from "../../actions/userActions";
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
      resolve: (_source, { id }, context: FastifyInstance) => getUserById(id, context),
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
      resolve: (_source, { id }, context: FastifyInstance) => getPostById(id, context),
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
      resolve: (_source, { id }, context: FastifyInstance) => getProfileById(id, context),
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
      resolve: (_source, { id }, context: FastifyInstance) => getMemberTypeById(id, context),
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (_source, _args, context: FastifyInstance) => getUsers(context),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (_source, _args, context: FastifyInstance) => getPosts(context),
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (_source, _args, context: FastifyInstance) => getProfiles(context),
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: (_source, _args, context: FastifyInstance) => getMemberTypes(context),
    },
    allDataAboutUsers: {
      type: new GraphQLList(AllDataAboutUserType),
      resolve: (_source, _args, context: FastifyInstance) => getAllDataAboutUsers(context),
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
      resolve: (_source, { id }, context: FastifyInstance) => getAllDataAboutUser(id, context),
    }
  }),
});