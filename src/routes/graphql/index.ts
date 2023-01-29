import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance } from 'fastify';
import { graphql, GraphQLSchema } from 'graphql';
import { createLoaders } from '../../loaders/loaders';
import { LoadersType } from '../../loaders/model';
import { mutationType } from './mutationType';
import { queryType } from './queryType';
import { graphqlBodySchema } from './schema';

export type ContextType = LoadersType & {
  fastify: FastifyInstance;
}

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
  
    async function (request, reply) {
      const schema = new GraphQLSchema({
        query: queryType,
        mutation: mutationType
      });
      const loaders = createLoaders(fastify)

      if (request.body.query) {
        return await graphql({schema, source: request.body.query, contextValue: {fastify, ...loaders}, variableValues: request.body.variables})
      }

      if (request.body.mutation) {
        return await graphql({schema, source: request.body.mutation, contextValue: fastify, variableValues: request.body.variables})
      }
    }
  );
};

export default plugin;
