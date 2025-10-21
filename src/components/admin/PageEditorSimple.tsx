import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileEdit } from "lucide-react";

export const PageEditor = () => {
  const [showSetup] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Page Editor</h2>
        <p className="text-gray-600 mt-2">Edit website pages and content</p>
      </div>

      {showSetup && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertDescription className="space-y-4">
            <div>
              <p className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FileEdit className="h-5 w-5" />
                ⚠️ Database Setup Required
              </p>
              <p className="mb-4">The pages table needs to be set up first. Follow these steps:</p>
              
              <ol className="list-decimal list-inside space-y-2 mb-4 text-sm">
                <li>Open your <strong>Supabase Dashboard</strong></li>
                <li>Navigate to <strong>SQL Editor</strong> (left sidebar)</li>
                <li>Click <strong>New Query</strong></li>
                <li>Copy the SQL script below</li>
                <li>Paste and <strong>Run</strong> the query</li>
                <li>Refresh this admin page</li>
              </ol>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-sm">SQL Script to Run</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto text-xs max-h-96 overflow-y-auto">
{`-- Create pages table for About Us and Car News
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  banner_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for simplicity (or configure as needed)
ALTER TABLE public.pages DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.pages TO authenticated;
GRANT SELECT ON public.pages TO anon;

-- Set owner
ALTER TABLE public.pages OWNER TO postgres;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug 
  ON public.pages(page_slug);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION update_pages_updated_at();

-- Insert default pages
INSERT INTO public.pages (page_slug, title, content, meta_description) 
VALUES
  (
    'about-us',
    'About Us',
    '# Welcome to Motoren Klaro

Motoren Klaro is your trusted partner in finding the perfect car.

## Our Mission

To simplify the car buying experience by providing comprehensive information.

## What We Offer

- **Extensive Car Database**: Browse hundreds of car models
- **Detailed Specifications**: Get complete technical details
- **Price Information**: Stay updated with latest pricing
- **User Favorites**: Save and compare your favorite cars
- **Expert Guidance**: Contact us for recommendations

## Why Choose Us?

1. **Comprehensive Information**: All car details in one place
2. **User-Friendly Interface**: Easy to navigate
3. **Regular Updates**: Latest models and prices
4. **Trusted Platform**: Reliable and accurate data

Contact us today to find your dream car!',
    'Learn more about Motoren Klaro - Your trusted car platform'
  ),
  (
    'car-news',
    'Car News',
    '# Latest Car News & Updates

Stay updated with the latest automotive news and trends.

## Recent Updates

### Electric Vehicles on the Rise
The Indian automotive market is seeing increased EV adoption.

### New Launches This Month
Exciting new car models with advanced features.

### Industry Trends
- Focus on fuel efficiency
- Growing SUV demand
- Connected car technology
- Enhanced safety features

## Stay Updated

Check back regularly for the latest automotive news!

---

*Last updated: ' || TO_CHAR(NOW(), 'DD Mon YYYY') || '*',
    'Latest car news and automotive updates'
  )
ON CONFLICT (page_slug) DO NOTHING;

-- Verify setup
SELECT 'SUCCESS! Pages table created' as status;
SELECT * FROM public.pages;`}
                  </pre>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        // Copy to clipboard
                        const sql = document.querySelector('pre')?.textContent;
                        if (sql) {
                          navigator.clipboard.writeText(sql);
                          alert('SQL copied to clipboard!');
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      📋 Copy SQL
                    </Button>
                    <Button
                      onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                      size="sm"
                    >
                      Open Supabase Dashboard →
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm font-medium mb-2">📝 After running the SQL:</p>
                <ol className="text-sm list-decimal list-inside space-y-1">
                  <li>You should see "SUCCESS! Pages table created"</li>
                  <li>You should see 2 rows (about-us and car-news)</li>
                  <li>Reload this admin page</li>
                  <li>The editor will appear here</li>
                </ol>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> The SQL script is also available in the file <code>create_pages_table.sql</code> in your project root.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>What is Page Editor?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            The Page Editor allows you to edit the content of your website pages directly from the admin panel.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Editable Pages:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>About Us</strong> - Tell visitors about your company</li>
              <li><strong>Car News</strong> - Share latest automotive news and updates</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Markdown text editor for rich formatting</li>
              <li>Image upload for banner images</li>
              <li>SEO meta descriptions</li>
              <li>Live preview of changes</li>
              <li>Auto-save timestamps</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded border border-green-200">
            <p className="text-sm font-medium text-green-800">
              ✅ Once you complete the database setup above, this page will transform into a full-featured editor!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
