import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Mail, User, MessageSquare, Phone, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  carBrand: z.string().min(1, 'Please select a car brand'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected'),
  timestamp: z.number()
});

type FormValues = z.infer<typeof formSchema>;

const carBrands = [
  'BMW', 'Jaguar', 'Land Rover', 'Ferrari',
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Kia', 'Honda',
  'Other'
];

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartTime] = useState<number>(Date.now());
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      carBrand: '',
      message: '',
      honeypot: '',
      timestamp: formStartTime
    }
  });

  const onSubmit = async (data: FormValues) => {
    // Check if user is signed in
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send inquiries. Click the user icon in the navigation to sign in.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Bot checks
      if (data.honeypot) {
        console.log('Bot detected via honeypot');
        toast({
          title: "Error",
          description: "There was a problem with your submission. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      const timeDiff = Date.now() - data.timestamp;
      if (timeDiff < 3000) {
        console.log(`Bot detected: Form submitted too quickly (${timeDiff}ms)`);
        toast({
          title: "Error",
          description: "Please take a moment to review your message before submitting.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Contact form submitted:', data);
      
      // Save to Supabase inquiries table
      const { error: supabaseError } = await supabase
        .from('inquiries')
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            car_brand: data.carBrand,
            message: data.message,
            status: 'new'
          }
        ]);

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw supabaseError;
      }
      
      toast({
        title: "Message sent!",
        description: "We've received your inquiry and will get back to you soon.",
        variant: "default"
      });

      form.reset({
        name: '',
        email: '',
        phone: '',
        carBrand: '',
        message: '',
        honeypot: '',
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending contact form:', error);
      
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="Your full name" className="pl-10" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="+91 98765 43210" className="pl-10" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" className="pl-10" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="carBrand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Brand Interested In</FormLabel>
              <div className="relative">
                <Car className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-10" />
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select a car brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {carBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your car requirements, budget, or any specific questions you have..."
                    className="min-h-[120px] pl-10 resize-none" 
                    {...field} 
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Honeypot field - hidden from real users but bots will fill it */}
        <FormField
          control={form.control}
          name="honeypot"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Leave this empty</FormLabel>
              <FormControl>
                <Input {...field} tabIndex={-1} />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Hidden timestamp field */}
        <FormField
          control={form.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;