import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

const CarNewsList = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('car_news')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;

      const featured = data?.find(article => article.is_featured);
      const regular = data?.filter(article => !article.is_featured) || [];

      setFeaturedArticle(featured || null);
      setArticles(regular);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-500',
      'Luxury': 'bg-purple-500',
      'Market Trends': 'bg-green-500',
      'Sustainability': 'bg-emerald-500',
      'Featured': 'bg-yellow-500',
      'Reviews': 'bg-orange-500',
      'Industry News': 'bg-red-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Car News & Reviews
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            Latest automotive industry updates, reviews, and trending car technology
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredArticle && (
                <Card 
                  className="mb-12 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => navigate(`/car-news/${featuredArticle.slug}`)}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredArticle.featured_image && (
                      <div className="relative h-64 md:h-auto">
                        <img
                          src={featuredArticle.featured_image}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-8 flex flex-col justify-center">
                      <Badge className={`${getCategoryColor(featuredArticle.category)} text-white w-fit mb-4`}>
                        {featuredArticle.category}
                      </Badge>
                      <h2 className="text-3xl font-bold mb-4">{featuredArticle.title}</h2>
                      <p className="text-gray-600 mb-4 text-lg">{featuredArticle.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          Published: {new Date(featuredArticle.published_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <Button variant="outline" className="group">
                          Read more
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )}

              {/* Articles Grid */}
              {articles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No articles available yet. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <Card
                      key={article.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group"
                      onClick={() => navigate(`/car-news/${article.slug}`)}
                    >
                      {article.featured_image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className={`${getCategoryColor(article.category)} text-white absolute top-4 left-4`}>
                            {article.category}
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(article.published_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <span className="text-primary font-medium flex items-center">
                            Read more
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarNewsList;
