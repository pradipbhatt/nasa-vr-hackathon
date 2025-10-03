import React from 'react';

export const EndSection: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-transparent via-blue-950/50 to-indigo-950/90">
      <div className="text-center text-white px-8 max-w-4xl">
        <h2 className="text-8xl font-black mb-8 drop-shadow-2xl bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300 bg-clip-text text-transparent">
          The Choice Is Ours
        </h2>
        <p className="text-2xl font-light leading-relaxed mb-8">
          We stand at a crossroads. The future of our oceans and planet depends on actions we take today.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-400/30 rounded-lg p-4">
            <div className="text-red-400 text-xl font-bold mb-2">Business as Usual</div>
            <div className="text-sm opacity-70">+4°C warming, 1m+ sea rise, ecosystem collapse</div>
          </div>
          <div className="bg-green-900/20 backdrop-blur-sm border border-green-400/30 rounded-lg p-4">
            <div className="text-green-400 text-xl font-bold mb-2">Sustainable Future</div>
            <div className="text-sm opacity-70">+1.5°C limit, protected oceans, thriving life</div>
          </div>
        </div>
        <p className="text-lg font-light opacity-80 italic max-w-2xl mx-auto">
          "The Earth is what we all have in common." — Wendell Berry
        </p>
      </div>
    </div>
  );
};