'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONTENT REACTOR - INTERFACE PRINCIPALE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Assistant conversationnel intelligent pour la génération automatique
 * de Reels/Shorts/TikToks optimisés marketing.
 * 
 * Features:
 * - Upload média + instructions naturelles
 * - Chat conversationnel avec l'IA
 * - Génération automatique de 3 versions de Reels
 * - Titres, captions et hashtags optimisés
 * - Preview et téléchargement
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Sparkles, 
  Video, 
  Send, 
  Loader2, 
  CheckCircle2,
  Download,
  Share2,
  Zap,
  TrendingUp,
  Film,
  MessageSquare,
  X,
  FileVideo,
  Image as ImageIcon,
  Music,
  Hash,
  Type,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: any[];
}

interface GeneratedReel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  caption: string;
  hashtags: string[];
  duration: number;
  musicSuggestion?: string;
  metadata: any;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ContentReactorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<string>('viral');
  const [industry, setIndustry] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [generatedReels, setGeneratedReels] = useState<GeneratedReel[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: '👋 Bonjour ! Je suis **Content Reactor**, votre assistant IA pour créer des Reels viraux.\n\n**Envoyez-moi une vidéo ou image** et décrivez le style souhaité. Je génère automatiquement 3 versions optimisées avec titres, captions et hashtags ! 🎬✨',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  // ═════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═════════════════════════════════════════════════════════════════════════

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Format non supporté. Utilisez MP4, MOV, JPG, PNG ou GIF.');
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('Fichier trop volumineux (max 100MB).');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/studio/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      setUploadedFile(file);
      setUploadedFileUrl(data.url);

      // Add message
      addMessage('assistant', `📎 **Fichier reçu !** ${file.name}\n\nMaintenant, décrivez le type de contenu souhaité (ex: "3 Reels marketing luxe pour agence de location de voiture")`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload. Réessayez.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateReels = async () => {
    if (!uploadedFileUrl || !prompt) {
      alert('Veuillez uploader un fichier et entrer une description.');
      return;
    }

    setIsGenerating(true);
    
    addMessage('user', prompt);
    addMessage('assistant', '🎬 **Génération en cours...**\n\nAnalyse du média → Détection des moments clés → Création de 3 versions optimisées...');

    try {
      const response = await fetch('/api/content-reactor/generate-reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: uploadedFileUrl,
          prompt,
          tone,
          industry,
          duration: 30,
          style: 'dynamic',
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();

      setGeneratedReels(data.reels);
      
      addMessage('assistant', `✅ **Génération terminée !**\n\n${data.reels.length} Reels créés avec succès. Chaque version inclut titre, caption optimisée et hashtags pertinents. Découvrez-les ci-dessous ! 🚀`);
      
      setPrompt('');
    } catch (error) {
      console.error('Generation error:', error);
      addMessage('assistant', '❌ **Erreur lors de la génération.** Vérifiez votre connexion et réessayez.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt('');
    addMessage('user', userMessage);

    try {
      const response = await fetch('/api/content-reactor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
          mediaUrls: uploadedFileUrl ? [uploadedFileUrl] : [],
        }),
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();

      addMessage('assistant', data.response, data.actions);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('assistant', '❌ Erreur de communication. Réessayez.');
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: string, actions?: any[]) => {
    setMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        role,
        content,
        timestamp: new Date(),
        actions,
      },
    ]);
  };

  const clearSession = () => {
    setUploadedFile(null);
    setUploadedFileUrl('');
    setGeneratedReels([]);
    setPrompt('');
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: '🔄 **Session réinitialisée !** Uploadez un nouveau média pour commencer.',
        timestamp: new Date(),
      },
    ]);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Content Reactor
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assistant IA pour Reels viraux
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                {generatedReels.length} Reels générés
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearSession}>
                <X className="w-4 h-4 mr-2" />
                Nouvelle session
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Upload & Chat */}
          <div className="space-y-6">
            {/* Upload Card */}
            <Card className="p-6 border-2 border-dashed border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Upload votre média</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Vidéo (MP4, MOV) ou Image (JPG, PNG, GIF) • Max 100MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,image/jpeg,image/png,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Upload en cours...
                    </>
                  ) : uploadedFile ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {uploadedFile.name}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choisir un fichier
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Configuration */}
            <Card className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Configuration
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ton / Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['viral', 'luxury', 'fun', 'educational', 'emotional', 'promotional'].map(t => (
                      <Button
                        key={t}
                        variant={tone === t ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTone(t)}
                        className={tone === t ? 'bg-purple-500 hover:bg-purple-600' : ''}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Secteur (optionnel)</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Ex: Location de voiture, Mode, Immobilier..."
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            </Card>

            {/* Chat Interface */}
            <Card className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                Assistant conversationnel
              </h3>

              {/* Messages */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="space-y-2">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      uploadedFile ? handleGenerateReels() : handleSendMessage();
                    }
                  }}
                  placeholder="Décrivez le contenu souhaité... (ex: 3 Reels marketing luxe pour mon agence)"
                  rows={3}
                  className="resize-none"
                />

                <div className="flex gap-2">
                  {uploadedFile ? (
                    <Button
                      onClick={handleGenerateReels}
                      disabled={isGenerating || !prompt.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Générer les Reels
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSendMessage}
                      disabled={!prompt.trim()}
                      variant="outline"
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Generated Reels */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-500" />
                Reels générés ({generatedReels.length})
              </h3>

              {generatedReels.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Aucun Reel généré pour le moment.</p>
                  <p className="text-sm mt-2">
                    Uploadez un média et décrivez votre besoin pour commencer !
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {generatedReels.map((reel, idx) => (
                    <motion.div
                      key={reel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-4 border-2 border-purple-200 dark:border-purple-800">
                        {/* Thumbnail */}
                        <div className="relative aspect-[9/16] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg mb-4 flex items-center justify-center">
                          <FileVideo className="w-16 h-16 text-purple-400" />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-purple-500">
                              Version {idx + 1}
                            </Badge>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {reel.duration}s
                            </Badge>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-start gap-2 mb-1">
                              <Type className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                              <h4 className="font-semibold text-sm">{reel.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                              {reel.caption}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-start gap-2 mb-1">
                              <Hash className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                              <div className="flex flex-wrap gap-1">
                                {reel.hashtags.slice(0, 5).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {reel.musicSuggestion && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Music className="w-4 h-4 text-purple-500" />
                              <span>{reel.musicSuggestion}</span>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="flex-1 bg-purple-500 hover:bg-purple-600">
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Share2 className="w-4 h-4 mr-2" />
                              Partager
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

