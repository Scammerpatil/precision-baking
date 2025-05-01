"use client";

const AboutPage = () => {
  return (
    <>
      <section className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          About Precision Baking
        </h1>
        <p className="text-lg text-center text-base-content max-w-2xl mx-auto">
          Welcome to your baking companion! This project is designed to help
          home bakers and professionals convert any recipe into precise,
          structured ingredients using AI.
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-base-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-2">🎯 Our Mission</h2>
            <p className="text-base-content">
              Baking is a science. Our goal is to remove ambiguity from
              traditional recipes by parsing them with AI, ensuring accurate
              measurements, perfect conversions, and clear understanding of each
              ingredient.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-base-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-2">🛠 Built With</h2>
            <ul className="list-disc list-inside text-base-content">
              <li>Next.js (React Framework)</li>
              <li>Tailwind CSS & DaisyUI for frontend</li>
              <li>Python & spaCy for ingredient parsing</li>
              <li>Unicode and regex support for fraction conversions</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-base-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-2">
              🔒 For Logged-In Users
            </h2>
            <p className="text-base-content">As a logged-in user, you can:</p>
            <ul className="list-disc list-inside text-base-content mt-2">
              <li>Upload and convert complex recipes</li>
              <li>Get structured ingredient data in real time</li>
              <li>Save your conversions (coming soon!)</li>
              <li>Customize units (metric/imperial) in future updates</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
