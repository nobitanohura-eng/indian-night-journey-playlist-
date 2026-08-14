import React from 'react';
import { Rain } from './Rain';
import { PassingLights } from './PassingLights';
import { Interior } from './Interior';

export function Environment() {
  return (
    <div className="absolute inset-0 bg-[#050505] overflow-hidden">
      <Interior />
      <PassingLights />
      <Rain />
    </div>
  );
}
