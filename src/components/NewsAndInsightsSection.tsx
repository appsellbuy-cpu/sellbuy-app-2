import React from 'react';
import { INITIAL_ARTICLES } from '../data/initialData';
import { Article } from '../types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const NewsAndInsightsSection: React.FC = () => {
  return (
    <section className="py-14 lg:py-20 bg-[#FAF9F7] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#9A7632] uppercase block mb-1">
              Market Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A192F]">
              Latest News & Insights
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Timely analysis on global property investments, architectural trends, and mortgage developments.
            </p>
          </div>

          <a
            href="#all-news"
            onClick={(e) => { e.preventDefault(); alert('View all 48 editorial research papers in the NavikX Journal.'); }}
            className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0A192F] hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            View All Articles <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </ScrollReveal>

        {/* 3 Editorial Articles Grid matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_ARTICLES.map((article: Article, index: number) => (
            <ScrollReveal
              key={article.id}
              delay={index * 120}
              className="h-full"
            >
              <article
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col group cursor-pointer h-full"
                onClick={() => alert(`Reading article: "${article.title}"`)}
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#0A192F] rounded-md shadow-sm">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {article.date}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#0A192F] group-hover:text-[#C5A059] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {article.snippet}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-[#0A192F] group-hover:text-[#C5A059] transition-colors">
                    Read Article <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
