import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding home slots...")

  // Definir todos os slots da home baseado na estrutura
  const slots = [
    // HERO - 3 slots no carousel
    { section: "HERO", position: "CAROUSEL", slot_index: 0, order: 0 },
    { section: "HERO", position: "CAROUSEL", slot_index: 1, order: 1 },
    { section: "HERO", position: "CAROUSEL", slot_index: 2, order: 2 },

    // EM DESTAQUE - 1 principal + 3 laterais
    { section: "EM_DESTAQUE", position: "MAIN", slot_index: null, order: 0 },
    { section: "EM_DESTAQUE", position: "SIDE", slot_index: 0, order: 1 },
    { section: "EM_DESTAQUE", position: "SIDE", slot_index: 1, order: 2 },
    { section: "EM_DESTAQUE", position: "SIDE", slot_index: 2, order: 3 },

    // PARA REFLEXÃO - 6 slots no carousel
    { section: "PARA_REFLEXAO", position: "CAROUSEL", slot_index: 0, order: 0 },
    { section: "PARA_REFLEXAO", position: "CAROUSEL", slot_index: 1, order: 1 },
    { section: "PARA_REFLEXAO", position: "CAROUSEL", slot_index: 2, order: 2 },
    { section: "PARA_REFLEXAO", position: "CAROUSEL", slot_index: 3, order: 3 },
    { section: "PARA_REFLEXAO", position: "CAROUSEL", slot_index: 4, order: 4 },
    { section: "PARA_REFLEXAO", position: "CAROUSEL", slot_index: 5, order: 5 },

    // NOSSA SAÚDE - 1 principal + 4 laterais
    { section: "NOSSA_SAUDE", position: "MAIN", slot_index: null, order: 0 },
    { section: "NOSSA_SAUDE", position: "SIDE", slot_index: 0, order: 1 },
    { section: "NOSSA_SAUDE", position: "SIDE", slot_index: 1, order: 2 },
    { section: "NOSSA_SAUDE", position: "SIDE", slot_index: 2, order: 3 },
    { section: "NOSSA_SAUDE", position: "SIDE", slot_index: 3, order: 4 },

    // SOBRE RELACIONAMENTOS - 4 slots no carousel
    { section: "SOBRE_RELACIONAMENTOS", position: "CAROUSEL", slot_index: 0, order: 0 },
    { section: "SOBRE_RELACIONAMENTOS", position: "CAROUSEL", slot_index: 1, order: 1 },
    { section: "SOBRE_RELACIONAMENTOS", position: "CAROUSEL", slot_index: 2, order: 2 },
    { section: "SOBRE_RELACIONAMENTOS", position: "CAROUSEL", slot_index: 3, order: 3 },

    // EMPRESAS & NEGÓCIOS - 3 principais + 3 pequenos
    { section: "EMPRESAS_NEGOCIOS", position: "MAIN", slot_index: 0, order: 0 },
    { section: "EMPRESAS_NEGOCIOS", position: "MAIN", slot_index: 1, order: 1 },
    { section: "EMPRESAS_NEGOCIOS", position: "MAIN", slot_index: 2, order: 2 },
    { section: "EMPRESAS_NEGOCIOS", position: "SIDE", slot_index: 0, order: 3 },
    { section: "EMPRESAS_NEGOCIOS", position: "SIDE", slot_index: 1, order: 4 },
    { section: "EMPRESAS_NEGOCIOS", position: "SIDE", slot_index: 2, order: 5 },

    // ESTÉTICA & BELEZA - 6 slots no grid
    { section: "ESTETICA_BELEZA", position: "GRID", slot_index: 0, order: 0 },
    { section: "ESTETICA_BELEZA", position: "GRID", slot_index: 1, order: 1 },
    { section: "ESTETICA_BELEZA", position: "GRID", slot_index: 2, order: 2 },
    { section: "ESTETICA_BELEZA", position: "GRID", slot_index: 3, order: 3 },
    { section: "ESTETICA_BELEZA", position: "GRID", slot_index: 4, order: 4 },
    { section: "ESTETICA_BELEZA", position: "GRID", slot_index: 5, order: 5 },

    // RINDO À TOA - 3 slots
    { section: "RINDO_A_TOA", position: "SIDE", slot_index: 0, order: 0 },
    { section: "RINDO_A_TOA", position: "SIDE", slot_index: 1, order: 1 },
    { section: "RINDO_A_TOA", position: "SIDE", slot_index: 2, order: 2 },

    // QUEBRA CUCA - 3 slots
    { section: "QUEBRA_CUCA", position: "SIDE", slot_index: 0, order: 0 },
    { section: "QUEBRA_CUCA", position: "SIDE", slot_index: 1, order: 1 },
    { section: "QUEBRA_CUCA", position: "SIDE", slot_index: 2, order: 2 },

    // GASTRONOMIA - 3 slots no carousel
    { section: "GASTRONOMIA", position: "CAROUSEL", slot_index: 0, order: 0 },
    { section: "GASTRONOMIA", position: "CAROUSEL", slot_index: 1, order: 1 },
    { section: "GASTRONOMIA", position: "CAROUSEL", slot_index: 2, order: 2 },

    // SUPER DICAS - 1 principal + 3 laterais
    { section: "SUPER_DICAS", position: "MAIN", slot_index: null, order: 0 },
    { section: "SUPER_DICAS", position: "SIDE", slot_index: 0, order: 1 },
    { section: "SUPER_DICAS", position: "SIDE", slot_index: 1, order: 2 },
    { section: "SUPER_DICAS", position: "SIDE", slot_index: 2, order: 3 },
  ]

  for (const slot of slots) {
    // Verificar se já existe
    const existing = await prisma.homeSlot.findFirst({
      where: {
        section: slot.section,
        position: slot.position,
        slot_index: slot.slot_index,
      },
    })

    if (!existing) {
      await prisma.homeSlot.create({
        data: {
          section: slot.section,
          position: slot.position,
          slot_index: slot.slot_index,
          order: slot.order,
        },
      })
    }
  }

  console.log(`✅ Created ${slots.length} home slots`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

