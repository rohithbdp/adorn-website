export const getGalleryAltText = (category: string, index: number): string => {
  const altTexts = {
    firstbirthday: [
      'Adorable baby enjoying their first birthday cake with colorful decorations',
      'Joyful family celebrating baby\'s first birthday milestone',
      'Beautiful first birthday party setup with balloons and themed decorations',
      'Baby\'s reaction to birthday cake during smash cake session',
      'Parents with their one-year-old during birthday celebration',
      'Candid moment of birthday child playing with party guests',
      'Professional portrait of one-year-old in birthday outfit',
      'Family group photo at first birthday party celebration',
      'Close-up of baby\'s expressions during birthday festivities'
    ],
    musicconcert: [
      'Dynamic shot of musicians performing on stage with dramatic lighting',
      'Crowd enjoying live music performance at concert venue',
      'Solo artist performing with guitar under stage lights',
      'Behind-the-scenes preparation before concert performance',
      'Audience engagement during energetic musical performance',
      'Close-up of instruments and musicians during live show',
      'Wide angle view of concert stage and enthusiastic crowd'
    ],
    familysession: [
      'Multi-generational family portrait in natural outdoor setting',
      'Candid moment of family laughing together during photo session',
      'Parents with children in coordinated outfits for family photos',
      'Lifestyle family photography capturing genuine interactions'
    ],
    housewarming: [
      'Elegant home interior decorated for housewarming celebration',
      'Guests mingling at beautifully decorated housewarming party',
      'Traditional housewarming ceremony with family and friends',
      'New homeowners welcoming guests at entrance',
      'Festive table setup for housewarming dinner party',
      'Group photo of friends celebrating new home',
      'Candid moments of joy during housewarming festivities',
      'Beautiful floral arrangements for housewarming event',
      'Traditional lamp lighting ceremony at new home',
      'Outdoor patio area prepared for housewarming guests',
      'Happy homeowners cutting ceremonial ribbon'
    ],
    maternity: [
      'Expectant mother in flowing dress during golden hour',
      'Intimate maternity portrait highlighting baby bump',
      'Couple embracing during outdoor maternity session',
      'Artistic silhouette of pregnant woman at sunset',
      'Mother-to-be in elegant pose for maternity photos',
      'Partner cradling baby bump during maternity shoot',
      'Beautiful outdoor maternity photography in nature',
      'Glowing expectant mother in professional portrait'
    ],
    newborn: [
      'Peaceful newborn baby wrapped in soft blankets',
      'Tiny newborn details - hands, feet, and features'
    ],
    portraits: [
      'Professional headshot portrait with natural lighting'
    ],
    wedding: [
      'Bride and groom sharing first look before ceremony',
      'Romantic couple portrait during golden hour',
      'Wedding ceremony with guests in beautiful venue',
      'Reception celebration with dancing and festivities',
      'Detail shots of wedding rings and decorations'
    ]
  };

  const categoryAltTexts = altTexts[category as keyof typeof altTexts] || [];
  return categoryAltTexts[index] || `${category.charAt(0).toUpperCase() + category.slice(1)} photography by aDorn Photography`;
};

export const getCategoryDescription = (category: string): string => {
  const descriptions = {
    firstbirthday: 'Magical first birthday celebrations captured forever',
    musicconcert: 'Live performances and musical moments in stunning detail',
    familysession: 'Authentic family moments captured in natural settings',
    housewarming: 'Celebrating new beginnings in your dream home',
    maternity: 'Beautiful maternity portraits celebrating motherhood',
    newborn: 'Precious first moments of your little one\'s journey',
    portraits: 'Professional portraits that capture your unique essence',
    wedding: 'Your love story captured in timeless wedding photography'
  };
  
  return descriptions[category as keyof typeof descriptions] || 'Professional photography services';
};