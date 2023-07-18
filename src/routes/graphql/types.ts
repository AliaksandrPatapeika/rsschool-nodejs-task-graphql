import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import {
  getAuthorFromPost,
  getMemberTypeFromProfile,
  getPostFromUser,
  getProfileFromUser,
  getProfilesFromMemberType,
  getSubscribedToUser,
  getUserFromProfile,
  getUserSubscribedTo,
} from './resolvers.js';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});
export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: ProfileType,
      resolve: getProfileFromUser,
    },
    posts: {
      type: PostsType,
      resolve: getPostFromUser,
    },
    subscribedToUser: {
      type: UsersType,
      resolve: getSubscribedToUser,
    },
    userSubscribedTo: {
      type: UsersType,
      resolve: getUserSubscribedTo,
    },
  }),
});

export const UsersType = new GraphQLNonNull(
  new GraphQLList(new GraphQLNonNull(UserType)),
);

export const PostType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    authorId: {
      type: UUIDType,
    },
    author: {
      type: UserType,
      resolve: getAuthorFromPost,
    },
  }),
});

export const PostsType = new GraphQLNonNull(
  new GraphQLList(new GraphQLNonNull(PostType)),
);

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    userId: {
      type: UUIDType,
    },
    user: {
      type: UserType,
      resolve: getUserFromProfile,
    },
    memberTypeId: {
      type: memberTypeId,
    },
    memberType: {
      type: MemberTypeType,
      resolve: getMemberTypeFromProfile,
    },
  }),
});

export const ProfilesType = new GraphQLNonNull(
  new GraphQLList(new GraphQLNonNull(ProfileType)),
);

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: memberTypeId,
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
    },
    profiles: {
      type: ProfilesType,
      resolve: getProfilesFromMemberType,
    },
  }),
});

export const MemberTypesType = new GraphQLNonNull(
  new GraphQLList(new GraphQLNonNull(MemberTypeType)),
);