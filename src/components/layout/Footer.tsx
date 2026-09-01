"use client";

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="font-semibold text-zinc-300 tracking-wide">{t('gov')}</span>
            <span>&copy; {currentYear} {t('demo')}</span>
          </div>
          
          <div className="flex items-center space-x-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
