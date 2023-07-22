import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import {
  getAuthorFromPost,
  getMemberTypeFromProfile,
  getPostsFromUser,
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
      resolve: getPostsFromUser,
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

export const UsersType = new GraphQLList(UserType);

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

export const PostsType = new GraphQLList(PostType);

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

export const ProfilesType = new GraphQLList(ProfileType);

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

export const MemberTypesType = new GraphQLList(MemberTypeType);
