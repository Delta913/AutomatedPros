'use client';

import { Suspense } from 'react';
import { PokemonExplorer } from './components/PokemonExplorer';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PokemonExplorer />
    </Suspense>
  );
}
