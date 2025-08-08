import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Watch<span className="text-blue-600">Log</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Track your movies & TV shows with detailed statistics, social features, and watch parties. 
            <strong className="text-gray-900"> Completely free, forever.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/auth/signup" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="/auth/login" 
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-4">📺</div>
              <h3 className="text-xl font-semibold mb-2">Smart Tracking</h3>
              <p className="text-gray-600">One-click episode marking, progress bars, and automatic "Up Next" detection for all your shows.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Detailed Statistics</h3>
              <p className="text-gray-600">Heat maps, viewing patterns, genre preferences, and time tracking - all the data you love.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Social Features</h3>
              <p className="text-gray-600">Watch parties, friend activities, shared watchlists, and discover what your friends are watching.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Why WatchLog?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🆓 Forever Free</h4>
                <p className="text-gray-600">All features, unlimited history, advanced stats - no premium tiers, no limits.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🔓 Open Source</h4>
                <p className="text-gray-600">Transparent code, self-hosting options, and community-driven development.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🚀 Lightning Fast</h4>
                <p className="text-gray-600">Keyboard shortcuts, offline support, and optimistic UI for instant feedback.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🔒 Privacy First</h4>
                <p className="text-gray-600">Your data stays yours. No tracking, no selling, full export capabilities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}