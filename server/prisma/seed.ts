import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Seed Professionals
  console.log('Creating professionals...')

  const professional1 = await prisma.professional.upsert({
    where: { slug: 'dra-clara-sousa' },
    update: {},
    create: {
      name: 'Dra. Clara Sousa',
      slug: 'dra-clara-sousa',
      title: 'Dentista',
      specialty: 'Odontologia Estética',
      bio: `Formada pela Universidade de São Paulo (USP) com mais de 15 anos de experiência na área de odontologia estética. Especialista em harmonização orofacial e implantodontia.

Atendo pacientes com dedicação e carinho, buscando sempre os melhores resultados para garantir um sorriso saudável e bonito. Meu compromisso é com a sua saúde bucal e bem-estar.`,
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=600&fit=crop&q=80',
      cover_image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=400&fit=crop&q=80',
      email: 'clara.sousa@clinicasorriso.com.br',
      phone: '(11) 98765-4321',
      address: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP, 01310-100',
      city: 'São Paulo',
      state: 'SP',
      working_hours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h',
      specialties: ['Implantes Dentários', 'Ortodontia', 'Clareamento Dental', 'Próteses', 'Harmonização Orofacial', 'Lentes de Contato Dental'],
      services: [
        {
          id: '1',
          title: 'Implantes Dentários',
          description: 'Recupere seu sorriso com implantes de última geração e tecnologia 3D para planejamento preciso.'
        },
        {
          id: '2',
          title: 'Clareamento Dental',
          description: 'Técnicas avançadas de clareamento para deixar seus dentes mais brancos e brilhantes.'
        },
        {
          id: '3',
          title: 'Harmonização Orofacial',
          description: 'Procedimentos estéticos faciais com ácido hialurônico e toxina botulínica.'
        },
        {
          id: '4',
          title: 'Lentes de Contato Dental',
          description: 'Transforme seu sorriso com lentes ultrafinas e naturais.'
        },
        {
          id: '5',
          title: 'Ortodontia Invisível',
          description: 'Alinhadores transparentes para correção dos dentes sem brackets metálicos.'
        },
        {
          id: '6',
          title: 'Próteses Dentárias',
          description: 'Próteses fixas e removíveis com materiais de alta qualidade.'
        }
      ],
      testimonials: [
        {
          id: '1',
          author: 'João Silva',
          content: 'Excelente profissional! Fiz um implante e o resultado ficou perfeito. A Dra. Clara é muito atenciosa e me deixou super tranquilo durante todo o procedimento.',
          rating: 5
        },
        {
          id: '2',
          author: 'Maria Santos',
          content: 'Adorei o clareamento dental! Meus dentes ficaram branquinhos e o atendimento foi impecável. Super recomendo!',
          rating: 5
        },
        {
          id: '3',
          author: 'Carlos Pereira',
          content: 'As lentes de contato dental ficaram incríveis! Muito naturais e bonitas. A Dra. Clara tem um excelente trabalho.',
          rating: 5
        }
      ],
      faqs: [
        {
          id: '1',
          question: 'Quanto tempo dura um implante dentário?',
          answer: 'Com os cuidados adequados, um implante dentário pode durar a vida toda. É importante manter uma boa higiene bucal e fazer visitas regulares ao dentista.'
        },
        {
          id: '2',
          question: 'O clareamento dental dói?',
          answer: 'Não, o clareamento dental é um procedimento indolor. Alguns pacientes podem sentir uma leve sensibilidade temporária, que é completamente normal.'
        },
        {
          id: '3',
          question: 'Quanto tempo leva para fazer uma lente de contato dental?',
          answer: 'O procedimento completo leva em média 2 a 3 consultas. Na primeira, fazemos o planejamento e moldagem. Depois, instalamos as lentes.'
        },
        {
          id: '4',
          question: 'Aceita convênios odontológicos?',
          answer: 'Sim, trabalhamos com os principais convênios do mercado. Entre em contato para verificar se aceitamos o seu plano.'
        }
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&h=300&fit=crop&q=80'
      ],
      social_facebook: 'https://facebook.com/draclarasousa',
      social_instagram: 'https://instagram.com/draclarasousa',
      social_linkedin: 'https://linkedin.com/in/clarasousa',
      social_whatsapp: '5511987654321',
      active: true,
      featured: true,
    },
  })

  const professional2 = await prisma.professional.upsert({
    where: { slug: 'dr-ricardo-mendes' },
    update: {},
    create: {
      name: 'Dr. Ricardo Mendes',
      slug: 'dr-ricardo-mendes',
      title: 'Fisioterapeuta',
      specialty: 'Fisioterapia Esportiva e Ortopédica',
      bio: `Fisioterapeuta especializado em reabilitação esportiva e ortopédica. Formado pela UNIFESP com pós-graduação em Fisioterapia Traumato-Ortopédica.

Trabalho com atletas profissionais e amadores, oferecendo tratamentos personalizados para recuperação de lesões e melhora de performance. Utilizo técnicas modernas como RPG, Pilates e Dry Needling.`,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop&q=80',
      cover_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop&q=80',
      email: 'ricardo.mendes@fisioativa.com.br',
      phone: '(11) 97654-3210',
      address: 'Rua Augusta, 2500 - Jardins, São Paulo - SP, 01412-100',
      city: 'São Paulo',
      state: 'SP',
      working_hours: 'Segunda a Sexta: 7h às 20h | Sábado: 8h às 13h',
      specialties: ['Fisioterapia Esportiva', 'RPG', 'Pilates', 'Dry Needling', 'Reabilitação Pós-Operatória', 'Tratamento de Coluna'],
      services: [
        {
          id: '1',
          title: 'Fisioterapia Esportiva',
          description: 'Tratamento especializado para atletas, focado em recuperação de lesões e prevenção.'
        },
        {
          id: '2',
          title: 'RPG - Reeducação Postural Global',
          description: 'Método que trata desvios posturais e dores crônicas através de posturas específicas.'
        },
        {
          id: '3',
          title: 'Pilates Clínico',
          description: 'Exercícios personalizados para fortalecimento e reabilitação.'
        },
        {
          id: '4',
          title: 'Dry Needling',
          description: 'Técnica de agulhamento seco para tratamento de pontos-gatilho musculares.'
        },
        {
          id: '5',
          title: 'Reabilitação de Coluna',
          description: 'Tratamento especializado para hérnias de disco, escoliose e dores lombares.'
        },
        {
          id: '6',
          title: 'Recuperação Pós-Cirúrgica',
          description: 'Protocolo de reabilitação após cirurgias ortopédicas.'
        }
      ],
      testimonials: [
        {
          id: '1',
          author: 'Carlos Almeida',
          content: 'O Dr. Ricardo é excepcional! Me recuperou de uma lesão no joelho em tempo recorde. Voltei a correr mais forte do que antes.',
          rating: 5
        },
        {
          id: '2',
          author: 'Ana Paula Rodrigues',
          content: 'Profissional extremamente competente! O tratamento de RPG melhorou muito minha postura e acabou com minhas dores nas costas.',
          rating: 5
        },
        {
          id: '3',
          author: 'Pedro Santos',
          content: 'Excelente fisioterapeuta! Me ajudou na recuperação pós-cirúrgica do ombro. Recomendo muito!',
          rating: 5
        }
      ],
      faqs: [
        {
          id: '1',
          question: 'Quantas sessões são necessárias?',
          answer: 'Depende da lesão e do caso específico. Geralmente, os pacientes começam a sentir melhora nas primeiras 3-5 sessões.'
        },
        {
          id: '2',
          question: 'O tratamento é coberto por planos de saúde?',
          answer: 'Sim, trabalhamos com reembolso pelos principais planos de saúde.'
        },
        {
          id: '3',
          question: 'Quanto tempo dura cada sessão?',
          answer: 'Cada sessão tem duração de 50 minutos a 1 hora.'
        }
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop&q=80'
      ],
      social_instagram: 'https://instagram.com/drricardomendsfisio',
      social_whatsapp: '5511976543210',
      active: true,
      featured: true,
    },
  })

  const professional3 = await prisma.professional.upsert({
    where: { slug: 'dra-ana-paula-costa' },
    update: {},
    create: {
      name: 'Dra. Ana Paula Costa',
      slug: 'dra-ana-paula-costa',
      title: 'Dermatologista',
      specialty: 'Dermatologia Clínica e Estética',
      bio: `Médica dermatologista com mais de 10 anos de experiência. Especialista em tratamentos estéticos faciais e corporais, acne, envelhecimento cutâneo e doenças da pele.

Utilizo as tecnologias mais avançadas para proporcionar resultados naturais e eficazes, sempre respeitando as características individuais de cada paciente.`,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=600&fit=crop&q=80',
      cover_image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop&q=80',
      email: 'ana.costa@dermoclinica.com.br',
      phone: '(11) 96543-2109',
      address: 'Av. Brigadeiro Faria Lima, 3000 - Itaim Bibi, São Paulo - SP, 01451-000',
      city: 'São Paulo',
      state: 'SP',
      working_hours: 'Segunda a Sexta: 9h às 19h',
      specialties: ['Botox', 'Preenchimento', 'Lasers', 'Peeling', 'Tratamento de Acne', 'Bioestimuladores'],
      services: [
        {
          id: '1',
          title: 'Toxina Botulínica (Botox)',
          description: 'Suavização de rugas e linhas de expressão com resultados naturais.'
        },
        {
          id: '2',
          title: 'Preenchimento com Ácido Hialurônico',
          description: 'Restauração de volume facial e tratamento de sulcos.'
        },
        {
          id: '3',
          title: 'Laser CO2 Fracionado',
          description: 'Rejuvenescimento facial, tratamento de cicatrizes e manchas.'
        },
        {
          id: '4',
          title: 'Tratamento de Acne',
          description: 'Protocolo completo para controle e tratamento de acne.'
        },
        {
          id: '5',
          title: 'Peeling Químico',
          description: 'Renovação celular para pele mais jovem e uniforme.'
        },
        {
          id: '6',
          title: 'Bioestimuladores de Colágeno',
          description: 'Estímulo natural de colágeno para rejuvenescimento.'
        }
      ],
      testimonials: [
        {
          id: '1',
          author: 'Fernanda Lima',
          content: 'A Dra. Ana Paula tem mãos de fada! Fiz botox e preenchimento e o resultado ficou super natural. Ela entende exatamente o que cada paciente precisa.',
          rating: 5
        },
        {
          id: '2',
          author: 'Juliana Costa',
          content: 'Melhor dermatologista que já consultei! O tratamento a laser para manchas foi perfeito. Minha pele está impecável!',
          rating: 5
        },
        {
          id: '3',
          author: 'Beatriz Oliveira',
          content: 'Fiz tratamento de acne com a Dra. Ana e os resultados superaram minhas expectativas. Muito profissional e atenciosa!',
          rating: 5
        }
      ],
      faqs: [
        {
          id: '1',
          question: 'Quanto tempo dura o efeito do botox?',
          answer: 'O efeito do botox dura em média de 4 a 6 meses, variando de acordo com cada paciente.'
        },
        {
          id: '2',
          question: 'O preenchimento fica natural?',
          answer: 'Sim! Trabalho sempre buscando resultados naturais, respeitando a harmonia facial de cada pessoa.'
        },
        {
          id: '3',
          question: 'Há tempo de recuperação após os procedimentos?',
          answer: 'A maioria dos procedimentos não exige afastamento. Pode haver leve vermelhidão que desaparece em poucas horas.'
        }
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1629909615957-be38e7b90ecc?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400&h=300&fit=crop&q=80'
      ],
      social_instagram: 'https://instagram.com/draanapcosta',
      social_facebook: 'https://facebook.com/draanapcosta',
      social_whatsapp: '5511965432109',
      active: true,
      featured: false,
    },
  })

  console.log('✅ Professionals created:', {
    professional1: professional1.name,
    professional2: professional2.name,
    professional3: professional3.name,
  })

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

