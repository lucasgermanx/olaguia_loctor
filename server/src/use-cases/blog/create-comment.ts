import type { CommentsRepository } from "@/repositories/comments-repository"
import type { PostsRepository } from "@/repositories/posts-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import type { Comment } from "@prisma/client"

interface CreateCommentUseCaseRequest {
  post_id: string
  content: string
  author_id: string
  parent_id?: string
}

interface CreateCommentUseCaseResponse {
  comment: Comment
}

export class CreateCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({
    post_id,
    content,
    author_id,
    parent_id,
  }: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
    // Check if post exists
    const postExists = await this.postsRepository.findById(post_id)
    if (!postExists) {
      throw new ResourceNotFoundError()
    }

    // Check if parent comment exists if provided
    if (parent_id) {
      const parentCommentExists = await this.commentsRepository.findById(parent_id)
      if (!parentCommentExists) {
        throw new ResourceNotFoundError()
      }
    }

    // Create comment
    const comment = await this.commentsRepository.create({
      post_id,
      content,
      author_id,
      parent_id,
      // Auto-approve comments for now, in a real app you might want to moderate them
      is_approved: true,
    })

    return { comment }
  }
}
