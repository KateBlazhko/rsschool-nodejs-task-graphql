import { FastifyInstance } from "fastify";
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
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
      resolve: (_source, { userDTO }, context: FastifyInstance) => createUser(userDTO, context),
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
      resolve: (_source, { postDTO }, context: FastifyInstance) => createPost(postDTO, context),
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
      resolve: (_source, { profileDTO }, context: FastifyInstance) => createProfile(profileDTO, context),
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
      resolve: (_source, { id, userDTO }, context: FastifyInstance) => updateUser(id, userDTO, context),
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
      resolve: (_source, { id, postDTO }, context: FastifyInstance) => updatePost(id, postDTO, context),
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
      resolve: (_source, { id, profileDTO }, context: FastifyInstance) => updateProfile(id, profileDTO, context),
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
      resolve: (_source, { id, memberTypeDTO }, context: FastifyInstance) => updateMemberType(id, memberTypeDTO, context),
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
      resolve:  (_source, { userId, subscribedId }, context: FastifyInstance) => userSubscribeTo(userId, subscribedId, context),
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
      resolve:  (_source, { userId, unsubscribedId }, context: FastifyInstance) => userUnsubscribeTo(userId, unsubscribedId, context),
    }
  }),
});