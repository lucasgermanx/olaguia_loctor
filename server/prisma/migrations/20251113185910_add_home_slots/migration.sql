-- CreateTable
CREATE TABLE "home_slots" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "slot_index" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "post_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_slots_section_position_slot_index_idx" ON "home_slots"("section", "position", "slot_index");

-- CreateIndex
CREATE INDEX "home_slots_post_id_idx" ON "home_slots"("post_id");

-- AddForeignKey
ALTER TABLE "home_slots" ADD CONSTRAINT "home_slots_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
