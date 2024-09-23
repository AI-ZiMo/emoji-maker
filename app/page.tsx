"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    setIsLoading(true);
    setError('');
    setImage('');

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      console.log(data);
      setImage(data.output[0]);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err.message || 'An error occurred while generating the image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Image</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt"
          disabled={isLoading}
        />
        <Button onClick={generateImage} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {image && (
        <Card className="p-4">
          <img src={image} alt="Generated" className="w-full h-auto" />
        </Card>
      )}
    </div>
  );
}
