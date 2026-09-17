import React from 'react';
import { FileText, ArrowRight, Clock, User, Bookmark, Sparkles, TrendingUp } from 'lucide-react';
import { Article } from '../types';
import { INITIAL_ARTICLES } from '../data/initialData';

interface NewsAndGuidesSectionProps {
  onSelectArticle: (article: Article) => void;
  onViewAllNews?: () => void;
}

export const NewsAndGuidesSection: React.FC<NewsAndGuidesSectionProps> = ({
  onSelectArticle,
  onViewAllNews
}) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Real Estate Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              Property News, Market Trends & Buyer Guides
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Stay ahead with curated Indian real estate updates, tax-saving tips, RERA legal checklists, and rental laws.
            </p>
          </div>

          {onViewAllNews && (
            <button
              onClick={onViewAllNews}
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition group self-start md:self-auto"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_ARTICLES.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm text-amber-300 text-[10px] font-bold uppercase">
                    {art.category}
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                    <span>•</span>
                    <span>{art.date}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
