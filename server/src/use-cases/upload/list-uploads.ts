import type { UploadRepository, Upload } from "@/repositories/upload-repository"

interface ListUploadsUseCaseRequest {
    page: number
    per_page: number
}

interface ListUploadsUseCaseResponse {
    uploads: Upload[]
    meta: {
        page: number
        per_page: number
        total: number
        total_pages: number
    }
}

export class ListUploadsUseCase {
    constructor(private uploadRepository: UploadRepository) { }

    async execute({
        page,
        per_page,
    }: ListUploadsUseCaseRequest): Promise<ListUploadsUseCaseResponse> {
        const { uploads, total } = await this.uploadRepository.findMany(page, per_page)

        const total_pages = Math.ceil(total / per_page)

        return {
            uploads,
            meta: {
                page,
                per_page,
                total,
                total_pages,
            },
        }
    }
}

