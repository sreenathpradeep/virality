export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-center">
      <h1 className="text-4xl font-bold">Find Influencers Instantly</h1>
      <p className="max-w-xl">
        Virality lets you search Instagram, YouTube and TikTok to discover new creators and their contact emails in seconds.
      </p>
      <a href="/login" className="bg-black text-white px-6 py-3 rounded-full">Get Started</a>
    </div>
  );
}
