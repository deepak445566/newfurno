import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100 min-h-screen flex items-center">

      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white shadow-md border border-green-100 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-700">
                Sustainable Furniture Marketplace
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight">

              Give Your Furniture

              <span className="block mt-3 text-green-700">
                A Second Life
              </span>
            </h1>

            {/* Paragraph */}
            <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Sell unused furniture, donate to communities, or
              discover amazing free items near you. Make your
              home cleaner while helping others.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              <button
                onClick={() => navigate("/listings")}
                className="h-14 px-8 rounded-2xl bg-black text-white font-semibold hover:scale-[1.03] transition-all duration-300 shadow-xl"
              >
                Explore Listings
              </button>

              <button
                onClick={() => navigate("/create")}
                className="h-14 px-8 rounded-2xl bg-white border border-gray-200 font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                Sell Furniture
              </button>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">

              {/* SELL */}
              <div
                onClick={() => navigate("/create")}
                className="group bg-white/90 backdrop-blur rounded-3xl p-5 border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 mx-auto lg:mx-0 group-hover:scale-110 transition">
                  <span className="text-2xl">💰</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  Sell
                </h3>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Turn unused furniture into cash quickly.
                </p>

                <div className="mt-4 text-amber-600 font-semibold text-sm">
                  Start Selling →
                </div>
              </div>

              {/* DONATE */}
              <div
                onClick={() => navigate("/donate")}
                className="group bg-white/90 backdrop-blur rounded-3xl p-5 border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 mx-auto lg:mx-0 group-hover:scale-110 transition">
                  <span className="text-2xl">🎁</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  Donate
                </h3>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Help families and NGOs with your furniture.
                </p>

                <div className="mt-4 text-emerald-600 font-semibold text-sm">
                  Donate Now →
                </div>
              </div>

              {/* FREE */}
              <div
                onClick={() => navigate("/free")}
                className="group bg-white/90 backdrop-blur rounded-3xl p-5 border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-4 mx-auto lg:mx-0 group-hover:scale-110 transition">
                  <span className="text-2xl">🪑</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  Free Items
                </h3>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Discover quality furniture for free nearby.
                </p>

                <div className="mt-4 text-sky-600 font-semibold text-sm">
                  Browse Free →
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Glow */}
            <div className="absolute inset-0 bg-green-300/20 blur-3xl rounded-full"></div>

            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">

              {/* Floating Card */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  ♻️
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Eco Friendly
                  </p>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Reuse Furniture
                  </h4>
                </div>
              </div>

              {/* Main Image */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[40px] shadow-[0_25px_80px_rgba(0,0,0,0.12)] overflow-hidden">

                <img
                  src="./images/main.png"
                  alt="Furniture"
                  className="w-full h-[320px] sm:h-[450px] md:h-[550px] lg:h-[650px] object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/800x900/e8f5e9/1b5e20?text=Furniture";
                  }}
                />
              </div>

              {/* Bottom Floating Card */}
              <div className="absolute -bottom-4 right-0 sm:right-4 bg-white rounded-2xl shadow-xl px-5 py-4 z-20 hidden sm:block">
                <p className="text-xs text-gray-500">
                  Active Users
                </p>

                <h3 className="text-2xl font-black text-gray-900">
                  10K+
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L60,80C120,96,240,128,360,133.3C480,139,600,117,720,106.7C840,96,960,96,1080,106.7C1200,117,1320,139,1380,149.3L1440,160L1440,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;