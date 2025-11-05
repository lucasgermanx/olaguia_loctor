// Função para gerar URLs de imagens placeholder
export function getPlaceholderImage(width: number, height: number, category?: string): string {
  const categories: Record<string, string> = {
    car: "car",
    business: "business",
    health: "health",
    food: "food",
    beauty: "beauty",
    office: "office",
    people: "people",
    reflection: "nature",
    cartoon: "cartoon",
  }
  
  const cat = category ? categories[category] || "random" : "random"
  // Usando placeholder.com com categorias
  return `https://placehold.co/${width}x${height}/e5e7eb/9ca3af?text=${cat}`
}

// URLs específicas para diferentes tipos de imagens
export const placeholderImages = {
  hero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
  car: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
  business: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop",
  health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
  food: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
  beauty: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=600&fit=crop",
  office: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  couple: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
  boy: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
  reflection: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  cartoon: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
}

