'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { XIcon } from '@/components/crealia-studio-interface'; // Assuming XIcon is exported

interface TextToImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TextToImageGenerator({ isOpen, onClose }: TextToImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('/api/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-background border-border/50">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="text-lg font-semibold">Générateur Texte en Image</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Textarea
              placeholder="Décrivez l'image que vous souhaitez créer..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? 'Génération en cours...' : 'Générer'}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {imageUrl && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Résultat :</h4>
                <img src={imageUrl} alt={prompt} className="rounded-lg w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

