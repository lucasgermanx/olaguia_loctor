import type { CommentsRepository } from "@/repositories/comments-repository"
import type { Comment } from "@prisma/client"

interface ListCommentsUseCaseRequest {
  post_id: string
}

interface ListCommentsUseCaseResponse {
  comments: Comment[]
}

export class ListCommentsUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ post_id }: ListCommentsUseCaseRequest): Promise<ListCommentsUseCaseResponse> {
    const comments = await this.commentsRepository.findManyByPostId(post_id)

    return { comments }
  }
}
