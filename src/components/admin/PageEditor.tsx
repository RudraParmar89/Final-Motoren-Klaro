import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, FileEdit, Upload, Eye } from "lucide-react";
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

    const loadPages = async () => {
      try {
        await fetchPages();
      } catch (error) {
        console.error('Error in fetchPages:', error);
        setIsLoading(false);
      }
    };
    loadPages();
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

      // If pages don't exist, create default ones
      if (!pagesMap['about-us']) {
        pagesMap['about-us'] = {
          id: '',
          page_slug: 'about-us',
          title: 'About Us',
          content: 'Welcome to Motoren Klaro. We are your trusted partner in finding the perfect car.',
          meta_description: 'Learn more about Motoren Klaro',
          banner_image: '',
          updated_at: new Date().toISOString()
        };
      }

      if (!pagesMap['car-news']) {
        pagesMap['car-news'] = {
          id: '',
          page_slug: 'car-news',
          title: 'Car News',
          content: 'Stay updated with the latest automotive news and trends.',
          meta_description: 'Latest car news and automotive updates',
          banner_image: '',
          updated_at: new Date().toISOString()
        };
      }

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

      const pageData = {
        page_slug: page.page_slug,
        title: page.title,
        content: page.content,
        meta_description: page.meta_description || '',
        banner_image: page.banner_image || '',
        updated_at: new Date().toISOString()
      };

      let result;
      if (page.id) {
        // Update existing page
        result = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', page.id)
          .select()
          .single();
      } else {
        // Insert new page
        result = await supabase
          .from('pages')
          .insert([pageData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Update local state with returned data
      setPages(prev => ({
        ...prev,
        [pageSlug]: result.data
      }));

      toast({
        title: "Success",
        description: "Page saved successfully.",
      });
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

  const handleImageUpload = async (pageSlug: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageSlug}-banner-${Date.now()}.${fileExt}`;
      const filePath = `page-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lovable-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('lovable-uploads')
        .getPublicUrl(filePath);

      updatePage(pageSlug, 'banner_image', publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image.",
      });
    }
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
              <Label htmlFor={`${pageSlug}-banner`}>Banner Image</Label>
              <div className="flex gap-2">
                <Input
                  id={`${pageSlug}-banner`}
                  value={page.banner_image || ''}
                  onChange={(e) => updatePage(pageSlug, 'banner_image', e.target.value)}
                  placeholder="Enter image URL or upload below"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById(`${pageSlug}-file`)?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  id={`${pageSlug}-file`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(pageSlug, file);
                  }}
                />
              </div>
              {page.banner_image && (
                <div className="mt-2">
                  <img
                    src={page.banner_image}
                    alt="Banner preview"
                    className="w-full h-40 object-cover rounded border"
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
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use markdown formatting: **bold**, *italic*, # Heading, etc.
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Page Editor</h2>
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
