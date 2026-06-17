// components/Footer.tsx
import Link from 'next/link';
import { 

  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { LOGOS } from '@/public/logo/logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
             <Image
             src={LOGOS.LOGO}
             className='object-contain w-24 h-24'
             alt=''

              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Delivering happiness to your doorstep. Order from the best restaurants in town.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
               
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
               
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/restaurants" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  Restaurants
                </Link>
              </li>
              <li>
                <Link 
                  href="/restaurant/onboarding" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/help" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3" />
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Food Street,<br />
                  Mumbai, India 400001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Link 
                  href="tel:+919999999999" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +91 99999 99999
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Link 
                  href="mailto:support@biteloop.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  support@biteloop.com
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  24/7 Support
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-2 pt-2">
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="h-9 text-sm"
                />
                <Button size="sm" className="shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="container px-4 md:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} BiteLoop. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>in India</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/terms" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/cookies" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}