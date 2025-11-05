// server/prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import pkg from 'bcryptjs';
const { hash } = pkg;

const prisma = new PrismaClient()

async function main() {
  // Criar usuário admin
  const adminPassword = await hash('senha123', 8)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@exemplo.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@exemplo.com',
      password_hash: adminPassword,
      role: 'ADMIN'
    }
  })

  console.log('Usuário admin criado:', admin)

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'direito-civil' },
      update: {},
      create: {
        name: 'Direito Civil',
        slug: 'direito-civil',
        description: 'Artigos sobre direito civil'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'direito-trabalhista' },
      update: {},
      create: {
        name: 'Direito Trabalhista',
        slug: 'direito-trabalhista',
        description: 'Artigos sobre direito trabalhista'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'direito-tributario' },
      update: {},
      create: {
        name: 'Direito Tributário',
        slug: 'direito-tributario',
        description: 'Artigos sobre direito tributário'
      }
    })
  ])

  console.log('Categorias criadas:', categories)

  // Criar tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'contratos' },
      update: {},
      create: {
        name: 'Contratos',
        slug: 'contratos'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'processos' },
      update: {},
      create: {
        name: 'Processos',
        slug: 'processos'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'jurisprudencia' },
      update: {},
      create: {
        name: 'Jurisprudência',
        slug: 'jurisprudencia'
      }
    })
  ])

  console.log('Tags criadas:', tags)

  // Criar posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Principais Alterações no Código Civil em 2023',
        slug: 'principais-alteracoes-codigo-civil-2023',
        excerpt: 'Um resumo das principais alterações no Código Civil brasileiro em 2023 e como elas afetam os cidadãos.',
        content: `
          <h2>Introdução às Alterações no Código Civil</h2>
          <p>O Código Civil brasileiro passou por importantes alterações em 2023. Este artigo analisa as principais mudanças e seus impactos na sociedade.</p>
          
          <h3>Alterações nos Contratos</h3>
          <p>As novas regras para contratos incluem maior flexibilidade nas cláusulas de rescisão e novos mecanismos de proteção ao consumidor.</p>
          
          <h3>Mudanças no Direito de Família</h3>
          <p>O conceito de família foi ampliado, reconhecendo novas configurações familiares e garantindo direitos iguais a todos os membros.</p>
          
          <h3>Conclusão</h3>
          <p>As alterações no Código Civil representam um avanço significativo na modernização da legislação brasileira, adaptando-a às necessidades contemporâneas da sociedade.</p>
        `,
        published: true,
        published_at: new Date(),
        featured_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        author_id: admin.id,
        category_id: categories[0].id,
        tags: {  // Alterado de post_tags para tags
          create: [
            { tag_id: tags[0].id },
            { tag_id: tags[2].id }
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: 'Direitos Trabalhistas na Era do Home Office',
        slug: 'direitos-trabalhistas-era-home-office',
        excerpt: 'Como a legislação trabalhista se adapta ao crescimento do trabalho remoto e quais são seus direitos nesse novo cenário.',
        content: `
          <h2>O Trabalho Remoto e a Legislação</h2>
          <p>Com o aumento do trabalho remoto, a legislação trabalhista precisou se adaptar rapidamente. Este artigo explora os direitos dos trabalhadores nesse novo contexto.</p>
          
          <h3>Jornada de Trabalho</h3>
          <p>Mesmo em home office, os limites da jornada de trabalho devem ser respeitados. Saiba como a lei protege os trabalhadores contra jornadas excessivas.</p>
          
          <h3>Equipamentos e Custos</h3>
          <p>Quem deve arcar com os custos de equipamentos e internet? A legislação estabelece responsabilidades claras para empregadores e empregados.</p>
          
          <h3>Conclusão</h3>
          <p>O trabalho remoto veio para ficar, e conhecer seus direitos é fundamental para garantir condições justas e saudáveis de trabalho.</p>
        `,
        published: true,
        published_at: new Date(),
        featured_image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        author_id: admin.id,
        category_id: categories[1].id,
        tags: {  // Alterado de post_tags para tags
          create: [
            { tag_id: tags[1].id }
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: 'Planejamento Tributário para Pequenas Empresas',
        slug: 'planejamento-tributario-pequenas-empresas',
        excerpt: 'Estratégias legais para reduzir a carga tributária de pequenas empresas e aumentar a competitividade no mercado.',
        content: `
          <h2>A Importância do Planejamento Tributário</h2>
          <p>O planejamento tributário é essencial para a saúde financeira de pequenas empresas. Este artigo apresenta estratégias legais para otimizar a carga tributária.</p>
          
          <h3>Escolha do Regime Tributário</h3>
          <p>A escolha entre Simples Nacional, Lucro Presumido ou Lucro Real pode fazer grande diferença no montante de impostos pagos. Saiba como escolher o regime mais adequado para seu negócio.</p>
          
          <h3>Benefícios Fiscais</h3>
          <p>Conheça os incentivos fiscais disponíveis para pequenas empresas e como aproveitá-los de forma legal e eficiente.</p>
          
          <h3>Conclusão</h3>
          <p>Um bom planejamento tributário não significa sonegação, mas sim conhecimento e aplicação inteligente da legislação para reduzir legalmente a carga de impostos.</p>
        `,
        published: true,
        published_at: new Date(),
        featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2011&q=80',
        author_id: admin.id,
        category_id: categories[2].id,
        tags: {  // Alterado de posts_tags para tags
          create: [
            { tag_id: tags[0].id },
            { tag_id: tags[1].id }
          ]
        }
      }
    })
  ])

  console.log('Posts criados:', posts)

  // Criar alguns comentários
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Excelente artigo! Muito esclarecedor sobre as mudanças recentes.',
        author_id: admin.id,
        post_id: posts[0].id,
        is_approved: true
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Gostaria de saber mais sobre como essas alterações afetam contratos já existentes.',
        author_id: admin.id,
        post_id: posts[0].id,
        is_approved: true
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Este artigo me ajudou muito a entender meus direitos no home office. Obrigado!',
        author_id: admin.id,
        post_id: posts[1].id,
        is_approved: true
      }
    })
  ])

  console.log('Comentários criados:', comments)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
