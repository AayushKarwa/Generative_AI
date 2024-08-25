import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch history on component mount
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3001/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/generate-content', { prompt });
      setGeneratedText(response.data.text);
      setHistory(response.data.history); // Update history with the new response
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedText('Failed to generate content');
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  return (
    <div>
      <h1>GEN AI</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {generatedText && (
        <div>
          <h2>Generated Content:</h2>
          <p>{generatedText}</p>
        </div>
      )}
      <h2>History:</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            <strong>Prompt:</strong> {item.prompt}<br />
            <strong>Response:</strong> {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
