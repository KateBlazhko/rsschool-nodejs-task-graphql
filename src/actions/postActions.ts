import { FastifyInstance } from "fastify"
import { ChangePostDTO, CreatePostDTO, PostEntity } from "../utils/DB/entities/DBPosts"

export const getPosts = async (context: FastifyInstance): Promise<PostEntity[]> => {
  return await context.db.posts.findMany()
}

export const getPostById = async (id: string, context: FastifyInstance): Promise<PostEntity> => {
  const founded = await context.db.posts.findOne({key: 'id', equals: id})

      if (!founded) throw context.httpErrors.notFound()

      return founded
}

export const createPost = async (postDTO: CreatePostDTO, context: FastifyInstance): Promise<PostEntity> => {
  return await context.db.posts.create(postDTO)
}

export const deletePost = async (id: string, context: FastifyInstance): Promise<PostEntity> => {
  const founded = await context.db.posts.findOne({key: 'id', equals: id})

  if (!founded) throw context.httpErrors.badRequest()
  return await context.db.posts.delete(id)
}

export const updatePost = async (id: string, postDTO: ChangePostDTO, context: FastifyInstance): Promise<PostEntity> => {
  const founded = await context.db.posts.findOne({key: 'id', equals: id})

  if (!founded) throw context.httpErrors.badRequest()
  
  return await context.db.posts.change(id, postDTO)
}