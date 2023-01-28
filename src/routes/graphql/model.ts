import { GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const EntityType = new GraphQLObjectType({
  name: 'Entity',
  fields: () => ({
    users: {
      type: UserType,

    },
    posts: {
      type: PostType,
    },
    profiles: {
      type: ProfileType,
    },
    memberTypeTypes: {
      type: MemberTypeType,
    },
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

export const UserDTOType = new GraphQLInputObjectType({
  name: 'UserDTO',
  fields: () => ({
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
  }),
});


export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const PostDTOType = new GraphQLInputObjectType({
  name: 'PostDTO',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});


export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const ProfileDTOType = new GraphQLInputObjectType({
  name: 'ProfileDTO',
  fields: () => ({
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
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    discount: {
      type: GraphQLFloat,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }),
});

export const MemberTypeDTOType = new GraphQLInputObjectType({
  name: 'MemberTypeDTO',
  fields: () => ({
    discount: {
      type: GraphQLFloat,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }),
});
