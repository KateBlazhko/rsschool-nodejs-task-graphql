import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance } from 'fastify';
import { graphql, GraphQLSchema, parse } from 'graphql';
import depthLimit = require('graphql-depth-limit');
import { createLoaders } from '../../loaders/loaders';
import { LoadersType } from '../../loaders/model';
import { mutationType } from './mutationType';
import { queryType } from './queryType';
import { graphqlBodySchema } from './schema';
import { validate } from 'graphql/validation'; 

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
        mutation: mutationType,
      });

      if (request.body.query) {
        const documentAST = parse(request.body.query)
        const resultValidate = validate(schema, documentAST, [ depthLimit(6) ])

        if (resultValidate.length === 0) {
          const loaders = createLoaders(fastify)

          return await graphql({schema, source: request.body.query, contextValue: {fastify, ...loaders}, variableValues: request.body.variables})  
        }
        
        return {
          data: null,
          errors: resultValidate
        }
      }

      if (request.body.mutation) {
        return await graphql({schema, source: request.body.mutation, contextValue: fastify, variableValues: request.body.variables})
      }
    }
  );
};

export default plugin;
