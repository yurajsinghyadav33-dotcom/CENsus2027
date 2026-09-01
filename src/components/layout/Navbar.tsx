"use client";

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    {href: '/', label: t('home')},
    {href: '/phases', label: 'Phases'}, 
    {href: '/schedule', label: 'Schedule'},
    {href: '/enumeration', label: t('selfEnumeration')},
    {href: '/privacy', label: t('privacy')},
    {href: '/dashboard', label: t('dashboard')},
    {href: '/command-center', label: 'Command Center'},
  ];

  const locales = [
    { code: 'hi', label: 'HI' },
    { code: 'mr', label: 'MR' },
    { code: 'en', label: 'EN' },
  ];

  const handleLanguageChange = (newLocale: string | null) => {
    if (!newLocale) return;
    router.push(`/${newLocale}${pathname === '/' ? '' : pathname}`);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className={`mx-auto px-6 max-w-7xl transition-all duration-300 ${
        scrolled ? 'glass-panel rounded-full' : 'bg-transparent'
      }`}>
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm">
              C27
            </span>
            <span className="hidden sm:inline-block">Bharat Census</span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-white"
                >
                  <span className={`relative z-10 ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/10 rounded-full z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[80px] h-9 text-xs glass-panel border-none bg-white/5 rounded-full hover:bg-white/10 transition-colors focus:ring-0">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent className="glass-panel border-white/10">
                {locales.map((l) => (
                  <SelectItem key={l.code} value={l.code} className="text-xs focus:bg-white/10">
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
