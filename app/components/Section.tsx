interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-base text-gray-300">{title}</h2>
      <div className="mt-6 grid grid-cols-3 sm:grid-cols-base gap-4">{children}</div>
    </div>
  );
}