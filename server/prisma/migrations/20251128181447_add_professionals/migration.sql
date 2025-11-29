-- CreateTable
CREATE TABLE "professionals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "avatar" TEXT,
    "cover_image" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "working_hours" TEXT,
    "specialties" JSONB,
    "services" JSONB,
    "testimonials" JSONB,
    "faqs" JSONB,
    "gallery_images" JSONB,
    "social_facebook" TEXT,
    "social_instagram" TEXT,
    "social_linkedin" TEXT,
    "social_twitter" TEXT,
    "social_youtube" TEXT,
    "social_whatsapp" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professionals_slug_key" ON "professionals"("slug");

-- CreateIndex
CREATE INDEX "professionals_slug_idx" ON "professionals"("slug");

-- CreateIndex
CREATE INDEX "professionals_active_idx" ON "professionals"("active");

-- CreateIndex
CREATE INDEX "professionals_featured_idx" ON "professionals"("featured");

-- CreateIndex
CREATE INDEX "professionals_city_state_idx" ON "professionals"("city", "state");
