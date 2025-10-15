"use client";

const features = [
  {
    title: "AI-Based Recipe Parsing",
    description:
      "Automatically extracts quantities, units, and ingredients using advanced natural language processing with spaCy.",
    icon: "🧠",
  },
  {
    title: "Smart Unit Conversion",
    description:
      "Converts all recipe measurements to precise, standardized values to ensure consistent baking results.",
    icon: "⚖️",
  },
  {
    title: "Unicode Fraction Handling",
    description:
      "Seamlessly understands and processes Unicode fractions like ½, ¾, ⅓ into decimal format.",
    icon: "➗",
  },
  {
    title: "Ingredient Keyword Extraction",
    description:
      "Extracts key ingredients using NLP noun/proper-noun detection to enable tagging, filtering, or future substitution.",
    icon: "🥣",
  },
  {
    title: "Real-Time Processing",
    description:
      "Get results instantly after input – optimized for quick parsing and response in real time.",
    icon: "⚡",
  },
  {
    title: "Clean JSON Output",
    description:
      "Outputs a structured format suitable for APIs, front-end consumption, or recipe modification.",
    icon: "📦",
  },
];

const Features = () => {
  return (
    <section className="py-16 px-4 md:px-10 lg:px-20 bg-base-100 h-[calc(100vh-5.6rem)]">
      <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-base-200 shadow-md rounded-2xl border border-base-300 hover:shadow-xl transition"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-base-content">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
