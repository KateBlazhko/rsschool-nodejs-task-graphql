import { GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

const userDTO = {
  firstName: {
    type: GraphQLString,
  },
  lastName: {
    type: GraphQLString,
  },
  email: {
    type: GraphQLString,
  },
};

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...userDTO,
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

export const UserWithUserSubscribedToType:GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'UserWithUserSubscribedTo',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...userDTO,
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserWithUserSubscribedToType)
    },
  }),
});

export const UserTypeExt = new GraphQLObjectType({
  name: 'UserExt',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...userDTO,
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
    },
  }),
});

export const UserCreateType = new GraphQLInputObjectType({
  name: 'UserCreate',
  fields: () => ({
    ...userDTO
  }),
});

export const UserChangeType = new GraphQLInputObjectType({
  name: 'UserChange',
  fields: () => ({
    ...userDTO,
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

const postDTO = {
  title: {
    type: GraphQLString,
  },
  content: {
    type: GraphQLString,
  },
}

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...postDTO,
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const PostCreateType = new GraphQLInputObjectType({
  name: 'PostCreate',
  fields: () => ({
    ...postDTO, 
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const PostChangeType = new GraphQLInputObjectType({
  name: 'PostChange',
  fields: () => ({
    ...postDTO, 
  }),
});

const profileDTO = {
  avatar: {
    type: GraphQLString,
  },
  sex: {
    type: GraphQLString,
  },
  birthday: {
    type: GraphQLInt,
  },
  country: {
    type: GraphQLString,
  },
  street: {
    type: GraphQLString,
  },
  city: {
    type: GraphQLString,
  },
  memberTypeId: {
    type: new GraphQLNonNull(GraphQLString),
  },
}

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...profileDTO,
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const ProfileCreateType = new GraphQLInputObjectType({
  name: 'ProfileCreate',
  fields: () => ({
    ...profileDTO,
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const ProfileChangeType = new GraphQLInputObjectType({
  name: 'ProfileChange',
  fields: () => ({
    ...profileDTO,
  }),
});

const memberTypeDTO = {
  discount: {
    type: GraphQLFloat,
  },
  monthPostsLimit: {
    type: GraphQLInt,
  },
}

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...memberTypeDTO
  }),
});

export const MemberTypeChangeType = new GraphQLInputObjectType({
  name: 'MemberTypeChange',
  fields: () => ({
    ...memberTypeDTO
  }),
});

export const AllDataAboutUserType = new GraphQLObjectType({
  name: 'AllDataAboutUser',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...userDTO,
    subscribedToUser: {
      type: new GraphQLList(UserTypeExt),
    },
    posts: {type: new GraphQLList(PostType)},
    profile: {type: ProfileType},
    memberType: {type: MemberTypeType},
    userSubscribedTo: {type: new GraphQLList(UserTypeExt)}
  }),
});
