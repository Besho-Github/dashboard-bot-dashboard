'use client';

import Head from 'next/head';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Footer from '../../components/Footer';
import { useContext } from 'react';
import { DataContext } from '../../context';

const Terms = () => {
  const { locale } = useContext(DataContext);
  const termsContent = locale.terms.sections;

  return (
    <>
      <Head>
        <title>{locale.terms.pageTitle}</title>
        <meta name="description" content={locale.terms.metaDescription} />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Hero Section */}
      <section className="min-h-[40vh] relative flex items-center justify-center overflow-hidden mt-14">
        <div className="absolute inset-0 bg-gradient-to-b from-background-500 via-background-500/95 to-background-500" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold rounded-full bg-[#CFB360]/10 text-[#CFB360] border border-[#CFB360]/20">
              {locale.terms.lastUpdated}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#CFB360] to-[#E2CC87] bg-clip-text text-transparent">
              {locale.terms.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">{locale.terms.subtitle}</p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 w-[800px] h-[800px] bg-[#CFB360] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
          <div className="absolute -bottom-1/2 right-1/2 w-[800px] h-[800px] bg-[#E2CC87] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000" />
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-background-500 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {termsContent.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-16 last:mb-0"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#CFB360]/10 p-2.5 flex items-center justify-center">
                    <Icon icon={section.icon} className="w-full h-full text-[#CFB360]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{section.title}</h2>
                </div>

                <div className="space-y-4 text-gray-400">
                  <p className="leading-relaxed">{section.content}</p>

                  {section.list && (
                    <ul className="space-y-3 pl-6">
                      {section.list.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#CFB360] mt-2" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.footer && <p className="mt-6 text-sm text-gray-500 italic">{section.footer}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Terms;
