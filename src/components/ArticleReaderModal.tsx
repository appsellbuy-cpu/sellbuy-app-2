import React from 'react';
import { X, Clock, Calendar, Bookmark, Share2, CheckCircle2, FileText } from 'lucide-react';
import { Article } from '../types';
import { useProperties } from '../context/PropertyContext';

interface ArticleReaderModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ article, onClose }) => {
  const { showToast } = useProperties();

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-auto border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Article Image */}
          <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-slate-100 shadow-sm">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium mb-1">{article.date}</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-tight">
              {article.title}
            </h1>
          </div>

          <p className="text-sm font-medium text-slate-600 italic bg-amber-50/60 p-4 rounded-2xl border-l-4 border-amber-500">
            {article.summary}
          </p>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            <p>
              The Indian real estate market in 2026 continues to experience robust structural expansion driven by sustained economic growth, urban infrastructural upgrades (such as expanded metro networks and high-speed expressways), and heightened demand for premium residential spaces.
            </p>
            <p>
              Whether you are an aspiring first-time home buyer navigating RERA certifications and circle rates, a tenant seeking zero-brokerage apartments with online registered rent agreements, or an investor tracking micro-market appreciation in Bengaluru, Mumbai, or the NCR corridor, informed decision-making is essential.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> Key Takeaways for Property Seekers:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• Always verify the project RERA registration number on the official state RERA portal.</li>
                <li>• Check carpet area rather than super built-up area to determine the actual usable carpet space.</li>
                <li>• Ensure 30-year title deed search and encumbrance certificate before paying advance token money.</li>
                <li>• Avail tax deductions of up to ₹2 Lakh under Sec 24(b) and ₹1.5 Lakh under Sec 80C for home loans.</li>
              </ul>
            </div>
            <p>
              For personalized legal review or loan advisory, you can reach out to our empanelled property advocates and financial experts directly through the NavikX Services portal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Published by NavikX Real Estate Research Bureau</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
