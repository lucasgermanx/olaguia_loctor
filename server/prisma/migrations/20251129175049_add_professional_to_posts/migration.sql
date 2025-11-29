-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "professional_id" TEXT;

-- CreateIndex
CREATE INDEX "posts_professional_id_idx" ON "posts"("professional_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
