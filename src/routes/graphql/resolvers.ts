import { MemberType, Post, Profile, User as UserDTO } from '@prisma/client';
import { FastifyInstanceWithDataLoaders, User } from './types.js';
import { GraphQLResolveInfo } from 'graphql/type/index.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

const getUser = async (
  parent: unknown,
  args: User,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<unknown> => {
  const { id } = args;
  return await fastify.dataLoaders.user.load(id);
};

const getUsers = async (
  parent: unknown,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
  info: GraphQLResolveInfo,
): Promise<User[]> => {
  const parsedInfo = parseResolveInfo(info);
  const { fields } = simplifyParsedResolveInfoFragmentWithType(
    parsedInfo as ResolveTree,
    info.returnType,
  );
  const users = await fastify.prisma.user.findMany({
    include: {
      userSubscribedTo: 'userSubscribedTo' in fields,
      subscribedToUser: 'subscribedToUser' in fields,
    },
  });

  users.forEach((user) => {
    fastify.dataLoaders.user.prime(user.id, user);
  });

  return users;
};

const getPost = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Post | null> => {
  const { id } = args;
  return await fastify.prisma.post.findUnique({
    where: {
      id,
    },
  });
};

const getPosts = async (
  parent: unknown,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Post[]> => {
  return await fastify.prisma.post.findMany();
};

const getProfile = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Profile | null> => {
  const { id } = args;
  return await fastify.prisma.profile.findUnique({
    where: {
      id,
    },
  });
};

const getProfiles = async (
  parent: unknown,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Profile[]> => {
  return await fastify.prisma.profile.findMany();
};

const getProfileFromUser = async (
  parent: User,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<unknown> => {
  const { id } = parent;
  return await fastify.dataLoaders.profile.load(id);
};

const getUserFromProfile = async (
  parent: Profile,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<User | null> => {
  const { userId } = parent;
  return await fastify.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

const getMemberTypeFromProfile = async (
  parent: Profile,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<unknown> => {
  const { memberTypeId } = parent;
  return await fastify.dataLoaders.memberType.load(memberTypeId);
};

const getProfilesFromMemberType = async (
  parent: MemberType,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Profile[]> => {
  const { id } = parent;
  return await fastify.prisma.profile.findMany({
    where: {
      memberTypeId: id,
    },
  });
};

const getSubscribedToUser = async (
  parent: User,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<unknown> => {
  const { subscribedToUser } = parent;

  if (subscribedToUser && subscribedToUser.length > 0) {
    const subscriberIds = subscribedToUser.map(({ subscriberId }) => subscriberId);
    return await fastify.dataLoaders.user.loadMany(subscriberIds);
  }

  return null;
};

const getUserSubscribedTo = async (
  parent: User,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<unknown> => {
  const { userSubscribedTo } = parent;

  if (userSubscribedTo && userSubscribedTo.length > 0) {
    const authorIds = userSubscribedTo.map(({ authorId }) => authorId);
    return await fastify.dataLoaders.user.loadMany(authorIds);
  }

  return null;
};

const getAuthorFromPost = async (
  parent: Post,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<User | null> => {
  const { authorId } = parent;
  return await fastify.prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });
};

const getPostsFromUser = async (
  parent: User,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<unknown> => {
  const { id } = parent;
  return await fastify.dataLoaders.post.load(id);
};

const getMemberType = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<MemberType | null> => {
  const { id } = args;
  return await fastify.prisma.memberType.findUnique({
    where: {
      id,
    },
  });
};

const getMemberTypes = async (
  parent: unknown,
  args: unknown,
  fastify: FastifyInstanceWithDataLoaders,
): Promise<MemberType[]> => {
  return await fastify.prisma.memberType.findMany();
};

const createUser = async (
  parent: unknown,
  args: { dto: UserDTO },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<User> => {
  return await fastify.prisma.user.create({
    data: args.dto,
  });
};

const changeUser = async (
  parent: unknown,
  args: { id: string; dto: UserDTO },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<User | null> => {
  return await fastify.prisma.user.update({
    where: { id: args.id },
    data: args.dto,
  });
};

const deleteUser = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<null> => {
  await fastify.prisma.user.delete({
    where: {
      id: args.id,
    },
  });
  return null;
};

const createPost = async (
  parent: unknown,
  args: { dto: Post },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Post> => {
  return await fastify.prisma.post.create({
    data: args.dto,
  });
};

const changePost = async (
  parent: unknown,
  args: { id: string; dto: Post },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Post | null> => {
  return await fastify.prisma.post.update({
    where: { id: args.id },
    data: args.dto,
  });
};

const deletePost = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<null> => {
  await fastify.prisma.post.delete({
    where: {
      id: args.id,
    },
  });
  return null;
};

const subscribeTo = async (
  parent: unknown,
  args: {
    userId: string;
    authorId: string;
  },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<User> => {
  return await fastify.prisma.user.update({
    where: { id: args.userId },
    data: {
      userSubscribedTo: {
        create: {
          authorId: args.authorId,
        },
      },
    },
  });
};

const unsubscribeFrom = async (
  parent: unknown,
  args: {
    userId: string;
    authorId: string;
  },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<boolean> => {
  await fastify.prisma.user.update({
    where: {
      id: args.userId,
    },
    data: {
      userSubscribedTo: {
        deleteMany: {
          authorId: args.authorId,
        },
      },
    },
  });

  return true;
};

const createProfile = async (
  parent: unknown,
  args: { dto: Profile },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Profile> => {
  return await fastify.prisma.profile.create({
    data: args.dto,
  });
};

const changeProfile = async (
  parent: unknown,
  args: { id: string; dto: Profile },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<Profile | null> => {
  return await fastify.prisma.profile.update({
    where: { id: args.id },
    data: args.dto,
  });
};

const deleteProfile = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstanceWithDataLoaders,
): Promise<null> => {
  await fastify.prisma.profile.delete({
    where: {
      id: args.id,
    },
  });
  return null;
};

export {
  getUser,
  getUsers,
  getPost,
  getPosts,
  getProfile,
  getProfiles,
  getProfileFromUser,
  getUserFromProfile,
  getMemberTypeFromProfile,
  getProfilesFromMemberType,
  getSubscribedToUser,
  getUserSubscribedTo,
  getAuthorFromPost,
  getPostsFromUser,
  getMemberType,
  getMemberTypes,
  createUser,
  changeUser,
  deleteUser,
  createPost,
  changePost,
  deletePost,
  subscribeTo,
  unsubscribeFrom,
  createProfile,
  changeProfile,
  deleteProfile,
};
