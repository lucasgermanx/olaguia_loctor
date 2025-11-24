-- CreateEnum
CREATE TYPE "PostTheme" AS ENUM ('HERO', 'EM_DESTAQUE', 'PARA_REFLEXAO', 'NOSSA_SAUDE', 'SOBRE_RELACIONAMENTOS', 'EMPRESAS_NEGOCIOS', 'ESTETICA_BELEZA', 'RINDO_A_TOA', 'QUEBRA_CUCA', 'GASTRONOMIA', 'SUPER_DICAS');

-- CreateEnum
CREATE TYPE "PostPosition" AS ENUM ('LEFT', 'CENTER', 'RIGHT', 'MAIN', 'SIDE');

-- CreateEnum
CREATE TYPE "AdPosition" AS ENUM ('HERO_BOTTOM', 'BUSINESS_BANNER_1', 'NOSSA_SAUDE_RIGHT', 'SOBRE_RELACIONAMENTOS_MIDDLE', 'PROMOTIONAL_BANNER_1', 'EMPRESAS_NEGOCIOS_RIGHT', 'RINDO_A_TOA_MIDDLE', 'BUILD_BUSINESS_BANNER', 'GASTRONOMIA_BOTTOM');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "order" INTEGER DEFAULT 0,
ADD COLUMN     "position" "PostPosition",
ADD COLUMN     "theme" "PostTheme";

-- CreateTable
CREATE TABLE "ads" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT DEFAULT '#',
    "position" "AdPosition" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ads_position_active_idx" ON "ads"("position", "active");

-- CreateIndex
CREATE INDEX "posts_theme_position_order_idx" ON "posts"("theme", "position", "order");
