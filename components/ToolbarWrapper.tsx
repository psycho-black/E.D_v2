'use client';

import dynamic from 'next/dynamic';

const TwentyFirstToolbar = dynamic(
  () => import('@21st-extension/toolbar-next').then((mod) => mod.TwentyFirstToolbar),
  { ssr: false }
);

import { ReactPlugin } from '@21st-extension/react';

export function ToolbarWrapper() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <TwentyFirstToolbar
      config={{
        plugins: [
          ReactPlugin,
        ],
      }}
    />
  );
}
