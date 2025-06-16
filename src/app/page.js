export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #F2EEE9 0%, #F2D7D3 100%)",
      }}
    >
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">
          ClassSync
        </h1>
        <p className="text-xl mb-12" style={{ color: "#00408C" }}>
          Modern class management system for educators
        </p>

        <a
          href="/auth"
          className="inline-block px-10 py-4 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-101 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #96ADD6 0%, #00408C 100%)",
          }}
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
