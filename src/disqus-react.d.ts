declare module 'disqus-react' {
  import * as React from 'react';

  export interface DisqusConfig {
    url?: string;
    identifier?: string;
    title?: string;
    language?: string;
    remoteAuthS3?: string;
    apiKey?: string;
    sso?: {
      name?: string;
      button?: string;
      icon?: string;
      url?: string;
      logout?: string;
      profile_url?: string;
      width?: string;
      height?: string;
    };
    category_id?: string;
  }

  export interface DiscussionEmbedProps {
    shortname: string;
    config: DisqusConfig;
  }

  export interface CommentCountProps {
    shortname: string;
    config: DisqusConfig;
    children?: React.ReactNode;
  }

  export const DiscussionEmbed: React.ComponentType<DiscussionEmbedProps>;
  export const CommentCount: React.ComponentType<CommentCountProps>;
  export const CommentEmbed: React.ComponentType<any>;
  export const Recommendations: React.ComponentType<any>;

  const disqus: {
    DiscussionEmbed: React.ComponentType<DiscussionEmbedProps>;
    CommentCount: React.ComponentType<CommentCountProps>;
    CommentEmbed: React.ComponentType<any>;
    Recommendations: React.ComponentType<any>;
  };
  export default disqus;
}
