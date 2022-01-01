import React from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import './Markdown.less';

type Props = {
  content: string;
};

export const Markdown: React.FC<Props> = ({ content }) => {
  return (
    <div className="Markdown">
      <MarkdownToJsx>{content}</MarkdownToJsx>
    </div>
  );
};
