export interface RitualInfo {
  title: string;
  description: string;
  significance: string;
  steps: string[];
  region: string;
  imageUrl?: string;
}

export interface CulturalTradition {
  name: string;
  description: string;
  origin: string;
  practices: string[];
  modernAdaptations: string[];
}

class CulturalService {
  private readonly WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/api/rest_v1';
  private readonly WIKIPEDIA_SEARCH_API = 'https://en.wikipedia.org/w/api.php';

  // Get information about Indian wedding rituals from Wikipedia
  async getRitualInfo(ritualName: string): Promise<RitualInfo | null> {
    try {
      // First, search for the ritual
      const searchResponse = await fetch(
        `${this.WIKIPEDIA_SEARCH_API}?action=query&format=json&list=search&srsearch=${encodeURIComponent(ritualName + ' Indian wedding ritual')}&origin=*`
      );
      
      const searchData = await searchResponse.json();
      
      if (!searchData.query?.search?.length) {
        return this.getFallbackRitualInfo(ritualName);
      }

      const pageTitle = searchData.query.search[0].title;
      
      // Get page content
      const contentResponse = await fetch(
        `${this.WIKIPEDIA_API_BASE}/page/summary/${encodeURIComponent(pageTitle)}`
      );
      
      const contentData = await contentResponse.json();
      
      return {
        title: pageTitle,
        description: contentData.extract || 'No description available',
        significance: this.extractSignificance(contentData.extract),
        steps: this.extractSteps(contentData.extract),
        region: this.extractRegion(contentData.extract),
        imageUrl: contentData.thumbnail?.source,
      };
    } catch (error) {
      console.error('Get ritual info error:', error);
      return this.getFallbackRitualInfo(ritualName);
    }
  }

  // Get cultural traditions by region
  async getCulturalTraditions(region: string): Promise<CulturalTradition[]> {
    try {
      const searchQuery = `${region} wedding traditions India`;
      const response = await fetch(
        `${this.WIKIPEDIA_SEARCH_API}?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchQuery)}&origin=*&srlimit=5`
      );
      
      const data = await response.json();
      
      if (!data.query?.search?.length) {
        return this.getFallbackTraditions(region);
      }

      const traditions: CulturalTradition[] = [];
      
      for (const result of data.query.search.slice(0, 3)) {
        try {
          const contentResponse = await fetch(
            `${this.WIKIPEDIA_API_BASE}/page/summary/${encodeURIComponent(result.title)}`
          );
          
          const contentData = await contentResponse.json();
          
          traditions.push({
            name: result.title,
            description: contentData.extract || result.snippet,
            origin: region,
            practices: this.extractPractices(contentData.extract),
            modernAdaptations: this.extractModernAdaptations(contentData.extract),
          });
        } catch (error) {
          console.error('Error fetching tradition details:', error);
        }
      }
      
      return traditions.length > 0 ? traditions : this.getFallbackTraditions(region);
    } catch (error) {
      console.error('Get cultural traditions error:', error);
      return this.getFallbackTraditions(region);
    }
  }

  // Get wedding ceremony timeline for different regions
  async getWeddingTimeline(region: string): Promise<{ day: number; events: string[]; description: string }[]> {
    const timelines: Record<string, any[]> = {
      'North Indian': [
        {
          day: 1,
          events: ['Roka Ceremony', 'Ring Exchange'],
          description: 'Formal announcement of engagement between families'
        },
        {
          day: 2,
          events: ['Mehendi', 'Sangeet'],
          description: 'Henna application and musical celebration'
        },
        {
          day: 3,
          events: ['Haldi', 'Chooda Ceremony'],
          description: 'Turmeric ritual and bridal bangle ceremony'
        },
        {
          day: 4,
          events: ['Baraat', 'Wedding Ceremony', 'Pheras'],
          description: 'Groom\'s procession and main wedding rituals'
        },
        {
          day: 5,
          events: ['Reception', 'Vidaai'],
          description: 'Grand celebration and bride\'s farewell'
        }
      ],
      'South Indian': [
        {
          day: 1,
          events: ['Nischayathartham', 'Engagement'],
          description: 'Formal engagement ceremony'
        },
        {
          day: 2,
          events: ['Mehendi', 'Sangeet'],
          description: 'Henna and music celebrations'
        },
        {
          day: 3,
          events: ['Ganesha Puja', 'Haldi'],
          description: 'Prayers to Lord Ganesha and turmeric ceremony'
        },
        {
          day: 4,
          events: ['Kashi Yatra', 'Wedding Ceremony', 'Saptapadi'],
          description: 'Mock pilgrimage and sacred wedding vows'
        },
        {
          day: 5,
          events: ['Grihapravesh', 'Reception'],
          description: 'Home entry ritual and celebration'
        }
      ]
    };

    return timelines[region] || timelines['North Indian'];
  }

  private extractSignificance(text: string): string {
    // Simple extraction logic - look for sentences containing significance keywords
    const sentences = text.split('.');
    const significanceKeywords = ['significance', 'important', 'sacred', 'tradition', 'meaning'];
    
    for (const sentence of sentences) {
      if (significanceKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        return sentence.trim();
      }
    }
    
    return 'This ritual holds deep cultural and spiritual significance in Indian weddings.';
  }

  private extractSteps(text: string): string[] {
    // Look for numbered lists or step-like patterns
    const steps = text.match(/\d+\.\s[^.]+/g);
    if (steps) {
      return steps.map(step => step.replace(/^\d+\.\s/, ''));
    }
    
    // Fallback: split by common step indicators
    const sentences = text.split(/[.!?]/);
    return sentences
      .filter(sentence => sentence.includes('first') || sentence.includes('then') || sentence.includes('finally'))
      .slice(0, 5)
      .map(step => step.trim());
  }

  private extractRegion(text: string): string {
    const regions = ['North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Punjabi', 'Marathi', 'Tamil'];
    
    for (const region of regions) {
      if (text.toLowerCase().includes(region.toLowerCase())) {
        return region;
      }
    }
    
    return 'Pan-Indian';
  }

  private extractPractices(text: string): string[] {
    const sentences = text.split('.');
    return sentences
      .filter(sentence => sentence.includes('practice') || sentence.includes('ritual') || sentence.includes('ceremony'))
      .slice(0, 3)
      .map(practice => practice.trim());
  }

  private extractModernAdaptations(text: string): string[] {
    const sentences = text.split('.');
    return sentences
      .filter(sentence => sentence.includes('modern') || sentence.includes('contemporary') || sentence.includes('today'))
      .slice(0, 2)
      .map(adaptation => adaptation.trim());
  }

  private getFallbackRitualInfo(ritualName: string): RitualInfo {
    const fallbackData: Record<string, RitualInfo> = {
      'haldi': {
        title: 'Haldi Ceremony',
        description: 'A pre-wedding ritual where turmeric paste is applied to the bride and groom for purification and to bring a natural glow to their skin.',
        significance: 'Turmeric is considered sacred and is believed to ward off evil spirits while blessing the couple with prosperity.',
        steps: [
          'Family members gather with turmeric paste',
          'Elders apply haldi to the bride/groom',
          'Songs and celebrations follow',
          'The couple is blessed by all attendees'
        ],
        region: 'Pan-Indian',
      },
      'mehendi': {
        title: 'Mehendi Ceremony',
        description: 'An artistic ritual where intricate henna designs are applied to the bride\'s hands and feet, symbolizing joy and spiritual awakening.',
        significance: 'The darker the mehendi color, the stronger the love between the couple is believed to be.',
        steps: [
          'Professional mehendi artists create designs',
          'Family and friends get simple patterns',
          'Traditional songs are sung',
          'The bride\'s name is hidden in the design for the groom to find'
        ],
        region: 'Pan-Indian',
      },
      'sangeet': {
        title: 'Sangeet Night',
        description: 'A musical celebration where both families come together to sing, dance, and celebrate the upcoming union.',
        significance: 'Represents the joy and harmony that the marriage will bring to both families.',
        steps: [
          'Families prepare dance performances',
          'Traditional and modern songs are performed',
          'Friendly competition between families',
          'Celebration continues late into the night'
        ],
        region: 'North Indian',
      }
    };

    return fallbackData[ritualName.toLowerCase()] || {
      title: ritualName,
      description: 'A beautiful Indian wedding tradition.',
      significance: 'This ritual holds special meaning in Indian culture.',
      steps: ['Traditional ceremony begins', 'Family participation', 'Blessings and celebrations'],
      region: 'Indian',
    };
  }

  private getFallbackTraditions(region: string): CulturalTradition[] {
    return [
      {
        name: `${region} Wedding Traditions`,
        description: `Rich cultural traditions specific to ${region} weddings, passed down through generations.`,
        origin: region,
        practices: [
          'Traditional ceremony rituals',
          'Regional music and dance',
          'Specific attire and jewelry',
          'Customary food preparations'
        ],
        modernAdaptations: [
          'Fusion of traditional and contemporary elements',
          'Destination wedding celebrations',
          'Digital invitations and photography'
        ]
      }
    ];
  }
}

export const culturalService = new CulturalService();