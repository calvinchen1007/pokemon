import React, { useState } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { MessageSquare, ShieldCheck, RefreshCw, Sparkles, ExternalLink, Sliders } from 'lucide-react';
import { DisqusErrorBoundary } from './DisqusErrorBoundary';

interface TopicArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
}

interface TalkToUsScreenProps {
  onBackToHome: () => void;
  onStartQuiz: () => void;
}

export const TalkToUsScreen: React.FC<TalkToUsScreenProps> = ({
  onBackToHome,
  onStartQuiz,
}) => {
  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://pokevibe.app';

  // Topic Channels
  const TOPICS: TopicArticle[] = [
    {
      id: 'pokevibe-feedback-general',
      title: 'PokéVibe Community & Match Feedback',
      category: 'General Discussion',
      description: 'Discuss your personality quiz results, favorite Pokémon matches, and general thoughts.',
      url: `${currentOrigin}/talk-to-us#general`,
    },
    {
      id: 'pokevibe-feature-suggestions',
      title: 'Feature Requests & New Archetype Ideas',
      category: 'Ideas & Roadmap',
      description: 'Suggest new Pokémon archetypes, quiz questions, or visual card designs.',
      url: `${currentOrigin}/talk-to-us#features`,
    },
    {
      id: 'pokevibe-api-bugs',
      title: 'PokéAPI Characteristics & Bug Reports',
      category: 'Bug Reports & Performance',
      description: 'Report issues with PokéAPI data sync, characteristics gene-modulos, or UI glitches.',
      url: `${currentOrigin}/talk-to-us#bugs`,
    },
  ];

  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPICS[0].id);
  const [showSsoSettings, setShowSsoSettings] = useState<boolean>(false);
  const [isSsoEnabled, setIsSsoEnabled] = useState<boolean>(false);

  // SSO settings state as demonstrated in prompt
  const [ssoConfig, setSsoConfig] = useState({
    remoteAuthS3: '',
    apiKey: '',
    name: 'PokéVibe Community',
    button: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    url: `${currentOrigin}/login`,
    logout: `${currentOrigin}/logout`,
    profileUrl: `${currentOrigin}/user/{username}`,
    width: '800',
    height: '400',
  });

  const activeArticle =
    TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  // Disqus configuration object
  const disqusConfig: {
    url: string;
    identifier: string;
    title: string;
    language: string;
    remoteAuthS3?: string;
    apiKey?: string;
    sso?: {
      name: string;
      button: string;
      icon: string;
      url: string;
      logout: string;
      profile_url: string;
      width: string;
      height: string;
    };
  } = {
    url: activeArticle.url,
    identifier: activeArticle.id,
    title: activeArticle.title,
    language: 'en',
    ...(isSsoEnabled
      ? {
          remoteAuthS3: ssoConfig.remoteAuthS3,
          apiKey: ssoConfig.apiKey,
          sso: {
            name: ssoConfig.name,
            button: ssoConfig.button,
            icon: ssoConfig.icon,
            url: ssoConfig.url,
            logout: ssoConfig.logout,
            profile_url: ssoConfig.profileUrl,
            width: ssoConfig.width,
            height: ssoConfig.height,
          },
        }
      : {}),
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
          <button
            onClick={onBackToHome}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-200">Talk to Us</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-400 font-mono-code">Disqus Community</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2.5">
              <MessageSquare className="w-7 h-7 text-amber-400 shrink-0" />
              <span>Talk to Us</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Join the conversation! Leave feedback, share which Pokémon matches your soul, or report bugs.
              Powered by Disqus with live comment tracking and Single Sign-On (SSO) integration.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSsoSettings(!showSsoSettings)}
              className={`h-9 px-3.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                showSsoSettings || isSsoEnabled
                  ? 'border-amber-400/50 bg-amber-400/10 text-amber-300'
                  : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>SSO Settings</span>
              {isSsoEnabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-1" />
              )}
            </button>

            <button
              onClick={onStartQuiz}
              className="h-9 px-4 text-xs font-semibold text-zinc-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 whitespace-nowrap cursor-pointer shadow-sm shadow-amber-400/20"
            >
              Take Personality Quiz
            </button>
          </div>
        </div>
      </div>

      {/* SSO Settings Drawer / Card */}
      {showSsoSettings && (
        <div className="mb-8 rounded-xl border border-amber-400/30 bg-[#141720] p-5 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Disqus Single Sign-On (SSO) Configuration</h3>
            </div>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <span>Enable SSO in Embed</span>
              <input
                type="checkbox"
                checked={isSsoEnabled}
                onChange={(e) => setIsSsoEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Disqus API Key (Public)</label>
              <input
                type="text"
                placeholder="e.g. Your Disqus API Key from disqus.com/api/applications/"
                value={ssoConfig.apiKey}
                onChange={(e) => setSsoConfig({ ...ssoConfig, apiKey: e.target.value })}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Remote Auth S3 Payload (from backend server)</label>
              <input
                type="text"
                placeholder="e.g. [message] [hmac_sha1] [timestamp]"
                value={ssoConfig.remoteAuthS3}
                onChange={(e) => setSsoConfig({ ...ssoConfig, remoteAuthS3: e.target.value })}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">SSO Provider Name</label>
              <input
                type="text"
                value={ssoConfig.name}
                onChange={(e) => setSsoConfig({ ...ssoConfig, name: e.target.value })}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">SSO Login URL</label>
              <input
                type="text"
                value={ssoConfig.url}
                onChange={(e) => setSsoConfig({ ...ssoConfig, url: e.target.value })}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <p className="mt-3 text-[11px] text-zinc-500 leading-normal">
            Note: Standard Disqus authentication (Google, Facebook, Twitter, Disqus) works out-of-the-box. When SSO is enabled, Disqus connects to your custom authentication provider with the payload above.
          </p>
        </div>
      )}

      {/* Topics / Discussion Channels Bar */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Discussion Channels
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400/60 bg-amber-400/10 shadow-sm shadow-amber-400/10'
                    : 'border-white/10 bg-[#12141a] hover:border-white/20 hover:bg-[#161820]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[11px] font-medium ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`}>
                      {topic.category}
                    </span>
                    {/* Live CommentCount component embedded for each topic */}
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono-code">
                      <DisqusErrorBoundary
                        fallback={<span className="text-[10px] text-zinc-500">Comments</span>}
                      >
                        <CommentCount
                          shortname="pokemon-feedback-page"
                          config={{
                            url: topic.url,
                            identifier: topic.id,
                            title: topic.title,
                          }}
                        >
                          Comments
                        </CommentCount>
                      </DisqusErrorBoundary>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-snug">
                    {topic.title}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Thread Context & Live Stats Card */}
      <div className="rounded-xl border border-white/10 bg-[#12141a] p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-amber-400 font-semibold">{activeArticle.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-code text-zinc-300">#{activeArticle.id}</span>
          </div>
          <h2 className="text-lg font-bold text-white">{activeArticle.title}</h2>
        </div>

        <div className="flex items-center gap-3 bg-[#0a0c10] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 shrink-0">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <DisqusErrorBoundary
            fallback={<span>Active Discussion</span>}
          >
            <CommentCount
              shortname="pokemon-feedback-page"
              config={{
                url: activeArticle.url,
                identifier: activeArticle.id,
                title: activeArticle.title,
              }}
            >
              Comments
            </CommentCount>
          </DisqusErrorBoundary>
        </div>
      </div>

      {/* Main Discussion Embed Container */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-5 sm:p-8 shadow-2xl min-h-[480px]">
        <DisqusErrorBoundary
          fallback={
            <div className="py-16 text-center text-zinc-400 max-w-md mx-auto">
              <MessageSquare className="w-12 h-12 text-amber-400/50 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Disqus Forum Integration</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Shortname: <code className="text-amber-400 font-mono">pokemon-feedback-page</code>
                <br />
                The discussion embed will appear once the Disqus service authenticates your session.
              </p>
              <a
                href={`https://disqus.com/home/forums/pokemon-feedback-page/`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
              >
                <span>Visit forum on Disqus</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          }
        >
          {/* Keyed by topic id and SSO state so that switching topics resets the embed cleanly */}
          <DiscussionEmbed
            key={`${activeArticle.id}-${isSsoEnabled ? 'sso' : 'standard'}`}
            shortname="pokemon-feedback-page"
            config={disqusConfig}
          />
        </DisqusErrorBoundary>
      </div>

      {/* Community Guidelines & Footer Callout */}
      <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400/80 shrink-0" />
          <span>Keep discussions friendly & respectful. Report spoiler answers or API rate-limit delays.</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://help.disqus.com/customer/en/articles/1717160-integrating-single-sign-on"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>SSO Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </div>
  );
};
