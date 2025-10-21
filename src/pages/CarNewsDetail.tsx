import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image?: string;
  author: string;
  is_featured: boolean;
  published_date: string;
}

const CarNewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('car_news')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, index) => {
      // Headings
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
      }
      
      // Lists
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2">
            {line.replace('- ', '')}
          </li>
        );
      }
      
      // Bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split(boldRegex);
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
          </p>
        );
      }
      
      // Horizontal rule
      if (line === '---') {
        return <hr key={index} className="my-6 border-gray-300" />;
      }
      
      // Empty line
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Regular paragraph
      return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{line}</p>;
    });
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

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/car-news')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Featured Image */}
      {article.featured_image && (
        <div className="relative h-[400px] w-full overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/car-news')}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>

            <Card>
              <CardContent className="p-8 md:p-12">
                {/* Category Badge */}
                <Badge className="mb-4">{article.category}</Badge>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {article.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(article.published_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {article.author}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="ml-auto"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-8 leading-relaxed italic border-l-4 border-primary pl-4">
                  {article.excerpt}
                </p>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  {renderContent(article.content)}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/car-news')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      More News
                    </Button>
                    <Button
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Article
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarNewsDetail;
