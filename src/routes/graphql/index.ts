import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { schema } from './schema.js';
import depthLimit from 'graphql-depth-limit';
import { createDataLoaders } from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const dataLoaders = createDataLoaders(fastify);

  fastify.decorate('dataLoaders', dataLoaders);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async preHandler(req, reply) {
      const errors = validate(schema, parse(req.body.query), [depthLimit(5)]);
      if (errors.length > 0) {
        await reply.send({ errors });
      }
    },
    async handler(req) {
      const { query, variables } = req.body;

      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: fastify,
      });
    },
  });
};

export default plugin;
