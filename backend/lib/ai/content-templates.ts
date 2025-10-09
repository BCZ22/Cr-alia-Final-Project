export enum MarketingFramework {
  AIDA = "AIDA",
  PAS = "PAS",
  STORYTELLING = "STORYTELLING",
  VIRAL = "VIRAL",
  EDUCATIONAL = "EDUCATIONAL",
  PROMOTIONAL = "PROMOTIONAL",
  ENGAGEMENT = "ENGAGEMENT",
  AWARENESS = "AWARENESS",
  CONVERSION = "CONVERSION",
  RETENTION = "RETENTION",
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  platform: string;
  framework: MarketingFramework;
  template: string;
  variables: string[];
  isPublic: boolean;
  category: string;
  tags: string[];
  usageCount: number;
  rating: number;
}

export class ContentTemplateService {
  private static templates: ContentTemplate[] = [
    {
      id: "aida-linkedin-post",
      name: "Post LinkedIn AIDA",
      description: "Template pour créer des posts LinkedIn engageants avec le framework AIDA",
      type: "POST",
      platform: "LINKEDIN",
      framework: MarketingFramework.AIDA,
      template: `
🎯 **ATTENTION**: {hook}
💡 **INTÉRÊT**: {benefit}
❤️ **DÉSIR**: {emotion}
🚀 **ACTION**: {cta}

{hashtags}
`,
      variables: ["hook", "benefit", "emotion", "cta", "hashtags"],
      isPublic: true,
      category: "LinkedIn",
      tags: ["AIDA", "LinkedIn", "Post", "Engagement"],
      usageCount: 0,
      rating: 0,
    },
    {
      id: "pas-instagram-caption",
      name: "Légende Instagram PAS",
      description: "Template pour créer des légendes Instagram avec le framework PAS",
      type: "CAPTION",
      platform: "INSTAGRAM",
      framework: MarketingFramework.PAS,
      template: `
😰 {problem}

😱 {agitation}

✨ {solution}

{cta}

{hashtags}
`,
      variables: ["problem", "agitation", "solution", "cta", "hashtags"],
      isPublic: true,
      category: "Instagram",
      tags: ["PAS", "Instagram", "Caption", "Storytelling"],
      usageCount: 0,
      rating: 0,
    },
    {
      id: "storytelling-youtube-script",
      name: "Script YouTube Storytelling",
      description: "Template pour créer des scripts YouTube avec le storytelling",
      type: "SCRIPT",
      platform: "YOUTUBE",
      framework: MarketingFramework.STORYTELLING,
      template: `
🎬 **INTRODUCTION** (0-15s)
{opening_hook}

📖 **DÉVELOPPEMENT** (15s-2min)
{story_setup}
{conflict}
{resolution}

🎯 **CONCLUSION** (2min-2min30s)
{key_takeaway}
{call_to_action}

{hashtags}
`,
      variables: ["opening_hook", "story_setup", "conflict", "resolution", "key_takeaway", "call_to_action", "hashtags"],
      isPublic: true,
      category: "YouTube",
      tags: ["Storytelling", "YouTube", "Script", "Viral"],
      usageCount: 0,
      rating: 0,
    },
    {
      id: "viral-tiktok-hook",
      name: "Hook TikTok Viral",
      description: "Template pour créer des hooks TikTok viraux",
      type: "HOOK",
      platform: "TIKTOK",
      framework: MarketingFramework.VIRAL,
      template: `
{attention_grabber}

{surprise_element}

{emotional_trigger}

{call_to_action}
`,
      variables: ["attention_grabber", "surprise_element", "emotional_trigger", "call_to_action"],
      isPublic: true,
      category: "TikTok",
      tags: ["Viral", "TikTok", "Hook", "Engagement"],
      usageCount: 0,
      rating: 0,
    },
    {
      id: "educational-twitter-thread",
      name: "Thread Twitter Éducatif",
      description: "Template pour créer des threads Twitter éducatifs",
      type: "THREAD",
      platform: "TWITTER",
      framework: MarketingFramework.EDUCATIONAL,
      template: `
🧵 {topic} - Un thread pour tout comprendre 👇

1/ {point_1}

2/ {point_2}

3/ {point_3}

4/ {point_4}

5/ {conclusion}

{hashtags}
`,
      variables: ["topic", "point_1", "point_2", "point_3", "point_4", "conclusion", "hashtags"],
      isPublic: true,
      category: "Twitter",
      tags: ["Educational", "Twitter", "Thread", "Knowledge"],
      usageCount: 0,
      rating: 0,
    },
    {
      id: "promotional-facebook-post",
      name: "Post Facebook Promotionnel",
      description: "Template pour créer des posts Facebook promotionnels",
      type: "POST",
      platform: "FACEBOOK",
      framework: MarketingFramework.PROMOTIONAL,
      template: `
🎉 {announcement}

✨ {benefits}

🔥 {urgency}

💬 {social_proof}

🚀 {call_to_action}

{hashtags}
`,
      variables: ["announcement", "benefits", "urgency", "social_proof", "call_to_action", "hashtags"],
      isPublic: true,
      category: "Facebook",
      tags: ["Promotional", "Facebook", "Post", "Conversion"],
      usageCount: 0,
      rating: 0,
    },
  ];

  static getTemplates(framework?: MarketingFramework, type?: string, platform?: string): ContentTemplate[] {
    return this.templates.filter(template => {
      if (framework && template.framework !== framework) return false;
      if (type && template.type !== type) return false;
      if (platform && template.platform !== platform) return false;
      return true;
    });
  }

  static getTemplateById(id: string): ContentTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  static getTemplatesByCategory(category: string): ContentTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  static getPopularTemplates(limit: number = 10): ContentTemplate[] {
    return this.templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  static getTopRatedTemplates(limit: number = 10): ContentTemplate[] {
    return this.templates
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  static incrementUsage(templateId: string): void {
    const template = this.templates.find(t => t.id === templateId);
    if (template) {
      template.usageCount++;
    }
  }

  static rateTemplate(templateId: string, rating: number): void {
    const template = this.templates.find(t => t.id === templateId);
    if (template) {
      // Calcul de la moyenne pondérée
      const totalRatings = template.usageCount;
      const currentAverage = template.rating;
      template.rating = (currentAverage * totalRatings + rating) / (totalRatings + 1);
    }
  }
}