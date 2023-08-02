import * as graphql from 'graphql';
import * as types from './types/types.js';
import * as resolvers from './resolvers.js';
import { UUIDType } from './types/uuid.js';

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: types.UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: resolvers.getUser,
    },
    users: {
      type: types.UsersType,
      resolve: resolvers.getUsers,
    },
    post: {
      type: types.PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: resolvers.getPost,
    },
    posts: {
      type: types.PostsType,
      resolve: resolvers.getPosts,
    },
    profile: {
      type: types.ProfileType,
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: resolvers.getProfile,
    },
    profiles: {
      type: types.ProfilesType,
      resolve: resolvers.getProfiles,
    },
    memberType: {
      type: types.MemberTypeType,
      args: {
        id: { type: types.memberTypeId },
      },
      resolve: resolvers.getMemberType,
    },
    memberTypes: {
      type: types.MemberTypesType,
      resolve: resolvers.getMemberTypes,
    },
  },
});

const mutationType = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: types.UserType,
      args: {
        dto: {
          type: new graphql.GraphQLNonNull(
            new graphql.GraphQLInputObjectType({
              name: 'CreateUserInput',
              fields: () => ({
                name: {
                  type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
                balance: {
                  type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
                },
              }),
            }),
          ),
        },
      },
      resolve: resolvers.createUser,
    },
    changeUser: {
      type: types.UserType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new graphql.GraphQLNonNull(
            new graphql.GraphQLInputObjectType({
              name: 'ChangeUserInput',
              fields: () => ({
                name: {
                  type: graphql.GraphQLString,
                },
                balance: {
                  type: graphql.GraphQLFloat,
                },
              }),
            }),
          ),
        },
      },
      resolve: resolvers.changeUser,
    },
    deleteUser: {
      type: graphql.GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: resolvers.deleteUser,
    },
    createProfile: {
      type: types.ProfileType,
      args: {
        dto: {
          type: new graphql.GraphQLNonNull(
            new graphql.GraphQLInputObjectType({
              name: 'CreateProfileInput',
              fields: () => ({
                isMale: {
                  type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
                },
                yearOfBirth: {
                  type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
                },
                userId: {
                  type: new graphql.GraphQLNonNull(UUIDType),
                },
                memberTypeId: {
                  type: new graphql.GraphQLNonNull(types.memberTypeId),
                },
              }),
            }),
          ),
        },
      },
      resolve: resolvers.createProfile,
    },
    changeProfile: {
      type: types.ProfileType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new graphql.GraphQLNonNull(
            new graphql.GraphQLInputObjectType({
              name: 'ChangeProfileInput',
              fields: () => ({
                isMale: {
                  type: graphql.GraphQLBoolean,
                },
                yearOfBirth: {
                  type: graphql.GraphQLInt,
                },
              }),
            }),
          ),
        },
      },
      resolve: resolvers.changeProfile,
    },
    deleteProfile: {
      type: graphql.GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: resolvers.deleteProfile,
    },
    createPost: {
      type: types.PostType,
      args: {
        dto: {
          type: new graphql.GraphQLNonNull(
            new graphql.GraphQLInputObjectType({
              name: 'CreatePostInput',
              fields: () => ({
                title: {
                  type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
                content: {
                  type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
                authorId: {
                  type: new graphql.GraphQLNonNull(UUIDType),
                },
              }),
            }),
          ),
        },
      },
      resolve: resolvers.createPost,
    },
    changePost: {
      type: types.PostType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new graphql.GraphQLNonNull(
            new graphql.GraphQLInputObjectType({
              name: 'ChangePostInput',
              fields: () => ({
                title: {
                  type: graphql.GraphQLString,
                },
                content: {
                  type: graphql.GraphQLString,
                },
              }),
            }),
          ),
        },
      },
      resolve: resolvers.changePost,
    },
    deletePost: {
      type: graphql.GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: resolvers.deletePost,
    },
    subscribeTo: {
      type: types.UserType,
      args: {
        userId: {
          type: new graphql.GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new graphql.GraphQLNonNull(UUIDType),
        },
      },
      resolve: resolvers.subscribeTo,
    },
    unsubscribeFrom: {
      type: graphql.GraphQLBoolean,
      args: {
        userId: {
          type: new graphql.GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new graphql.GraphQLNonNull(UUIDType),
        },
      },
      resolve: resolvers.unsubscribeFrom,
    },
  },
});

const schema = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export { schema };
