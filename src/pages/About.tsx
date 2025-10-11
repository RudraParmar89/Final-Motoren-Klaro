import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/navnit-hero-bg.jpg';
import buildingImage from '@/assets/navnit-building.jpg';

const About = () => {
  return (
    <PageLayout>
      <SEO 
        title="About Us - Navnit Group | Redefining Luxury From Inside Out"
        description="The Navnit Group, a Rs. 2000 crore plus network of diverse companies, is a reputed and professionally managed Mumbai-based business and brand operating in mobility segments spanning land, sea, air and allied businesses."
        keywords={['navnit group', 'luxury automobiles', 'mumbai dealers', 'automotive network']}
      />
      
      {/* Hero Section */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${heroImage})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-primary-foreground max-w-4xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Redefining Luxury<br />
              <span className="text-muted-foreground">From Inside Out</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-4 font-light"
            >
              We change your perspective
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl font-light opacity-90"
            >
              and symbolize the vision of the future.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src={buildingImage} 
                alt="Navnit Group Building"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute top-8 left-8">
                <Badge className="bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium">
                  Great Place To Work - Certified
                </Badge>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-foreground">About Navnit Group</h2>
              <p className="text-primary text-lg font-semibold">Your Perspective is ours</p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The Navnit Group, a Rs. 2000 crore plus network of diverse companies, is a reputed and professionally managed Mumbai-based business and brand. It operates in the mobility segments spanning land, sea, air and allied businesses.
              </p>
              
              <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Who We Are</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Navnit Group is a well integrated network of several successful businesses operating within sectors as diverse as Automotive, Infrastructure, Marine, Adventure Sports, Aviation and Financial Services. These expansions have contributed to the strategic depth and diversity of the Group.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Supported by a team of more than 3000 skilled employees, the group sells over 12,000 vehicles each year in every category and is a significant player.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-secondary-foreground mb-6">Why Choose Navnit Group</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Navnit Group responded to the challenges of the new business environment by setting the trend for exclusive showrooms made to global standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "VISION",
                description: "To expand our horizons and build a dynamic and globally respected corporation driven by professionalism, values and entrepreneurial energy."
              },
              {
                title: "MISSION", 
                description: "To continually offer our customers world class products and a Brand Navnit Experience in our existing businesses while also creating greater choices and value with our new initiatives."
              },
              {
                title: "PERSPECTIVE",
                description: "We believe in understanding our customers, responding to their needs and offering the man informed, interactive and intimate. Brand Navnit experience all times."
              },
              {
                title: "OUR VALUES",
                description: "Our values define the way we do business, set goals, respond to challenges & engage with diverse stakeholders. They have been a part of our business philosophy to be our guiding principles in every activity today."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-primary mb-4">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Badges Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-8">
            {[
              { title: "Proven Expertise", color: "bg-primary" },
              { title: "New Initiatives", color: "bg-secondary-foreground" },
              { title: "Customer Relationship", color: "bg-primary" }
            ].map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${badge.color} text-primary-foreground px-6 py-3 rounded-full shadow-lg`}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-primary-foreground rounded-full flex items-center justify-center mr-3">
                    <svg className="w-2.5 h-2.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{badge.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed About Section */}
      <div className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src={buildingImage} 
                alt="Modern Office Building"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-foreground">About Navnit Group</h2>
              <p className="text-lg font-semibold text-accent-foreground">
                Creating Greater Choices & Values With Our New Initiatives
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Navnit Group responded to the challenges of the new business environment by setting the trend for exclusive showrooms made to global standards.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3 tracking-wide">INVESTING IN THE FUTURE</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    As a rapidly expanding business group with deep roots in the Indian economy, the Navnit Group is deeply committed to growing, seeking appropriate business opportunities and serving emerging aspirations in India. We believe that the future will be an exciting time for our nation and we will endeavour to play an integral part in it.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3 tracking-wide">BUILDING NAVNIT</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The Navnit Group is a family-owned professionally managed business. The Chairman and Managing Director, Navnit Kachalia and his brothers form the Board of Directors which provides the entrepreneurial energy and strategic business vision for future growth. The separate businesses and showrooms are managed by experienced and professional managers from diverse backgrounds within the automotive, finance and other sectors reflecting a diversity of skill sets.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3 tracking-wide">CORPORATE CITIZENSHIP</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    At the Navnit Group we are committed to the principles of enlightened corporate citizenship in our interactions with all our stakeholders and the wider community. A few years ago, realising the dearth of skilled workmen in the auto care business we established the Navnit Academy to offer training in this key area. We believe this has helped raise efficiency standards and skill sets in the industry as a whole.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Motoren Klaro Section */}
      <div className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-secondary-foreground mb-6">About Motoren Klaro</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted companion in making informed car buying decisions through comprehensive comparisons and expert insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-secondary-foreground">Our Platform</h3>
              <p className="text-lg text-primary font-semibold">Simplifying Car Buying Decisions</p>
              <p className="text-muted-foreground leading-relaxed">
                Motoren Klaro bridges the gap between car buyers and their perfect vehicle match. We understand that choosing the right car can be overwhelming with countless options, specifications, and dealers to consider.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform provides comprehensive car comparisons, detailed specifications, honest reviews, and connects you with trusted dealers like Navnit Group to ensure you make the best decision for your needs and budget.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                {
                  title: "Smart Comparisons",
                  description: "Compare cars side-by-side with detailed specifications, pricing, and features.",
                  icon: "📊"
                },
                {
                  title: "Expert Reviews",
                  description: "Get honest, unbiased reviews from automotive experts and real users.",
                  icon: "⭐"
                },
                {
                  title: "Trusted Dealers",
                  description: "Connect with verified dealers and authorized showrooms in your area.",
                  icon: "🤝"
                },
                {
                  title: "Best Prices",
                  description: "Find the best deals, financing options, and exclusive offers.",
                  icon: "💰"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h4 className="text-lg font-bold text-card-foreground mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Cars Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Expert Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Partnership Section */}
      <div className="bg-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Partnership</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Motoren Klaro is proud to partner with established automotive groups like Navnit Group to bring you the best car buying experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-primary rounded-2xl p-8 md:p-12 text-primary-foreground text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Together, We Redefine Your Car Buying Journey
            </h3>
            <p className="text-lg opacity-90 mb-8">
              Combining Motoren Klaro's innovative comparison platform with Navnit Group's decades of automotive excellence and trusted dealership network.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-3">Motoren Klaro Brings:</h4>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>• Advanced comparison tools</li>
                  <li>• Comprehensive car database</li>
                  <li>• User-friendly platform</li>
                  <li>• Expert recommendations</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-3">Navnit Group Provides:</h4>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>• Premium showroom experience</li>
                  <li>• Trusted dealer network</li>
                  <li>• After-sales service</li>
                  <li>• Financing solutions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;