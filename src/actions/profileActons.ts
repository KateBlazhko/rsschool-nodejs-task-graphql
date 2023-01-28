import { FastifyInstance } from "fastify"
import { ChangeProfileDTO, CreateProfileDTO, ProfileEntity } from "../utils/DB/entities/DBProfiles"

export const getProfiles = async (context: FastifyInstance): Promise<ProfileEntity[]> => {
  return await context.db.profiles.findMany()
}

export const getProfileById = async (id: string, fastify: FastifyInstance): Promise<ProfileEntity> => {
  const founded = await fastify.db.profiles.findOne({key: 'id', equals: id})

  if (!founded) throw fastify.httpErrors.notFound()

  return founded
}

export const createProfile = async (profileDTO: CreateProfileDTO, context: FastifyInstance): Promise<ProfileEntity> => {
  const profile = await context.db.profiles.findOne({key: 'userId', equals: profileDTO.userId})
  const user = await context.db.users.findOne({key: 'id', equals: profileDTO.userId})
  const memberTypeId = await context.db.memberTypes.findOne({key: 'id', equals: profileDTO.memberTypeId})

  if (!user || profile || !memberTypeId) throw context.httpErrors.badRequest()
  
  return await context.db.profiles.create(profileDTO)
}

export const deleteProfile = async (id: string, context: FastifyInstance): Promise<ProfileEntity> => {
  const founded = await context.db.profiles.findOne({key: 'id', equals: id})

  if (!founded) throw context.httpErrors.badRequest()

  return await context.db.profiles.delete(id)
}

export const updateProfile = async (id: string, profileDTO: ChangeProfileDTO, context: FastifyInstance): Promise<ProfileEntity> => {
  const founded = await context.db.profiles.findOne({key: 'id', equals: id})

  if (!founded) throw context.httpErrors.badRequest()
  
  return await context.db.profiles.change(id, profileDTO)
  
}