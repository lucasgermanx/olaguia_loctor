import { prisma } from "@/lib/prisma"
import type { CommentsRepository } from "../comments-repository"
import type { Prisma } from "@prisma/client"

export class PrismaCommentsRepository implements CommentsRepository {
  async findById(id: string) {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return comment
  }

  async findManyByPostId(postId: string) {
    const comments = await prisma.comment.findMany({
      where: {
        post_id: postId,
        is_approved: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        replies: {
          where: {
            is_approved: true,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return comments
  }

  async create(data: Prisma.CommentUncheckedCreateInput) {
    const comment = await prisma.comment.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return comment
  }
}
