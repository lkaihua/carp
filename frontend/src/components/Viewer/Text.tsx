import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { css } from '@emotion/css';
import { LoadingBoundary } from '../LoadingBoundary/LoadingBoundary';

interface TextProps {
  src: string;
  filename?: string;
}

export function Text({ src, filename }: TextProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [src]);

  const language = getLanguageFromFilename(filename);

  return (
    <div className={styles.container}>
      <LoadingBoundary isLoading={isLoading} error={error}>
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={content}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
          }}
        />
      </LoadingBoundary>
    </div>
  );
}

function getLanguageFromFilename(filename?: string): string {
  if (!filename) return 'plaintext';
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'py':
      return 'python';
    case 'go':
      return 'go';
    case 'sh':
      return 'shell';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'xml':
      return 'xml';
    case 'rs':
      return 'rust';
    case 'sql':
      return 'sql';
    case 'c':
      return 'c';
    case 'cpp':
    case 'h':
    case 'hpp':
      return 'cpp';
    case 'java':
      return 'java';
    case 'rb':
      return 'ruby';
    case 'php':
      return 'php';
    default:
      return 'plaintext';
  }
}

const styles = {
  container: css`
    width: 100%;
    height: 100%;
    background-color: #1e1e1e;
  `,
};
