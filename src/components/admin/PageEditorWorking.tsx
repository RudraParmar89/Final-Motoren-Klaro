import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, FileEdit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PageContent {
  id: string;
  page_slug: string;
  title: string;
  content: string;
  meta_description?: string;
  banner_image?: string;
  updated_at: string;
}

export const PageEditor = () => {
  const [pages, setPages] = useState<Record<string, PageContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('about-us');
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .in('page_slug', ['about-us', 'car-news'])
        .order('page_slug');

      if (error) throw error;

      const pagesMap: Record<string, PageContent> = {};
      data?.forEach(page => {
        pagesMap[page.page_slug] = page;
      });

      setPages(pagesMap);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pages.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (pageSlug: string) => {
    setIsSaving(true);
    try {
      const page = pages[pageSlug];
      
      if (!page) {
        throw new Error('Page not found');
      }

      const { error } = await supabase
        .from('pages')
        .update({
          title: page.title,
          content: page.content,
          meta_description: page.meta_description || '',
          banner_image: page.banner_image || '',
        })
        .eq('id', page.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page saved successfully.",
      });

      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save page.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePage = (pageSlug: string, field: keyof PageContent, value: string) => {
    setPages(prev => ({
      ...prev,
      [pageSlug]: {
        ...prev[pageSlug],
        [field]: value
      }
    }));
  };

  const renderPageEditor = (pageSlug: string, pageTitle: string) => {
    const page = pages[pageSlug];
    if (!page) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="h-5 w-5" />
              Edit {pageTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Page Title */}
            <div>
              <Label htmlFor={`${pageSlug}-title`}>Page Title</Label>
              <Input
                id={`${pageSlug}-title`}
                value={page.title}
                onChange={(e) => updatePage(pageSlug, 'title', e.target.value)}
                placeholder="Enter page title"
              />
            </div>

            {/* Meta Description */}
            <div>
              <Label htmlFor={`${pageSlug}-meta`}>Meta Description (SEO)</Label>
              <Input
                id={`${pageSlug}-meta`}
                value={page.meta_description || ''}
                onChange={(e) => updatePage(pageSlug, 'meta_description', e.target.value)}
                placeholder="Brief description for search engines"
              />
            </div>

            {/* Banner Image */}
            <div>
              <Label htmlFor={`${pageSlug}-banner`}>Banner Image URL</Label>
              <Input
                id={`${pageSlug}-banner`}
                value={page.banner_image || ''}
                onChange={(e) => updatePage(pageSlug, 'banner_image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {page.banner_image && (
                <div className="mt-2">
                  <img
                    src={page.banner_image}
                    alt="Banner preview"
                    className="w-full h-40 object-cover rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Page Content */}
            <div>
              <Label htmlFor={`${pageSlug}-content`}>Page Content</Label>
              <Textarea
                id={`${pageSlug}-content`}
                value={page.content}
                onChange={(e) => updatePage(pageSlug, 'content', e.target.value)}
                placeholder="Enter page content (supports markdown)"
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use markdown formatting: **bold**, *italic*, # Heading, - list, etc.
              </p>
            </div>

            {/* Last Updated */}
            {page.updated_at && (
              <div className="text-sm text-gray-500">
                Last updated: {new Date(page.updated_at).toLocaleString()}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleSave(pageSlug)}
                disabled={isSaving}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`/${pageSlug}`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Page Editor</h2>
        <p className="text-gray-600 mt-2">Edit website pages and content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="about-us">About Us</TabsTrigger>
          <TabsTrigger value="car-news">Car News</TabsTrigger>
        </TabsList>

        <TabsContent value="about-us" className="mt-6">
          {renderPageEditor('about-us', 'About Us')}
        </TabsContent>

        <TabsContent value="car-news" className="mt-6">
          {renderPageEditor('car-news', 'Car News')}
        </TabsContent>
      </Tabs>
    </div>
  );
};
