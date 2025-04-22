import { useState } from 'react'
import URLInput from './components/URLInput'
import Notecard from './components/Notecard'
import { WikipediaService } from './services/wikipediaService'
import { OpenAIService } from './services/openaiService'

interface NotecardData {
  title: string;
  content: string;
}

function App() {
  const [notecards, setNotecards] = useState<NotecardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string[]>([]);

  const addDebugMessage = (message: string) => {
    setDebug(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const handleURLSubmit = async (url: string) => {
    console.log('Processing URL:', url);
    setIsLoading(true);
    setError(null);
    setDebug([]);
    addDebugMessage(`Starting to process URL: ${url}`);
    
    try {
      // Fetch Wikipedia article
      addDebugMessage('Fetching Wikipedia article...');
      const article = await WikipediaService.getArticleContent(url);
      addDebugMessage(`Article fetched: ${article.title} (${article.content.length} characters)`);

      // Generate notecards using OpenAI
      addDebugMessage('Generating notecards using OpenAI...');
      const generatedNotecards = await OpenAIService.generateNotecards(article.content);
      addDebugMessage(`Generated ${generatedNotecards.length} notecards`);

      setNotecards(generatedNotecards);
    } catch (err) {
      console.error('Error processing article:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      addDebugMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">WikiAtomizer</h1>
        <URLInput onSubmit={handleURLSubmit} />
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Processing Wikipedia article...</p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {notecards.map((notecard, index) => (
            <Notecard
              key={index}
              title={notecard.title}
              content={notecard.content}
              index={index}
            />
          ))}
        </div>

        {/* Debug section */}
        {debug.length > 0 && (
          <div className="mt-8 p-4 bg-gray-100 rounded border border-gray-300">
            <h2 className="text-lg font-semibold mb-2">Debug Log:</h2>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {debug.join('\n')}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
