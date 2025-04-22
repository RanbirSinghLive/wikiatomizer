interface WikipediaResponse {
  parse: {
    title: string;
    text: {
      '*': string;
    };
  };
}

export class WikipediaService {
  private static BASE_URL = 'https://en.wikipedia.org/w/api.php';

  static async getArticleContent(url: string): Promise<{ title: string; content: string }> {
    console.log('Fetching article from:', url);
    
    // Extract title from Wikipedia URL
    const title = this.extractTitleFromUrl(url);
    if (!title) {
      throw new Error('Invalid Wikipedia URL');
    }

    try {
      const apiUrl = new URL(this.BASE_URL);
      apiUrl.searchParams.append('action', 'parse');
      apiUrl.searchParams.append('page', title);
      apiUrl.searchParams.append('format', 'json');
      apiUrl.searchParams.append('prop', 'text');
      apiUrl.searchParams.append('origin', '*');

      console.log('Making API request to:', apiUrl.toString());
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.statusText}`);
      }

      const data: WikipediaResponse = await response.json();
      console.log('Received article data for:', data.parse.title);

      // Clean up the HTML content
      const cleanContent = this.cleanHtmlContent(data.parse.text['*']);

      return {
        title: data.parse.title,
        content: cleanContent
      };
    } catch (error) {
      console.error('Error fetching Wikipedia article:', error);
      throw new Error('Failed to fetch Wikipedia article');
    }
  }

  private static extractTitleFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes('wikipedia.org')) {
        return null;
      }
      
      // Extract title from /wiki/Title or /w/index.php?title=Title
      const titleMatch = urlObj.pathname.match(/\/wiki\/(.+)/) || 
                        urlObj.searchParams.get('title');
      
      return titleMatch ? Array.isArray(titleMatch) ? titleMatch[1] : titleMatch : null;
    } catch {
      return null;
    }
  }

  private static cleanHtmlContent(html: string): string {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove unwanted elements
    const removeSelectors = [
      '.reference',
      '.mw-editsection',
      'style',
      'script',
      '.mw-empty-elt'
    ];

    removeSelectors.forEach(selector => {
      tempDiv.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Get text content and clean it up
    let content = tempDiv.textContent || '';
    content = content
      .replace(/\[\d+\]/g, '') // Remove reference numbers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    return content;
  }
} 