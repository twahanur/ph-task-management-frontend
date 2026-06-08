"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import FooterLight from "@/components/svgIcon/FooterLight";

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register")
  )
    return null;

  const footerLinks = {
    company: [
      { name: "Homepage", href: "/" },
      { name: "Contact Us", href: "/contact" },
      { name: "Sign In", href: "/login" },
      { name: "Sign Up", href: "/register" },
    ],
    solutions: [
      { name: "Advanced Prompts", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "How It Works", href: "#" },
      { name: "Media Kit", href: "#" },
    ],
    resources: [
      { name: "Blog", href: "#" },
      { name: "Blog Single", href: "#" },
      { name: "Case Studies", href: "#" },
      { name: "Case Studies Single", href: "#" },
    ],
    aboutUs: [
      { name: "Our Patents", href: "#" },
      { name: "Our Services", href: "#" },
      { name: "Our Story", href: "#" },
      { name: "Our Team", href: "#" },
    ],
  };

  return (
    <footer className="text-white pt-16 md:pt-24 pb-10 px-6 md:px-12 lg:px-20 relative overflow-hidden bg-[#030115]">
      <FooterLight />
      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 mb-16">
          {/* Brand & Contact Info */}
          <div className="space-y-6 lg:max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <div className="w-5 h-5 border-[3px] border-[#030115] rotate-45" />
              </div>
              <span className="text-2xl md:text-3xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                PH Tasks
              </span>
            </div>

            <p className="text-[#9B98AE] text-base leading-relaxed">
              Unlock smarter project management with data-driven task insights crafted for your growth.
            </p>

            <div className="space-y-4 text-[#9B98AE] text-sm md:text-base">
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-white">Address:</p>
                <p>House 12, Road 5, Block C, Banani, Dhaka</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-white">Contact:</p>
                <p>+880 123-456789</p>
                <p>info@phtasks.com</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6 text-[#9B98AE] pt-2">
              <Facebook size={24} className="hover:text-yellow-400 cursor-pointer transition-all hover:scale-110" />
              <Instagram size={24} className="hover:text-yellow-400 cursor-pointer transition-all hover:scale-110" />
              <Twitter size={24} className="hover:text-yellow-400 cursor-pointer transition-all hover:scale-110" />
              <Linkedin size={24} className="hover:text-yellow-400 cursor-pointer transition-all hover:scale-110" />
              <Youtube size={24} className="hover:text-yellow-400 cursor-pointer transition-all hover:scale-110" />
            </div>
          </div>

          {/* Links Sections */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {/* Company */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[2px] mb-6 text-white/90">Company</h4>
              <ul className="space-y-4 text-sm md:text-base text-[#9B98AE]">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-yellow-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[2px] mb-6 text-white/90">Solutions</h4>
              <ul className="space-y-4 text-sm md:text-base text-[#9B98AE]">
                {footerLinks.solutions.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-yellow-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[2px] mb-6 text-white/90">Resources</h4>
              <ul className="space-y-4 text-sm md:text-base text-[#9B98AE]">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-yellow-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[2px] mb-6 text-white/90">About Us</h4>
              <ul className="space-y-4 text-sm md:text-base text-[#9B98AE]">
                {footerLinks.aboutUs.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-yellow-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs md:text-sm text-white/40 text-center md:text-left">
          
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p>© {new Date().getFullYear()} PH Tasks. All rights reserved.</p>
        </div>
      </div>
    </footer>

  );
}