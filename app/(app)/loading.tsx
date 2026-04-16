function LoadingCard() {
  return (
    <article className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-3 w-28 rounded bg-slate-200" />
      <div className="mt-4 h-8 w-20 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-40 rounded bg-slate-100" />
    </article>
  );
}

export default function AppLoading() {
  return (
    <div className="space-y-8">
      <section className="animate-pulse rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="h-3 w-40 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-80 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </section>

      <section className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-4 w-60 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
        <div className="mt-6 space-y-3">
          <div className="h-12 rounded bg-slate-100" />
          <div className="h-12 rounded bg-slate-100" />
          <div className="h-12 rounded bg-slate-100" />
        </div>
      </section>
    </div>
  );
}
