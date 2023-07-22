import { FastifyInstance } from 'fastify';
import { MemberType, Post, Profile, User } from '@prisma/client';

export const getUser = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstance,
): Promise<User | null> => {
  const { id } = args;

  return await fastify.prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const getUsers = async (
  parent: unknown,
  args: unknown,
  fastify: FastifyInstance,
): Promise<User[]> => {
  return fastify.prisma.user.findMany();
};

export const getPost = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstance,
): Promise<Post | null> => {
  const { id } = args;
  return await fastify.prisma.post.findUnique({
    where: {
      id,
    },
  });
};

export const getPosts = async (
  parent: unknown,
  args: unknown,
  fastify: FastifyInstance,
): Promise<Post[]> => {
  return fastify.prisma.post.findMany();
};

export const getProfile = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstance,
): Promise<Profile | null> => {
  const { id } = args;
  return await fastify.prisma.profile.findUnique({
    where: {
      id,
    },
  });
};

export const getProfiles = async (
  parent: unknown,
  args: unknown,
  fastify: FastifyInstance,
): Promise<Profile[]> => {
  return fastify.prisma.profile.findMany();
};

export const getProfileFromUser = async (
  parent: User,
  args: unknown,
  fastify: FastifyInstance,
): Promise<Profile | null> => {
  const { id } = parent;

  return await fastify.prisma.profile.findUnique({
    where: {
      userId: id,
    },
  });
};

export const getUserFromProfile = async (
  parent: Profile,
  args: unknown,
  fastify: FastifyInstance,
): Promise<User | null> => {
  const { userId } = parent;

  return await fastify.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const getMemberTypeFromProfile = async (
  parent: Profile,
  args: unknown,
  fastify: FastifyInstance,
): Promise<MemberType | null> => {
  const { memberTypeId } = parent;

  return await fastify.prisma.memberType.findUnique({
    where: {
      id: memberTypeId,
    },
  });
};

export const getProfilesFromMemberType = async (
  parent: MemberType,
  args: unknown,
  fastify: FastifyInstance,
): Promise<Profile[]> => {
  const { id } = parent;

  return fastify.prisma.profile.findMany({
    where: {
      memberTypeId: id,
    },
  });
};

export const getSubscribedToUser = async (
  parent: User,
  args: unknown,
  fastify: FastifyInstance,
): Promise<User[]> => {
  const { id } = parent;

  return fastify.prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: id,
        },
      },
    },
  });
};

export const getUserSubscribedTo = async (
  parent: User,
  args: unknown,
  fastify: FastifyInstance,
): Promise<User[]> => {
  const { id } = parent;

  return fastify.prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: id,
        },
      },
    },
  });
};

export const getAuthorFromPost = async (
  parent: Post,
  args: unknown,
  fastify: FastifyInstance,
): Promise<User | null> => {
  const { authorId } = parent;

  return await fastify.prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });
};

export const getPostFromUser = async (
  parent: User,
  args: unknown,
  fastify: FastifyInstance,
): Promise<Post[]> => {
  const { id } = parent;

  return fastify.prisma.post.findMany({
    where: {
      authorId: id,
    },
  });
};

export const getMemberType = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstance,
): Promise<MemberType | null> => {
  const { id } = args;
  return await fastify.prisma.memberType.findUnique({
    where: {
      id,
    },
  });
};

export const getMemberTypes = async (
  parent: unknown,
  args: unknown,
  fastify: FastifyInstance,
): Promise<MemberType[]> => {
  return fastify.prisma.memberType.findMany();
};

export const createUser = async (
  parent: unknown,
  args: { dto: Omit<User, 'id'> },
  fastify: FastifyInstance,
): Promise<User> => {
  return fastify.prisma.user.create({
    data: args.dto,
  });
};

export const changeUser = async (
  parent: unknown,
  args: { id: string; dto: Partial<User> },
  fastify: FastifyInstance,
): Promise<User | null> => {
  return fastify.prisma.user.update({
    where: { id: args.id },
    data: args.dto,
  });
};

export const deleteUser = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstance,
): Promise<null> => {
  await fastify.prisma.user.delete({
    where: {
      id: args.id,
    },
  });
  return null;
};

export const createPost = async (
  parent: unknown,
  args: { dto: Omit<Post, 'id'> },
  fastify: FastifyInstance,
): Promise<Post> => {
  return fastify.prisma.post.create({
    data: args.dto,
  });
};

export const changePost = async (
  parent: unknown,
  args: { id: string; dto: Partial<Post> },
  fastify: FastifyInstance,
): Promise<Post | null> => {
  return fastify.prisma.post.update({
    where: { id: args.id },
    data: args.dto,
  });
};

export const deletePost = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstance,
): Promise<null> => {
  await fastify.prisma.post.delete({
    where: {
      id: args.id,
    },
  });
  return null;
};

export const subscribeTo = async (
  parent: unknown,
  args: {
    userId: string;
    authorId: string;
  },
  fastify: FastifyInstance,
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
export const unsubscribeFrom = async (
  parent: unknown,
  args: {
    userId: string;
    authorId: string;
  },
  fastify: FastifyInstance,
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

export const createProfile = async (
  parent: unknown,
  args: { dto: Omit<Profile, 'id'> },
  fastify: FastifyInstance,
): Promise<Profile> => {
  return fastify.prisma.profile.create({
    data: args.dto,
  });
};

export const changeProfile = async (
  parent: unknown,
  args: { id: string; dto: Partial<Profile> },
  fastify: FastifyInstance,
): Promise<Profile | null> => {
  return fastify.prisma.profile.update({
    where: { id: args.id },
    data: args.dto,
  });
};

export const deleteProfile = async (
  parent: unknown,
  args: { id: string },
  fastify: FastifyInstance
): Promise<null> => {
  await fastify.prisma.profile.delete({
    where: {
      id: args.id,
    },
  });
  return null;
};
