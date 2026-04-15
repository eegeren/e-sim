export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`space-y-3 ${center ? "text-center" : ""}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-600">
        {eyebrow}
      </p>
      <h2 className="font-mono text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className={`text-base leading-8 text-slate-500 ${center ? "mx-auto max-w-2xl" : "max-w-3xl"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
