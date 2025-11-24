import type { HomeSlotsRepository } from "@/repositories/home-slots-repository"
import type { PostsRepository } from "@/repositories/posts-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import type { HomeSlot } from "@prisma/client"

interface AssignPostToSlotUseCaseRequest {
  slotId: string
  postId: string | null
}

interface AssignPostToSlotUseCaseResponse {
  slot: HomeSlot
}

export class AssignPostToSlotUseCase {
  constructor(
    private homeSlotsRepository: HomeSlotsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({
    slotId,
    postId,
  }: AssignPostToSlotUseCaseRequest): Promise<AssignPostToSlotUseCaseResponse> {
    const slot = await this.homeSlotsRepository.findById(slotId)
    if (!slot) {
      throw new ResourceNotFoundError()
    }

    // Se postId for fornecido, verificar se o post existe
    if (postId) {
      const post = await this.postsRepository.findById(postId)
      if (!post) {
        throw new ResourceNotFoundError()
      }
    }

    const updatedSlot = await this.homeSlotsRepository.assignPost(slotId, postId)

    return { slot: updatedSlot }
  }
}

