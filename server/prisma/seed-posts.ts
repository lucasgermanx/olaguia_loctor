import { PrismaClient, PostTheme, PostPosition } from "@prisma/client"

const prisma = new PrismaClient()

// Função para gerar slug a partir do título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Posts fictícios organizados por tema
const postsData = [
  // HERO - Posts em destaque para o carousel principal
  {
    title: "Descubra os Segredos da Gastronomia Brasileira: Receitas Tradicionais que Vão Encantar Seu Paladar",
    excerpt: "Explore as delícias da culinária brasileira com receitas autênticas que passam de geração em geração.",
    content: `<p>A gastronomia brasileira é uma das mais ricas e diversas do mundo, resultado da mistura de culturas indígenas, africanas e europeias. Neste artigo, vamos explorar receitas tradicionais que fazem parte da nossa identidade cultural.</p>
    
    <h2>Feijoada Completa</h2>
    <p>A feijoada é considerada o prato nacional do Brasil. Originária da época da escravidão, era preparada com os cortes de carne menos nobres, como orelha, pé e rabo de porco. Hoje, é um prato festivo que reúne família e amigos.</p>
    
    <h2>Moqueca de Peixe</h2>
    <p>Originária do litoral brasileiro, a moqueca é um cozido de peixe com leite de coco, dendê e temperos frescos. Cada região tem sua variação, mas todas são igualmente deliciosas.</p>
    
    <h2>Pão de Açúcar e a História do Rio</h2>
    <p>Além da comida, a gastronomia brasileira está intimamente ligada à nossa história e cultura. Cada prato conta uma história, cada receita preserva uma memória.</p>`,
    theme: PostTheme.HERO,
    position: PostPosition.MAIN,
    category: "Gastronomia",
    tags: ["receitas", "culinária brasileira", "tradição"],
    featured_image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop",
  },
  {
    title: "Tendências de Negócios em 2024: Como Empreender com Sucesso no Mercado Digital",
    excerpt: "Descubra as principais tendências e estratégias para empreender com sucesso no mundo digital.",
    content: `<p>O mercado digital está em constante evolução, e 2024 traz novas oportunidades para empreendedores. Neste artigo, vamos explorar as principais tendências e como você pode se posicionar para o sucesso.</p>
    
    <h2>E-commerce e Marketplace</h2>
    <p>O comércio eletrônico continua crescendo, mas agora com foco em marketplaces especializados e nichos específicos. A personalização e experiência do cliente são fundamentais.</p>
    
    <h2>Automação e IA</h2>
    <p>A inteligência artificial está revolucionando a forma como fazemos negócios. Desde chatbots até análise de dados, a IA pode otimizar processos e melhorar resultados.</p>
    
    <h2>Sustentabilidade</h2>
    <p>Consumidores estão cada vez mais conscientes sobre sustentabilidade. Negócios que incorporam práticas sustentáveis têm vantagem competitiva no mercado.</p>`,
    theme: PostTheme.HERO,
    position: PostPosition.MAIN,
    category: "Empresas & Negócios",
    tags: ["empreendedorismo", "negócios", "tendências"],
    featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
  },
  {
    title: "Bem-Estar e Saúde Mental: Dicas Essenciais para uma Vida Mais Equilibrada",
    excerpt: "Aprenda estratégias práticas para cuidar da sua saúde mental e alcançar um equilíbrio saudável na vida.",
    content: `<p>Em um mundo cada vez mais acelerado, cuidar da saúde mental se tornou essencial. Neste artigo, vamos compartilhar dicas práticas para manter o equilíbrio emocional.</p>
    
    <h2>Meditação e Mindfulness</h2>
    <p>A prática regular de meditação pode reduzir significativamente o estresse e a ansiedade. Comece com apenas 5 minutos por dia e vá aumentando gradualmente.</p>
    
    <h2>Exercícios Físicos</h2>
    <p>A atividade física libera endorfinas, conhecidas como hormônios da felicidade. Encontre uma atividade que você goste e pratique regularmente.</p>
    
    <h2>Rede de Apoio</h2>
    <p>Manter conexões sociais saudáveis é fundamental para o bem-estar mental. Invista tempo em relacionamentos significativos.</p>`,
    theme: PostTheme.HERO,
    position: PostPosition.MAIN,
    category: "Nossa Saúde",
    tags: ["saúde mental", "bem-estar", "equilíbrio"],
    featured_image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=800&fit=crop",
  },

  // EM DESTAQUE
  {
    title: "Inovação Tecnológica: Como a IA Está Transformando os Negócios",
    excerpt: "Entenda como a inteligência artificial está revolucionando diferentes setores da economia.",
    content: `<p>A inteligência artificial não é mais ficção científica - é uma realidade que está transformando empresas de todos os tamanhos.</p>`,
    theme: PostTheme.EM_DESTAQUE,
    position: PostPosition.MAIN,
    category: "Empresas & Negócios",
    tags: ["tecnologia", "IA", "inovação"],
    featured_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
  },
  {
    title: "Rotina de Skincare: Passo a Passo para uma Pele Radiante",
    excerpt: "Descubra os segredos de uma rotina de cuidados com a pele que realmente funciona.",
    content: `<p>Uma rotina de skincare bem estruturada pode fazer toda a diferença na aparência e saúde da sua pele.</p>`,
    theme: PostTheme.EM_DESTAQUE,
    position: PostPosition.SIDE,
    category: "Estética & Beleza",
    tags: ["skincare", "beleza", "cuidados"],
    featured_image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=600&fit=crop",
  },
  {
    title: "Receitas Rápidas e Saborosas para o Dia a Dia",
    excerpt: "Pratos deliciosos que você pode preparar em menos de 30 minutos.",
    content: `<p>Não precisa de muito tempo para preparar refeições incríveis. Confira essas receitas práticas!</p>`,
    theme: PostTheme.EM_DESTAQUE,
    position: PostPosition.SIDE,
    category: "Gastronomia",
    tags: ["receitas rápidas", "culinária"],
    featured_image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
  },
  {
    title: "Exercícios em Casa: Mantenha-se Ativo Sem Sair de Casa",
    excerpt: "Treinos eficazes que você pode fazer no conforto da sua casa.",
    content: `<p>Manter-se ativo é essencial, mesmo sem acesso à academia. Veja como treinar em casa!</p>`,
    theme: PostTheme.EM_DESTAQUE,
    position: PostPosition.SIDE,
    category: "Nossa Saúde",
    tags: ["exercícios", "fitness", "saúde"],
    featured_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
  },

  // PARA REFLEXÃO
  {
    title: "O Poder da Gratidão: Como Praticar e Transformar Sua Vida",
    excerpt: "Descubra como a gratidão pode transformar sua perspectiva e melhorar sua qualidade de vida.",
    content: `<p>A gratidão é uma das práticas mais poderosas para transformar nossa mentalidade e atrair mais positividade para nossas vidas.</p>`,
    theme: PostTheme.PARA_REFLEXAO,
    position: null,
    category: "Para Reflexão",
    tags: ["gratidão", "desenvolvimento pessoal"],
    featured_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
  },
  {
    title: "Resiliência: A Arte de Se Levantar Após as Quedas",
    excerpt: "Aprenda a desenvolver resiliência e enfrentar os desafios da vida com mais força.",
    content: `<p>A resiliência não é sobre nunca cair, mas sobre sempre se levantar. Descubra como desenvolver essa habilidade.</p>`,
    theme: PostTheme.PARA_REFLEXAO,
    position: null,
    category: "Para Reflexão",
    tags: ["resiliência", "crescimento pessoal"],
    featured_image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop",
  },
  {
    title: "Mindfulness no Trabalho: Reduzindo o Estresse Diário",
    excerpt: "Técnicas práticas de mindfulness para aplicar no seu ambiente de trabalho.",
    content: `<p>O estresse no trabalho é comum, mas não precisa ser inevitável. Aprenda técnicas de mindfulness.</p>`,
    theme: PostTheme.PARA_REFLEXAO,
    position: null,
    category: "Para Reflexão",
    tags: ["mindfulness", "estresse", "trabalho"],
    featured_image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop",
  },
  {
    title: "O Valor do Tempo: Aprenda a Priorizar o que Realmente Importa",
    excerpt: "Reflita sobre como você está usando seu tempo e descubra formas de priorizar o essencial.",
    content: `<p>O tempo é nosso recurso mais valioso. Aprenda a usá-lo de forma mais inteligente e significativa.</p>`,
    theme: PostTheme.PARA_REFLEXAO,
    position: null,
    category: "Para Reflexão",
    tags: ["tempo", "produtividade", "prioridades"],
    featured_image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop",
  },
  {
    title: "Autocompaixão: Seja Gentil Consigo Mesmo",
    excerpt: "Aprenda a praticar autocompaixão e transforme sua relação com você mesmo.",
    content: `<p>Muitas vezes somos nossos piores críticos. Aprenda a ser gentil consigo mesmo.</p>`,
    theme: PostTheme.PARA_REFLEXAO,
    position: null,
    category: "Para Reflexão",
    tags: ["autocompaixão", "bem-estar"],
    featured_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
  },
  {
    title: "Propósito de Vida: Encontrando Seu Caminho",
    excerpt: "Reflita sobre seu propósito e descubra como alinhar suas ações com seus valores.",
    content: `<p>Ter um propósito claro dá direção e significado à nossa vida. Descubra o seu.</p>`,
    theme: PostTheme.PARA_REFLEXAO,
    position: null,
    category: "Para Reflexão",
    tags: ["propósito", "vida", "valores"],
    featured_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
  },

  // NOSSA SAÚDE
  {
    title: "Alimentação Saudável: Guia Completo para Iniciantes",
    excerpt: "Aprenda os fundamentos de uma alimentação saudável e equilibrada.",
    content: `<p>Uma alimentação saudável é a base para uma vida longa e com qualidade. Descubra os fundamentos.</p>`,
    theme: PostTheme.NOSSA_SAUDE,
    position: PostPosition.MAIN,
    category: "Nossa Saúde",
    tags: ["alimentação", "saúde", "nutrição"],
    featured_image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=800&fit=crop",
  },
  {
    title: "Benefícios da Hidratação: Por que Beber Água é Essencial",
    excerpt: "Entenda a importância da hidratação adequada para sua saúde.",
    content: `<p>A água é essencial para o funcionamento do nosso corpo. Descubra por quê.</p>`,
    theme: PostTheme.NOSSA_SAUDE,
    position: PostPosition.SIDE,
    category: "Nossa Saúde",
    tags: ["hidratação", "saúde"],
    featured_image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=600&fit=crop",
  },
  {
    title: "Sono de Qualidade: Dicas para Dormir Melhor",
    excerpt: "Melhore a qualidade do seu sono com essas dicas práticas e eficazes.",
    content: `<p>Um bom sono é fundamental para a saúde física e mental. Aprenda a melhorar sua qualidade de sono.</p>`,
    theme: PostTheme.NOSSA_SAUDE,
    position: PostPosition.SIDE,
    category: "Nossa Saúde",
    tags: ["sono", "saúde", "bem-estar"],
    featured_image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop",
  },
  {
    title: "Prevenção de Doenças: Hábitos que Fazem a Diferença",
    excerpt: "Conheça os hábitos que podem prevenir doenças e melhorar sua qualidade de vida.",
    content: `<p>A prevenção é sempre melhor que a cura. Descubra hábitos que fazem diferença.</p>`,
    theme: PostTheme.NOSSA_SAUDE,
    position: PostPosition.SIDE,
    category: "Nossa Saúde",
    tags: ["prevenção", "saúde"],
    featured_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
  },
  {
    title: "Atividade Física Regular: Benefícios Além da Estética",
    excerpt: "Descubra todos os benefícios da prática regular de exercícios físicos.",
    content: `<p>Os exercícios físicos vão muito além da estética. Descubra todos os benefícios.</p>`,
    theme: PostTheme.NOSSA_SAUDE,
    position: PostPosition.SIDE,
    category: "Nossa Saúde",
    tags: ["exercícios", "fitness", "saúde"],
    featured_image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
  },

  // SOBRE RELACIONAMENTOS
  {
    title: "Comunicação Eficaz: A Base de Relacionamentos Saudáveis",
    excerpt: "Aprenda a se comunicar melhor e fortalecer seus relacionamentos.",
    content: `<p>A comunicação é a base de qualquer relacionamento saudável. Aprenda técnicas eficazes.</p>`,
    theme: PostTheme.SOBRE_RELACIONAMENTOS,
    position: null,
    category: "Sobre Relacionamentos",
    tags: ["comunicação", "relacionamentos"],
    featured_image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop",
  },
  {
    title: "Inteligência Emocional nos Relacionamentos",
    excerpt: "Desenvolva sua inteligência emocional para relacionamentos mais harmoniosos.",
    content: `<p>A inteligência emocional é fundamental para relacionamentos saudáveis e duradouros.</p>`,
    theme: PostTheme.SOBRE_RELACIONAMENTOS,
    position: null,
    category: "Sobre Relacionamentos",
    tags: ["inteligência emocional", "relacionamentos"],
    featured_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
  },
  {
    title: "Limites Saudáveis: Como Estabelecer e Respeitar",
    excerpt: "Aprenda a estabelecer limites saudáveis em seus relacionamentos.",
    content: `<p>Limites saudáveis são essenciais para relacionamentos equilibrados e respeitosos.</p>`,
    theme: PostTheme.SOBRE_RELACIONAMENTOS,
    position: null,
    category: "Sobre Relacionamentos",
    tags: ["limites", "relacionamentos"],
    featured_image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=800&fit=crop",
  },
  {
    title: "Amizades que Inspiram: Como Cultivar Relacionamentos Significativos",
    excerpt: "Descubra como cultivar amizades verdadeiras e significativas.",
    content: `<p>Amizades verdadeiras são um dos maiores tesouros da vida. Aprenda a cultivá-las.</p>`,
    theme: PostTheme.SOBRE_RELACIONAMENTOS,
    position: null,
    category: "Sobre Relacionamentos",
    tags: ["amizade", "relacionamentos"],
    featured_image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop",
  },

  // EMPRESAS & NEGÓCIOS
  {
    title: "Marketing Digital: Estratégias que Funcionam em 2024",
    excerpt: "Descubra as melhores estratégias de marketing digital para seu negócio.",
    content: `<p>O marketing digital está em constante evolução. Conheça as estratégias que funcionam hoje.</p>`,
    theme: PostTheme.EMPRESAS_NEGOCIOS,
    position: PostPosition.MAIN,
    category: "Empresas & Negócios",
    tags: ["marketing", "negócios", "digital"],
    featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
  },
  {
    title: "Gestão de Equipes: Liderança Eficaz no Século XXI",
    excerpt: "Aprenda técnicas modernas de liderança e gestão de equipes.",
    content: `<p>A liderança moderna requer habilidades diferentes. Descubra como liderar com eficácia.</p>`,
    theme: PostTheme.EMPRESAS_NEGOCIOS,
    position: PostPosition.MAIN,
    category: "Empresas & Negócios",
    tags: ["liderança", "gestão", "equipes"],
    featured_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
  },
  {
    title: "Finanças Pessoais: Como Organizar Suas Finanças",
    excerpt: "Dicas práticas para organizar suas finanças pessoais e alcançar seus objetivos.",
    content: `<p>Organizar as finanças pessoais é o primeiro passo para a liberdade financeira.</p>`,
    theme: PostTheme.EMPRESAS_NEGOCIOS,
    position: PostPosition.MAIN,
    category: "Empresas & Negócios",
    tags: ["finanças", "organização"],
    featured_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
  },
  {
    title: "Networking Eficaz: Construa Relacionamentos Profissionais",
    excerpt: "Aprenda a fazer networking de forma autêntica e eficaz.",
    content: `<p>O networking é essencial para o crescimento profissional. Aprenda a fazer de forma eficaz.</p>`,
    theme: PostTheme.EMPRESAS_NEGOCIOS,
    position: PostPosition.SIDE,
    category: "Empresas & Negócios",
    tags: ["networking", "carreira"],
    featured_image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
  },
  {
    title: "Produtividade no Trabalho: Técnicas Comprovadas",
    excerpt: "Aumente sua produtividade no trabalho com essas técnicas comprovadas.",
    content: `<p>Ser produtivo não é sobre trabalhar mais, mas sobre trabalhar melhor.</p>`,
    theme: PostTheme.EMPRESAS_NEGOCIOS,
    position: PostPosition.SIDE,
    category: "Empresas & Negócios",
    tags: ["produtividade", "trabalho"],
    featured_image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
  },
  {
    title: "Inovação em Startups: Como Pensar Fora da Caixa",
    excerpt: "Descubra como promover inovação em sua startup ou empresa.",
    content: `<p>A inovação é o diferencial competitivo das empresas de sucesso.</p>`,
    theme: PostTheme.EMPRESAS_NEGOCIOS,
    position: PostPosition.SIDE,
    category: "Empresas & Negócios",
    tags: ["inovação", "startups"],
    featured_image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  },

  // ESTÉTICA & BELEZA
  {
    title: "Maquiagem Natural: Tutorial Passo a Passo",
    excerpt: "Aprenda a fazer uma maquiagem natural e elegante para o dia a dia.",
    content: `<p>Uma maquiagem natural realça sua beleza sem exageros. Aprenda o passo a passo.</p>`,
    theme: PostTheme.ESTETICA_BELEZA,
    position: null,
    category: "Estética & Beleza",
    tags: ["maquiagem", "beleza"],
    featured_image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
  },
  {
    title: "Cuidados com os Cabelos: Rotina Completa",
    excerpt: "Descubra a rotina ideal de cuidados para cabelos saudáveis e brilhantes.",
    content: `<p>Uma rotina adequada de cuidados pode transformar seus cabelos.</p>`,
    theme: PostTheme.ESTETICA_BELEZA,
    position: null,
    category: "Estética & Beleza",
    tags: ["cabelos", "beleza"],
    featured_image: "https://images.unsplash.com/photo-1522338242992-e1a48506a862?w=800&h=600&fit=crop",
  },
  {
    title: "Tendências de Moda 2024: O que Está em Alta",
    excerpt: "Conheça as principais tendências de moda para 2024.",
    content: `<p>Fique por dentro das tendências que vão dominar o guarda-roupa em 2024.</p>`,
    theme: PostTheme.ESTETICA_BELEZA,
    position: null,
    category: "Estética & Beleza",
    tags: ["moda", "tendências"],
    featured_image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
  },
  {
    title: "Unhas Decoradas: Inspirações e Tutoriais",
    excerpt: "Ideias criativas para decorar suas unhas e expressar seu estilo.",
    content: `<p>Unhas decoradas são uma forma de expressar personalidade e estilo.</p>`,
    theme: PostTheme.ESTETICA_BELEZA,
    position: null,
    category: "Estética & Beleza",
    tags: ["unhas", "beleza"],
    featured_image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop",
  },
  {
    title: "Perfumes: Como Escolher o Aroma Perfeito",
    excerpt: "Guia completo para escolher perfumes que combinam com você.",
    content: `<p>O perfume certo pode ser sua assinatura pessoal. Aprenda a escolher.</p>`,
    theme: PostTheme.ESTETICA_BELEZA,
    position: null,
    category: "Estética & Beleza",
    tags: ["perfumes", "beleza"],
    featured_image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop",
  },
  {
    title: "Massagem Facial: Técnicas de Autocuidado",
    excerpt: "Aprenda técnicas de massagem facial para relaxar e rejuvenescer.",
    content: `<p>A massagem facial pode fazer maravilhas pela sua pele e bem-estar.</p>`,
    theme: PostTheme.ESTETICA_BELEZA,
    position: null,
    category: "Estética & Beleza",
    tags: ["massagem", "autocuidado"],
    featured_image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop",
  },

  // RINDO À TOA
  {
    title: "Piadas que Vão Te Fazer Rir: Seleção Especial",
    excerpt: "Uma seleção de piadas para alegrar seu dia e espalhar boas risadas.",
    content: `<p>O riso é o melhor remédio! Confira essas piadas que vão te fazer rir.</p>`,
    theme: PostTheme.RINDO_A_TOA,
    position: PostPosition.SIDE,
    category: "Rindo à Toa",
    tags: ["humor", "piadas"],
    featured_image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  },
  {
    title: "Memes do Momento: O que Está Bombando nas Redes",
    excerpt: "Confira os memes mais engraçados que estão circulando nas redes sociais.",
    content: `<p>Os memes são a linguagem da internet. Veja os que estão fazendo sucesso.</p>`,
    theme: PostTheme.RINDO_A_TOA,
    position: PostPosition.SIDE,
    category: "Rindo à Toa",
    tags: ["memes", "humor"],
    featured_image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
  },
  {
    title: "Histórias Engraçadas do Dia a Dia",
    excerpt: "Situações hilárias que acontecem no nosso cotidiano e nos fazem rir.",
    content: `<p>Às vezes, as melhores histórias são as que acontecem no dia a dia.</p>`,
    theme: PostTheme.RINDO_A_TOA,
    position: PostPosition.SIDE,
    category: "Rindo à Toa",
    tags: ["humor", "histórias"],
    featured_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
  },

  // QUEBRA CUCA
  {
    title: "Desafios de Lógica: Teste Seu Raciocínio",
    excerpt: "Quebra-cabeças e desafios de lógica para exercitar sua mente.",
    content: `<p>Exercite seu cérebro com esses desafios de lógica e raciocínio.</p>`,
    theme: PostTheme.QUEBRA_CUCA,
    position: PostPosition.SIDE,
    category: "Quebra Cuca",
    tags: ["lógica", "desafios"],
    featured_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
  },
  {
    title: "Palavras Cruzadas: Dicas e Estratégias",
    excerpt: "Aprenda estratégias para resolver palavras cruzadas como um expert.",
    content: `<p>As palavras cruzadas são um ótimo exercício mental. Aprenda estratégias.</p>`,
    theme: PostTheme.QUEBRA_CUCA,
    position: PostPosition.SIDE,
    category: "Quebra Cuca",
    tags: ["palavras cruzadas", "desafios"],
    featured_image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop",
  },
  {
    title: "Sudoku: Guia Completo para Iniciantes",
    excerpt: "Aprenda a jogar sudoku e desenvolva sua capacidade de raciocínio lógico.",
    content: `<p>O sudoku é um jogo que exercita o cérebro e é muito divertido.</p>`,
    theme: PostTheme.QUEBRA_CUCA,
    position: PostPosition.SIDE,
    category: "Quebra Cuca",
    tags: ["sudoku", "desafios"],
    featured_image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop",
  },

  // GASTRONOMIA
  {
    title: "Sobremesas Brasileiras: Receitas Tradicionais",
    excerpt: "Delicie-se com as melhores receitas de sobremesas brasileiras.",
    content: `<p>As sobremesas brasileiras são únicas e deliciosas. Aprenda a fazer as tradicionais.</p>`,
    theme: PostTheme.GASTRONOMIA,
    position: null,
    category: "Gastronomia",
    tags: ["sobremesas", "receitas"],
    featured_image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&h=800&fit=crop",
  },
  {
    title: "Café da Manhã Completo: Ideias Nutritivas",
    excerpt: "Inspirações para um café da manhã nutritivo e saboroso.",
    content: `<p>Comece o dia com energia com essas ideias de café da manhã.</p>`,
    theme: PostTheme.GASTRONOMIA,
    position: null,
    category: "Gastronomia",
    tags: ["café da manhã", "receitas"],
    featured_image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&h=800&fit=crop",
  },
  {
    title: "Culinária Vegetariana: Receitas Saborosas",
    excerpt: "Descubra receitas vegetarianas deliciosas e nutritivas.",
    content: `<p>A culinária vegetariana pode ser muito saborosa e nutritiva.</p>`,
    theme: PostTheme.GASTRONOMIA,
    position: null,
    category: "Gastronomia",
    tags: ["vegetariano", "receitas"],
    featured_image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=800&fit=crop",
  },

  // SUPER DICAS
  {
    title: "Organização da Casa: Dicas Práticas e Eficazes",
    excerpt: "Aprenda técnicas de organização que vão transformar sua casa.",
    content: `<p>Uma casa organizada traz paz e bem-estar. Aprenda técnicas práticas.</p>`,
    theme: PostTheme.SUPER_DICAS,
    position: PostPosition.MAIN,
    category: "Super Dicas",
    tags: ["organização", "casa"],
    featured_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop",
  },
  {
    title: "Economia Doméstica: Como Reduzir Gastos",
    excerpt: "Dicas práticas para economizar no dia a dia e melhorar suas finanças.",
    content: `<p>Pequenas mudanças podem gerar grandes economias. Descubra como.</p>`,
    theme: PostTheme.SUPER_DICAS,
    position: PostPosition.SIDE,
    category: "Super Dicas",
    tags: ["economia", "finanças"],
    featured_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
  },
  {
    title: "Produtividade no Home Office: Dicas Essenciais",
    excerpt: "Como ser produtivo trabalhando de casa: dicas práticas e eficazes.",
    content: `<p>Trabalhar de casa requer disciplina e organização. Aprenda técnicas eficazes.</p>`,
    theme: PostTheme.SUPER_DICAS,
    position: PostPosition.SIDE,
    category: "Super Dicas",
    tags: ["home office", "produtividade"],
    featured_image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop",
  },
  {
    title: "Limpeza Rápida: Técnicas para Manter a Casa Limpa",
    excerpt: "Métodos eficientes para manter sua casa sempre limpa e organizada.",
    content: `<p>Manter a casa limpa não precisa ser um trabalho árduo. Aprenda técnicas rápidas.</p>`,
    theme: PostTheme.SUPER_DICAS,
    position: PostPosition.SIDE,
    category: "Super Dicas",
    tags: ["limpeza", "casa"],
    featured_image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
  },
]

async function main() {
  console.log("🌱 Seeding posts...")

  // Buscar ou criar usuário admin
  let user = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  })

  if (!user) {
    // Se não houver admin, buscar qualquer usuário
    user = await prisma.user.findFirst()
    if (!user) {
      console.error("❌ Nenhum usuário encontrado. Por favor, crie um usuário primeiro.")
      return
    }
  }

  console.log(`✅ Usando usuário: ${user.name} (${user.email})`)

  // Criar categorias se não existirem
  const categoryMap = new Map<string, string>()

  const categories = [
    "Gastronomia",
    "Empresas & Negócios",
    "Nossa Saúde",
    "Para Reflexão",
    "Sobre Relacionamentos",
    "Estética & Beleza",
    "Rindo à Toa",
    "Quebra Cuca",
    "Super Dicas",
  ]

  for (const categoryName of categories) {
    const slug = generateSlug(categoryName)
    let category = await prisma.category.findUnique({
      where: { slug },
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug,
          description: `Categoria sobre ${categoryName.toLowerCase()}`,
        },
      })
      console.log(`✅ Criada categoria: ${categoryName}`)
    } else {
      console.log(`ℹ️  Categoria já existe: ${categoryName}`)
    }

    categoryMap.set(categoryName, category.id)
  }

  // Criar tags se não existirem
  const tagMap = new Map<string, string>()

  const allTags = new Set<string>()
  postsData.forEach((post) => {
    post.tags?.forEach((tag) => allTags.add(tag))
  })

  for (const tagName of allTags) {
    const slug = generateSlug(tagName)
    let tag = await prisma.tag.findUnique({
      where: { slug },
    })

    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: tagName,
          slug,
        },
      })
    }

    tagMap.set(tagName, tag.id)
  }

  // Criar posts
  let createdCount = 0
  let skippedCount = 0

  for (const postData of postsData) {
    const slug = generateSlug(postData.title)

    // Verificar se o post já existe
    const existing = await prisma.post.findUnique({
      where: { slug },
    })

    if (existing) {
      console.log(`⏭️  Post já existe: ${postData.title}`)
      skippedCount++
      continue
    }

    const categoryId = categoryMap.get(postData.category)
    if (!categoryId) {
      console.error(`❌ Categoria não encontrada: ${postData.category}`)
      continue
    }

    // Criar o post
    const post = await prisma.post.create({
      data: {
        title: postData.title,
        slug,
        excerpt: postData.excerpt,
        content: postData.content,
        featured_image: postData.featured_image,
        published: true,
        published_at: new Date(),
        author_id: user.id,
        category_id: categoryId,
        theme: postData.theme,
        position: postData.position,
        order: 0,
        featured: postData.theme === PostTheme.HERO || postData.theme === PostTheme.EM_DESTAQUE,
        tags: {
          create: postData.tags?.map((tagName) => ({
            tag: {
              connect: {
                id: tagMap.get(tagName)!,
              },
            },
          })),
        },
      },
    })

    console.log(`✅ Criado post: ${postData.title} (${postData.theme})`)
    createdCount++
  }

  console.log(`\n📊 Resumo:`)
  console.log(`   ✅ Posts criados: ${createdCount}`)
  console.log(`   ⏭️  Posts ignorados: ${skippedCount}`)
  console.log(`   📝 Total processado: ${postsData.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

