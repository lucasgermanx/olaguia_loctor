import type { Comment, Prisma } from "@prisma/client"

export interface CommentsRepository {
  findById(id: string): Promise<Comment | null>
  findManyByPostId(postId: string): Promise<Comment[]>
  create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment>
}
