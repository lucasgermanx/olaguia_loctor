-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "site_name" TEXT NOT NULL DEFAULT 'Blog Loctor',
    "site_description" TEXT,
    "primary_color" TEXT NOT NULL DEFAULT '#2563eb',
    "secondary_color" TEXT NOT NULL DEFAULT '#1e40af',
    "accent_color" TEXT NOT NULL DEFAULT '#f59e0b',
    "logo_url" TEXT,
    "favicon_url" TEXT,
    "hero_title" TEXT,
    "hero_subtitle" TEXT,
    "footer_text" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "social_facebook" TEXT,
    "social_instagram" TEXT,
    "social_linkedin" TEXT,
    "social_twitter" TEXT,
    "google_analytics" TEXT,
    "meta_keywords" TEXT,
    "meta_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
