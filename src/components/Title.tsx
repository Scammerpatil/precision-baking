export default function Title({ title }: { title: string }) {
  return (
    <h1 className="text-4xl font-bold mb-6 text-center uppercase py-4 bg-primary/10">
      {title}
    </h1>
  );
}
