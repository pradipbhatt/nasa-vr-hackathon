'use client';
import AudioPlayer from '@/app/audiobook/AudioPlayer';
// import Navbar from '@/components/navbar/navbar';

const AudiobookPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900">
      {/* <Navbar /> */}
      <main className="pt-24 px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Climate Change Audiobook
        </h1>

        <AudioPlayer src="/a.mp3" title="Climate Change Audiobook" chapter="Chapter 1" />
      </main>
    </div>
  );
};

export default AudiobookPage;
