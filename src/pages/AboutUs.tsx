import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';

interface PageContent {
  title: string;
  content: string;
  banner_image?: string;
}

const AboutUs = () => {
  const [page, setPage] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('title, content, banner_image')
        .eq('page_slug', 'about-us')
        .single();

      if (error) throw error;
      setPage(data);
    } catch (error) {
      console.error('Error fetching page:', error);
      // Set default content if page doesn't exist
      setPage({
        title: 'About Us',
        content: 'Welcome to Motoren Klaro. We are your trusted partner in finding the perfect car.',
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
      {page?.banner_image && (
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={page.banner_image}
            alt={page.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {page.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {!page?.banner_image && (
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              {page?.title}
            </h1>
          )}

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
                  }}
                >
                  {page?.content || ''}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
