import type { PostsRepository } from "@/repositories/posts-repository"
import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { TagsRepository } from "@/repositories/tags-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import type { Post } from "@prisma/client"
import { prisma } from "@/lib/prisma"

interface CreatePostUseCaseRequest {
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  published: boolean
  category_id: string
  author_id: string
  tags?: string[]
  theme?: string
  position?: string
  order?: number
  featured?: boolean
}

interface CreatePostUseCaseResponse {
  post: Post
}

export class CreatePostUseCase {
  constructor(
    private postsRepository: PostsRepository,
    private categoriesRepository: CategoriesRepository,
    private tagsRepository: TagsRepository,
  ) { }

  async execute({
    title,
    slug,
    excerpt,
    content,
    featured_image,
    published,
    category_id,
    author_id,
    tags,
    theme,
    position,
    order,
    featured,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    // Check if category exists
    const categoryExists = await this.categoriesRepository.findById(category_id)
    if (!categoryExists) {
      throw new Error("Categoria não encontrada")
    }

    // Create post
    const post = await prisma.$transaction(async (tx) => {
      const createdPost = await this.postsRepository.create({
        title,
        slug,
        excerpt,
        content,
        featured_image,
        published,
        published_at: published ? new Date() : null,
        category_id,
        author_id,
        theme: theme as any,
        position: position as any,
        order: order ?? 0,
        featured: featured ?? false,
      })

      // Add tags if provided
      if (tags && tags.length > 0) {
        for (const tagId of tags) {
          const tagExists = await this.tagsRepository.findById(tagId)
          if (tagExists) {
            await tx.tagsOnPosts.create({
              data: {
                post_id: createdPost.id,
                tag_id: tagId,
              },
            })
          }
        }
      }

      return createdPost
    })

    return { post }
  }
}
