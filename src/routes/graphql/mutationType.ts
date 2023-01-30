import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ContextType } from ".";
import { updateMemberType } from "../../actions/memberTypeAction";
import { createPost, updatePost } from "../../actions/postActions";
import { createProfile, updateProfile } from "../../actions/profileActons";
import { createUser, updateUser, userSubscribeTo, userUnsubscribeTo } from "../../actions/userActions";
import { MemberTypeChangeType, MemberTypeType, PostChangeType, PostCreateType, PostType, ProfileChangeType, ProfileCreateType, ProfileType, UserChangeType, UserCreateType, UserType } from "./model";

export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        userDTO: {
          description:
            'firstName, lastName, email of User',
          type: UserCreateType,
        },
      },
      resolve: (_source, { userDTO }, {fastify}: ContextType) => createUser(userDTO, fastify),
    },
    createPost: {
      type: PostType,
      args: {
        postDTO: {
          description:
            'title, content, userId of Post',
          type: PostCreateType,
        },
      },
      resolve: (_source, { postDTO }, {fastify}: ContextType) => createPost(postDTO, fastify),
    },
    createProfile: {
      type: ProfileType,
      args: {
        profileDTO: {
          description:
            'avatar, sex, birthday, country, street, city, memberTypeId, userId of Profile',
          type: ProfileCreateType,
        },
      },
      resolve: (_source, { profileDTO }, {fastify}: ContextType) => createProfile(profileDTO, fastify),
    },
    updateUser: {
      type: UserType,
      args: {
        userDTO: {
          description:
            'firstName, lastName, email, subscribedToUserIds of User',
          type: UserChangeType,
        },
        id: {
          description:
            'User Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id, userDTO }, {fastify}: ContextType) => updateUser(id, userDTO, fastify),
    },
    updatePost: {
      type: PostType,
      args: {
        postDTO: {
          description:
            'title, content, userId of Post',
          type: PostChangeType,
        },
        id: {
          description:
            'Post Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id, postDTO }, {fastify}: ContextType) => updatePost(id, postDTO, fastify),
    },
    updateProfile: {
      type: ProfileType,
      args: {
        profileDTO: {
          description:
            'avatar, sex, birthday, country, street, city, memberTypeId, userId of Profile',
          type: ProfileChangeType,
        },
        id: {
          description:
            'Profile Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id, profileDTO }, {fastify}: ContextType) => updateProfile(id, profileDTO, fastify),
    },
    updateMemberType: {
      type: MemberTypeType,
      args: {
        memberTypeDTO: {
          description: 
            'discount, monthPostsLimit of MemberType',
          type: MemberTypeChangeType,
        },
        id: {
          description:
            'MemberType Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id, memberTypeDTO }, {fastify}: ContextType) => updateMemberType(id, memberTypeDTO, fastify),
    },
    subscribeUser: {
      type: UserType,
      args: {
        userId: {
          description:
            'User Id',
          type: new GraphQLNonNull(GraphQLString),
        },
        subscribedId: {
          description:
            'Subscribed user Id',
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve:  (_source, { userId, subscribedId }, {fastify}: ContextType) => userSubscribeTo(userId, subscribedId, fastify),
    },
    unsubscribeUser: {
      type: UserType,
      args: {
        userId: {
          description:
            'User Id',
          type: new GraphQLNonNull(GraphQLString),
        },
        unsubscribedId: {
          description:
            'Unsubscribed user Id',
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve:  (_source, { userId, unsubscribedId }, {fastify}: ContextType) => userUnsubscribeTo(userId, unsubscribedId, fastify),
    }
  }),
});