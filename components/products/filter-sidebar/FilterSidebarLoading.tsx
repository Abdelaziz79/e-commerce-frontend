export function FilterSidebarLoading() {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-none border-r border-gray-200 p-6 space-y-4">
        <div className="h-6 bg-gray-100 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </aside>
  );
}
