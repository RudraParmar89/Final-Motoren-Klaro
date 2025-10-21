import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp } from 'lucide-react';

interface PageContent {
  title: string;
  content: string;
  banner_image?: string;
  updated_at: string;
}

const CarNews = () => {
  const [page, setPage] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('title, content, banner_image, updated_at')
        .eq('page_slug', 'car-news')
        .single();

      if (error) throw error;
      setPage(data);
    } catch (error) {
      console.error('Error fetching page:', error);
      // Set default content if page doesn't exist
      setPage({
        title: 'Car News',
        content: 'Stay updated with the latest automotive news and trends.',
        updated_at: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      {page?.banner_image ? (
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={page.banner_image}
            alt={page.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Latest Updates
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(page.updated_at).toLocaleDateString()}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {page.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary to-primary/80 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Latest Updates
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(page?.updated_at || '').toLocaleDateString()}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              {page?.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-8" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-6" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 mt-4" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                    li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
                    a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray-600" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
                    ),
                    hr: ({ node, ...props }) => <hr className="my-6 border-gray-300" {...props} />,
                  }}
                >
                  {page?.content || ''}
                </ReactMarkdown>
              </div>

              {/* Last Updated Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Last updated: {new Date(page?.updated_at || '').toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarNews;
