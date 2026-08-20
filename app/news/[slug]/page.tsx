"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { dataStore, Article } from "@/utils/dataStore";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const list = dataStore.getArticles();
    const found = list.find((a) => a.slug === slug);
    if (found) {
      setArticle(found);
    }
    // Get other articles for sidebar
    const others = list.filter((art) => art.slug !== slug && art.status === "published");
    setOtherArticles(others);
    setIsMounted(true);
  }, [slug]);

  if (!isMounted) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Loading Bulletin Profile...</h2>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Bulletin Not Found</h2>
        <p className="my-6 text-[var(--text-muted)]">
          The requested news or insights bulletin could not be retrieved.
        </p>
        <Link href="/news" className="btn btn-primary">
          Back to News Center
        </Link>
      </div>
    );
  }

  // Split paragraphs by newlines
  const paragraphs = article.content.split("\n").filter((p) => p.trim() !== "");

  return (
    <div className="page-view block">
      <section id="article-detail">
        <Link 
          href="/news" 
          className="back-btn inline-flex items-center gap-2 text-[var(--text-muted)] no-underline text-sm mb-10 transition-all duration-300"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to News Center
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 items-start">
          
          {/* Main Content Area */}
          <article className={`reveal flex flex-col gap-6 ${isMounted ? "active" : ""}`}>
            <div>
              <span
                className="service-badge py-1 px-2.5 text-xs bg-[rgba(225,77,24,0.08)] border border-[var(--border)] rounded text-[var(--primary)] inline-block mb-3"
              >
                {article.category}
              </span>
              <h2 className="text-3xl font-extrabold font-[family-name:var(--font-space-grotesk)] leading-snug text-[var(--text-bright)]">
                {article.title}
              </h2>
              <div className="flex gap-6 text-xs text-[var(--text-muted)] mt-4 border-b border-[var(--border)] pb-4">
                <span><strong>Author:</strong> {article.author}</span>
                <span><strong>Published:</strong> {article.publishedDate}</span>
              </div>
            </div>

            {/* Paragraphs */}
            <div className="flex flex-col gap-5 text-[var(--text-muted)] text-[0.95rem] leading-[1.7]">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Social Share Mock */}
            <div className="border-t border-[var(--border)] pt-6 mt-6 flex items-center gap-4">
              <span className="text-xs font-semibold text-[var(--text-bright)]">Share Bulletin:</span>
              <div className="flex gap-2">
                {["LinkedIn", "Twitter", "Email"].map((plat) => (
                  <button 
                    key={plat}
                    onClick={() => alert(`Coordination link copied to clipboard. Share on ${plat} ready.`)}
                    className="btn btn-secondary py-1.5 px-4 text-xs"
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar Area */}
          <aside className={`reveal flex flex-col gap-8 ${isMounted ? "active" : ""}`}>
            <div 
              className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-8"
            >
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.15rem] font-bold mb-6 border-b border-[var(--border)] pb-2">
                Recent Bulletins
              </h3>
              {otherArticles.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {otherArticles.slice(0, 4).map((art) => (
                    <div key={art.slug} className="flex flex-col gap-1">
                      <span className="text-[0.65rem] text-[var(--primary)] font-semibold uppercase">
                        {art.category}
                      </span>
                      <Link 
                        href={`/news/${art.slug}`}
                        className="sidebar-link font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-bright)] no-underline leading-snug"
                      >
                        {art.title}
                      </Link>
                      <span className="text-[0.7rem] text-[var(--text-muted)]">
                        {art.publishedDate}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[var(--text-muted)] text-center">No other recent bulletins logged.</div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        .back-btn:hover {
          color: var(--primary) !important;
          transform: translateX(-4px);
        }
        .sidebar-link:hover {
          color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}
