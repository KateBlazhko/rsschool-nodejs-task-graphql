import { FastifyInstance } from "fastify"
import { ChangeMemberTypeDTO, MemberTypeEntity } from "../utils/DB/entities/DBMemberTypes"

export const getMemberTypes = async (context: FastifyInstance): Promise<MemberTypeEntity[]> => {
  return await context.db.memberTypes.findMany()
}

export const getMemberTypeById = async (id: string, fastify: FastifyInstance): Promise<MemberTypeEntity> => {
  const founded = await fastify.db.memberTypes.findOne({key: 'id', equals: id})

    if (!founded) throw fastify.httpErrors.notFound()

    return founded
}

export const updateMemberType = async (id: string, memberTypeDTO: ChangeMemberTypeDTO, context: FastifyInstance): Promise<MemberTypeEntity> => {
  const founded = await context.db.memberTypes.findOne({key: 'id', equals: id})

  if (!founded) throw context.httpErrors.badRequest()
  
  return await context.db.memberTypes.change(id, memberTypeDTO)
}