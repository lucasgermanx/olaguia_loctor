import type { PostsRepository } from "@/repositories/posts-repository"
import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { TagsRepository } from "@/repositories/tags-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import type { Post } from "@prisma/client"
import { prisma } from "@/lib/prisma"

interface UpdatePostUseCaseRequest {
  id: string
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  featured_image?: string
  published?: boolean
  category_id?: string
  tags?: string[]
}

interface UpdatePostUseCaseResponse {
  post: Post
}

export class UpdatePostUseCase {
  constructor(
    private postsRepository: PostsRepository,
    private categoriesRepository: CategoriesRepository,
    private tagsRepository: TagsRepository,
  ) {}

  async execute({
    id,
    title,
    slug,
    excerpt,
    content,
    featured_image,
    published,
    category_id,
    tags,
  }: UpdatePostUseCaseRequest): Promise<UpdatePostUseCaseResponse> {
    // Check if post exists
    const postExists = await this.postsRepository.findById(id)
    if (!postExists) {
      throw new ResourceNotFoundError()
    }

    // Check if category exists if provided
    if (category_id) {
      const categoryExists = await this.categoriesRepository.findById(category_id)
      if (!categoryExists) {
        throw new ResourceNotFoundError()
      }
    }

    // Update post with transaction to handle tags
    const post = await prisma.$transaction(async (tx) => {
      // Prepare update data
      const updateData: any = {}
      if (title) updateData.title = title
      if (slug) updateData.slug = slug
      if (excerpt !== undefined) updateData.excerpt = excerpt
      if (content) updateData.content = content
      if (featured_image !== undefined) updateData.featured_image = featured_image
      if (category_id) updateData.category_id = category_id

      // Handle published status change
      if (published !== undefined) {
        updateData.published = published
        // If publishing for the first time, set published_at
        if (published && !postExists.published_at) {
          updateData.published_at = new Date()
        }
      }

      // Update post
      const updatedPost = await this.postsRepository.update(id, updateData)

      // Update tags if provided
      if (tags) {
        // Remove existing tags
        await tx.tagsOnPosts.deleteMany({
          where: { post_id: id },
        })

        // Add new tags
        for (const tagId of tags) {
          const tagExists = await this.tagsRepository.findById(tagId)
          if (tagExists) {
            await tx.tagsOnPosts.create({
              data: {
                post_id: id,
                tag_id: tagId,
              },
            })
          }
        }
      }

      return updatedPost
    })

    return { post }
  }
}
