// src/app/layout.tsx
import './globals.css';
import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';
import Footer from '@/components/footer';
import DarkModeToggle from '@/components/DarkModeToggle';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="any"
          href="https://prismic.io/favicon.ico"
        />
      </head>

      <body className="font-sans text-neutral-900 bg-white dark:bg-neutral-900 dark:text-neutral-100">
        {/* Removed max-w-6xl to allow full width */}
        <DarkModeToggle />
        
        <div className="mx-auto">
          {children}
          <PrismicPreview repositoryName={repositoryName} />
        </div>
        <ScrollToTopButton />
        <Footer/>
      </body>
    </html>
  );
}