"use client";

const About = () => {
  return (
    <div className="px-6 py-12 bg-base-100 h-[calc(100vh-5.6rem)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">
          About Precision Baking
        </h1>
        <p className="text-lg text-base-content/70 mt-3">
          Transforming baking with precision, accuracy, and AI-driven
          measurement conversions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <img
          src="/precision-baking.png"
          alt="About Precision Baking"
          className="rounded-lg shadow-lg h-96 object-cover mx-auto"
        />

        {/* Text Section */}
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Our Mission</h2>
          <p className="text-base-content/70 mt-3">
            Precision Baking is dedicated to eliminating guesswork in baking by
            converting vague recipe measurements into accurate gram-based
            weights. Our AI-powered tool ensures consistent results, making
            professional-quality baking accessible to everyone.
          </p>

          <h2 className="text-2xl font-semibold text-secondary mt-6">
            Why Choose Precision Baking?
          </h2>
          <ul className="list-disc list-inside text-base-content/70 mt-3 space-y-2">
            <li>
              AI-powered measurement conversion for precise baking results.
            </li>
            <li>
              Extensive ingredient density database for accurate calculations.
            </li>
            <li>User-friendly interface for effortless conversions.</li>
            <li>Consistent and professional-quality baking every time.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
