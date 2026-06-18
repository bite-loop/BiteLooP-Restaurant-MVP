'use client'
import { 
  Building2, 
  Utensils, 
  BanknoteIcon,
  FileText, 
  CreditCard,
  Clock,
  Users,
  Truck,
  HeadphonesIcon,
  ArrowRight,
  ShieldCheck,
  Mail,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/navbar/navbar';
import Footer from '@/components/footer/onboarding/footer';
import { useState } from 'react';
import { RegisterDialog } from '@/components/dialog/auth/signup';
import { LoginDialog } from '@/components/dialog/auth/login';

export default function RestaurantOnboardingPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
   <>
    <main className=" container mx-auto">
      <Navbar/>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6 pt-8">
              <Badge className="gap-2 text-sm px-4 py-2 w-fit" variant="secondary">
                <Star className="h-4 w-4 fill-primary text-primary" />
                0% Commission for 1st Month!
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Partner with{' '}
                <span className="text-red-500">BiteLoop</span>
                <br />
                and grow your business
              </h1>
              <p className="text-xl text-muted-foreground max-w-sm">
                Only valid for new restaurant partners. Get started in just 10 minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setIsRegisterOpen(true)} size="lg" className="gap-2">
                  Register your restaurant
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Watch how it works
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Takes 10 minutes</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>100% secure</span>
                </div>
              </div>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">50K+</div>
                  <p className="text-xs text-muted-foreground">Growing daily</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Monthly Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹1.2L</div>
                  <p className="text-xs text-muted-foreground">Per restaurant</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Delivery Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28 mins</div>
                  <p className="text-xs text-muted-foreground">Average delivery</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8 ★</div>
                  <p className="text-xs text-muted-foreground">Customer satisfaction</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

   
    {/* Get Started Section - How to Partner */}
<section className="py-24">
  <div className="container px-4 md:px-6">
    <div className="space-y-12">
      <div className="space-y-3 text-center">
        <Badge className="gap-2 text-sm px-4 py-2 w-fit mx-auto" variant="secondary">
          <Clock className="h-4 w-4" />
          Takes only 10 minutes
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to get started
        </h2>
        <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
          Simple requirements to become a BiteLoop partner in Canada
        </p>
      </div>

      {/* Animated Steps Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Step 1 - Restaurant Profile */}
        <div className="group relative text-center  space-y-4 p-6 rounded-xl transition-all duration-300 dark:hover:bg-neutral-950  hover:shadow-lg">
          <div className="relative mx-auto">
            <div className="h-20 w-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center mx-auto group-hover:scale-110 transform">
              <Building2 className="h-10 w-10 text-primary transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center animate-pulse">
              <ArrowRight className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Restaurant Profile</h3>
            <p className="text-sm text-muted-foreground">
              Set up your restaurant name, address, cuisine type, operating hours, and contact details
            </p>
          </div>
          {/* Connector Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-[50%] -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
        </div>

        {/* Step 2 - Menu & Food Items */}
        <div className="group relative text-center dark:hover:bg-neutral-950  space-y-4 p-6 rounded-xl transition-all duration-300 hover:bg-background hover:shadow-lg">
          <div className="relative mx-auto">
            <div className="h-20 w-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center mx-auto group-hover:scale-110 transform">
              <Utensils className="h-10 w-10 text-primary transition-transform duration-300 group-hover:-rotate-12" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center animate-pulse delay-100">
              <ArrowRight className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Menu & Food Photos</h3>
            <p className="text-sm text-muted-foreground">
              Upload your complete menu with prices, descriptions, and high-quality food images
            </p>
          </div>
          {/* Connector Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-[50%] -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
        </div>

        {/* Step 3 - Banking Details */}
        <div className="group relative text-center dark:hover:bg-neutral-950  space-y-4 p-6 rounded-xl transition-all duration-300 hover:bg-background hover:shadow-lg">
          <div className="relative mx-auto">
            <div className="h-20 w-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center mx-auto group-hover:scale-110 transform">
              <CreditCard className="h-10 w-10 text-primary transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Bank Details</h3>
            <p className="text-sm text-muted-foreground">
              Provide your Canadian bank account information for receiving weekly payouts
            </p>
          </div>
        </div>
      </div>

      {/* Required Information Card */}
      <Card className="max-w-3xl mx-auto overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary animate-bounce" />
            What You'll Need to Provide
          </CardTitle>
          <CardDescription>
            Have these ready for a quick 10-minute setup
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:translate-x-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Business Name & Address</p>
                <p className="text-xs text-muted-foreground">Your restaurant location in Canada</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:translate-x-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Operating Hours</p>
                <p className="text-xs text-muted-foreground">Your opening and closing times</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:translate-x-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Utensils className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Complete Menu with Prices</p>
                <p className="text-xs text-muted-foreground">All food items and categories</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:translate-x-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Food Photos</p>
                <p className="text-xs text-muted-foreground">High-quality images of your dishes</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:translate-x-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Bank Account Information</p>
                <p className="text-xs text-muted-foreground">Canadian bank details for payouts</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:translate-x-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Contact Information</p>
                <p className="text-xs text-muted-foreground">Email and phone for communication</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

      {/* Why Partner Section */}
      <section className="py-16 md:py-24 ">
        <div className="container px-4 md:px-6">
          <div className="space-y-12">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why should you partner with BiteLoop?
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Join thousands of restaurants growing their business with us
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Attract New Customers</h3>
                <p className="text-muted-foreground">
                  Reach millions of people ordering on BiteLoop. Get discovered by food lovers in your area.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Doorstep Delivery Convenience</h3>
                <p className="text-muted-foreground">
                  Easily get your orders delivered through our trained delivery partners with real-time tracking.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <HeadphonesIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Onboarding Support</h3>
                <p className="text-muted-foreground">
                  For any support, email us at{' '}
                  <Link href="mailto:merchant@biteloop.com" className="text-primary hover:underline">
                    merchant@biteloop.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 ">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about partnering with BiteLoop
              </p>
            </div>
            
           <Accordion className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  What are the documents required to start deliveries through BiteLoop?
                </AccordionTrigger>
                <AccordionContent>
                  You'll need your PAN card, FSSAI license, bank account details, GST number (if applicable), and menu with profile food images. The entire process takes just 10 minutes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How long will it take for a restaurant to go live after submitting documents?
                </AccordionTrigger>
                <AccordionContent>
                  Most restaurants go live within 24-48 hours after document submission and verification. Our team works quickly to get you onboarded.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  What is the one-time onboarding fee? Do I have to pay it at registration?
                </AccordionTrigger>
                <AccordionContent>
                  There's no one-time onboarding fee for the first month. We charge zero commission for the first month, and our standard commission starts from the second month.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How can I get help and support if I get stuck?
                </AccordionTrigger>
                <AccordionContent>
                  Our support team is available 24/7. You can email us at merchant@biteloop.com or use the live chat feature in your dashboard.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  How much commission will I be charged?
                </AccordionTrigger>
                <AccordionContent>
                  We charge 0% commission for the first month. Starting from the second month, our competitive commission rate is just 15% per order.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  How will I get my payouts?
                </AccordionTrigger>
                <AccordionContent>
                  Payouts are processed weekly directly to your registered bank account. You'll receive a detailed settlement report with each payment.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 ">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to grow your business?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join BiteLoop today and start reaching thousands of new customers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Register your restaurant now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact sales
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/restaurant/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer/>
     <RegisterDialog 
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      <LoginDialog 
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />
      
    </main>
   </>
  );
}