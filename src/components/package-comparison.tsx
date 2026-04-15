export function PackageComparison() {
  const items = [
    {
      label: "Best for short trips",
      description: "Smaller plans for arrival days, maps and messaging.",
    },
    {
      label: "Best for balanced travel",
      description: "Mid-sized plans for social media, navigation and daily browsing.",
    },
    {
      label: "Best for heavy usage",
      description: "Larger plans for hotspot, video and work-heavy itineraries.",
    },
  ];

  return (
    <div className="grid gap-3 rounded-[2rem] border border-slate-200/80 bg-slate-50/90 p-3 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1.5rem] bg-white px-5 py-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold text-slate-950">{item.label}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
