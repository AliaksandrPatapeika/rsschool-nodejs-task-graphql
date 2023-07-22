import DataLoader from 'dataloader';
import { FastifyInstance } from 'fastify';
import { DataLoadersData, LoaderFunction, User, Value } from './types.js';
import { MemberType, Post, Profile } from '@prisma/client';

const createDataLoader = <K extends string, V extends Value>(
  findManyFunc: LoaderFunction<V>,
  keyProp: keyof V,
) => {
  return new DataLoader<K, V | undefined>(async (keys: readonly K[]) => {
    const result = await findManyFunc(keys);
    const resultMap = new Map<K, V>();

    result.forEach((item) => {
      if ('authorId' in item) {
        const posts = resultMap.get(item[keyProp] as unknown as K) || [];
        (posts as Post[]).push(item);
        resultMap.set(item[keyProp] as unknown as K, posts as unknown as V);
      } else {
        resultMap.set(item[keyProp] as unknown as K, item);
      }
    });

    const sortedInKeysOrder: Array<V | undefined> = [];

    keys.forEach((key) => {
      sortedInKeysOrder.push(resultMap.get(key));
    });

    return sortedInKeysOrder;
  });
};

const createUserLoader = (fastify: FastifyInstance) => {
  return createDataLoader<string, User>(
    async (keys) =>
      fastify.prisma.user.findMany({
        where: { id: { in: keys as string[] } },
        include: { userSubscribedTo: true, subscribedToUser: true },
      }),
    'id',
  );
};

const createPostLoader = (fastify: FastifyInstance) => {
  return createDataLoader<string, Post>(
    async (keys) =>
      fastify.prisma.post.findMany({
        where: { authorId: { in: keys as string[] } },
      }),
    'authorId',
  );
};

const createProfileLoader = (fastify: FastifyInstance) => {
  return createDataLoader<string, Profile>(
    async (keys) =>
      fastify.prisma.profile.findMany({
        where: { userId: { in: keys as string[] } },
      }),
    'userId',
  );
};

const createMemberTypeLoader = (fastify: FastifyInstance) => {
  return createDataLoader<string, MemberType>(
    async (keys) =>
      fastify.prisma.memberType.findMany({
        where: { id: { in: keys as string[] } },
      }),
    'id',
  );
};

const createDataLoaders = (fastify: FastifyInstance): DataLoadersData => {
  return {
    user: createUserLoader(fastify),
    post: createPostLoader(fastify),
    profile: createProfileLoader(fastify),
    memberType: createMemberTypeLoader(fastify),
  };
};

export { createDataLoaders };
