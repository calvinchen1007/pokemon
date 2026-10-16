import React, { useState } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { MessageSquare, Sparkles, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface TalkToUsScreenProps {
  onStartQuiz: () => void;
  onExploreArchetypes: () => void;
}

export const TalkToUsScreen: React.FC<TalkToUsScreenProps> = ({
  onStartQuiz,
  onExploreArchetypes,
}) => {
  const [useSSO, setUseSSO] = useState(false);

  // Derive stable discussion URL and ID
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/talk-to-us`
      : 'https://pokemon-pokevibe.vercel.app/talk-to-us';
  const pageId = 'pokevibe-community-talk-to-us';
  const pageTitle = 'PokéVibe - Talk to Us & Community Discussion';

  // Standard discussion config
  const standardConfig = {
    url: pageUrl,
    identifier: pageId,
    title: pageTitle,
    language: 'en',
  };

  // Extended SSO-ready config
  const ssoConfig = {
    ...standardConfig,
    remoteAuthS3: '', // Server-generated SSO payload
    apiKey: '', // Public Disqus application key
    sso: {
      name: 'PokéVibe Community',
      button: '/favicon.ico',
      icon: '/favicon.ico',
      url: typeof window !== 'undefined' ? `${window.location.origin}/` : '/',
      logout: typeof window !== 'undefined' ? `${window.location.origin}/` : '/',
      profile_url: typeof window !== 'undefined' ? `${window.location.origin}/profile/{username}` : '/profile/{username}',
      width: '800',
      height: '400',
    },
  };

  const activeConfig = useSSO ? ssoConfig : standardConfig;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full flex flex-col justify-between">
      {/* Header section */}
      <div className="space-y-3 mb-6 text-left">
        <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400">
          <span className="text-amber-400 font-semibold tracking-wider">EXP.2026</span>
          <span aria-hidden="true">·</span>
          <span>COMMUNITY FORUM</span>
          <span aria-hidden="true">·</span>
          {/* Disqus live comment count */}
          <div className="inline-flex items-center gap-1.5 text-zinc-300">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <CommentCount
              shortname="calvinchen1007"
              config={standardConfig}
            >
              Comments
            </CommentCount>
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Talk to Us
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
          Share your quiz results, debate which Pokémon archetypes fit best, suggest questions for upcoming exhibitions, or tell us how your archetype matched your true vibe!
        </p>

        {/* Mode selector: Standard vs SSO config toggle */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 font-mono-code text-[11px]">MODE:</span>
          <button
            onClick={() => setUseSSO(false)}
            className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              !useSSO
                ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            Standard Discussion
          </button>
          <button
            onClick={() => setUseSSO(true)}
            className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              useSSO
                ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            Single Sign-On (SSO) Ready
          </button>
        </div>
      </div>

      {/* Disqus Embed Card */}
      <div className="relative w-full rounded-2xl bg-[#141722]/90 border border-white/10 p-5 sm:p-7 shadow-xl backdrop-blur-md mb-8 text-left">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 text-xs font-mono-code text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-zinc-200 font-semibold">THREAD // calvinchen1007</span>
          </div>
          <span className="text-[11px] text-zinc-400">
            {useSSO ? 'SSO ACTIVE' : 'OPEN DISCUSSION'}
          </span>
        </div>

        {/* Embedded Disqus Forum */}
        <div className="disqus-container min-h-[350px]">
          <DiscussionEmbed
            shortname="calvinchen1007"
            config={activeConfig}
          />
        </div>

        {/* Ad blocker note */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-2.5 text-xs text-zinc-400">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Comments are powered by Disqus (<code className="font-mono-code text-zinc-300">calvinchen1007</code>). If the discussion thread does not appear, ensure browser ad-blockers or privacy shields permit Disqus scripts.
          </p>
        </div>
      </div>

      {/* Bottom Navigation Shortcuts */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Moderated discussion · Respect fellow trainers</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartQuiz}
            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            Take the Quiz →
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={onExploreArchetypes}
            className="text-zinc-300 hover:text-white cursor-pointer"
          >
            View All Archetypes
          </button>
        </div>
      </div>
    </div>
  );
};
