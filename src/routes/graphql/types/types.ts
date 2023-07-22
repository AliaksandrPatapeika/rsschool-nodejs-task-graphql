import * as graphql from 'graphql';
import * as resolvers from '../resolvers.js';
import DataLoader from 'dataloader';
import { FastifyInstance } from 'fastify';
import { MemberType, Post, Profile, User as UserDTO } from '@prisma/client';
import { UUIDType } from './uuid.js';

const memberTypeId = new graphql.GraphQLEnumType({
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

const UserType: graphql.GraphQLObjectType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: graphql.GraphQLString,
    },
    balance: {
      type: graphql.GraphQLFloat,
    },
    profile: {
      type: ProfileType,
      resolve: resolvers.getProfileFromUser,
    },
    posts: {
      type: PostsType,
      resolve: resolvers.getPostsFromUser,
    },
    subscribedToUser: {
      type: UsersType,
      resolve: resolvers.getSubscribedToUser,
    },
    userSubscribedTo: {
      type: UsersType,
      resolve: resolvers.getUserSubscribedTo,
    },
  }),
});

const UsersType = new graphql.GraphQLList(UserType);

const PostType: graphql.GraphQLObjectType = new graphql.GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    title: {
      type: graphql.GraphQLString,
    },
    content: {
      type: graphql.GraphQLString,
    },
    authorId: {
      type: UUIDType,
    },
    author: {
      type: UserType,
      resolve: resolvers.getAuthorFromPost,
    },
  }),
});

const PostsType = new graphql.GraphQLList(PostType);

const ProfileType: graphql.GraphQLObjectType = new graphql.GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    isMale: {
      type: graphql.GraphQLBoolean,
    },
    yearOfBirth: {
      type: graphql.GraphQLInt,
    },
    userId: {
      type: UUIDType,
    },
    user: {
      type: UserType,
      resolve: resolvers.getUserFromProfile,
    },
    memberTypeId: {
      type: memberTypeId,
    },
    memberType: {
      type: MemberTypeType,
      resolve: resolvers.getMemberTypeFromProfile,
    },
  }),
});

const ProfilesType = new graphql.GraphQLList(ProfileType);

const MemberTypeType = new graphql.GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: memberTypeId,
    },
    discount: {
      type: graphql.GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: graphql.GraphQLInt,
    },
    profiles: {
      type: ProfilesType,
      resolve: resolvers.getProfilesFromMemberType,
    },
  }),
});

const MemberTypesType = new graphql.GraphQLList(MemberTypeType);

type SubscribedType = {
  subscriberId: string;
  authorId: string;
};

interface User extends UserDTO {
  userSubscribedTo?: SubscribedType[];
  subscribedToUser?: SubscribedType[];
}

type Key = string;
type Value = User | Post | Profile | MemberType;
type LoaderFunction<V> = (keys: readonly Key[]) => Promise<V[]>;

type DataLoadersData = {
  user: DataLoader<Key, Value | undefined>;
  post: DataLoader<Key, Value | undefined>;
  profile: DataLoader<Key, Value | undefined>;
  memberType: DataLoader<Key, Value | undefined>;
};

interface FastifyInstanceWithDataLoaders extends FastifyInstance {
  dataLoaders: DataLoadersData;
}

export {
  UserType,
  UsersType,
  PostType,
  PostsType,
  ProfileType,
  ProfilesType,
  MemberTypeType,
  MemberTypesType,
  memberTypeId,
  User,
  Key,
  Value,
  LoaderFunction,
  DataLoadersData,
  FastifyInstanceWithDataLoaders,
};
