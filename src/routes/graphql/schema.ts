import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import {
  UserType,
  PostType,
  ProfileType,
  UsersType,
  PostsType,
  ProfilesType,
  MemberTypeType,
  MemberTypesType,
  memberTypeId,
} from './types.js';
import {
  getUser,
  getPost,
  getProfile,
  getProfiles,
  createUser,
  createPost,
  createProfile,
  getUsers,
  getPosts,
  getMemberTypes,
  getMemberType,
  deleteUser,
  deleteProfile,
  deletePost,
  changeUser,
  changeProfile,
  changePost,
  subscribeTo,
  unsubscribeFrom,
} from './resolvers.js';
import { UUIDType } from './types/uuid.js';

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: getUser,
    },
    users: {
      type: UsersType,
      resolve: getUsers,
    },
    post: {
      type: PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: getPost,
    },
    posts: {
      type: PostsType,
      resolve: getPosts,
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: getProfile,
    },
    profiles: {
      type: ProfilesType,
      resolve: getProfiles,
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: memberTypeId },
      },
      resolve: getMemberType,
    },
    memberTypes: {
      type: MemberTypesType,
      resolve: getMemberTypes,
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'CreateUserInput',
              fields: () => ({
                name: {
                  type: new GraphQLNonNull(GraphQLString),
                },
                balance: {
                  type: new GraphQLNonNull(GraphQLFloat),
                },
              }),
            }),
          ),
        },
      },
      resolve: createUser,
    },
    changeUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'ChangeUserInput',
              fields: () => ({
                name: {
                  type: GraphQLString,
                },
                balance: {
                  type: GraphQLFloat,
                },
              }),
            }),
          ),
        },
      },
      resolve: changeUser,
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: deleteUser,
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'CreateProfileInput',
              fields: () => ({
                isMale: {
                  type: new GraphQLNonNull(GraphQLBoolean),
                },
                yearOfBirth: {
                  type: new GraphQLNonNull(GraphQLInt),
                },
                userId: {
                  type: new GraphQLNonNull(UUIDType),
                },
                memberTypeId: {
                  type: new GraphQLNonNull(memberTypeId),
                },
              }),
            }),
          ),
        },
      },
      resolve: createProfile,
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'ChangeProfileInput',
              fields: () => ({
                isMale: {
                  type: GraphQLBoolean,
                },
                yearOfBirth: {
                  type: GraphQLInt,
                },
              }),
            }),
          ),
        },
      },
      resolve: changeProfile,
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: deleteProfile,
    },
    createPost: {
      type: PostType,
      args: {
        dto: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'CreatePostInput',
              fields: () => ({
                title: {
                  type: new GraphQLNonNull(GraphQLString),
                },
                content: {
                  type: new GraphQLNonNull(GraphQLString),
                },
                authorId: {
                  type: new GraphQLNonNull(UUIDType),
                },
              }),
            }),
          ),
        },
      },
      resolve: createPost,
    },
    changePost: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(
            new GraphQLInputObjectType({
              name: 'ChangePostInput',
              fields: () => ({
                title: {
                  type: GraphQLString,
                },
                content: {
                  type: GraphQLString,
                },
              }),
            }),
          ),
        },
      },
      resolve: changePost,
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: deletePost,
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: subscribeTo,
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: unsubscribeFrom,
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export { schema };
