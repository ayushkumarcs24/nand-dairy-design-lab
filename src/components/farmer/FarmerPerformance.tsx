const FarmerPerformance = () => {
  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-base font-semibold text-slate-900">30-Day Performance</h2>
      <div className="mt-5 flex h-64 items-center justify-center rounded-2xl bg-slate-950">
        {/* Placeholder for chart - can be replaced with real chart library later */}
        <div className="h-40 w-[70%] max-w-md border border-slate-700/60 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900">
          <div className="m-6 h-[70%] border-l border-b border-slate-700/80" />
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        Interactive chart visualizing daily milk collection. Hover to see details.
      </p>
    </section>
  );
};

export default FarmerPerformance;
