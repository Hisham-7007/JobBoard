"use client";

export default function JobCarouselSkeleton() {
  return (
    <div className="relative min-h-[400px] bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-2xl border border-gray-100 animate-pulse">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full">
          {/* Company Logo Placeholder */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-xl sm:rounded-2xl" />

          {/* Title & Company Placeholders */}
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        {/* Trending Badge Placeholder */}
        <div className="h-6 bg-gray-200 rounded-full w-12 mt-2 sm:mt-0" />
      </div>

      {/* Location & Date Placeholders */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>

      {/* Description Placeholder */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>

      {/* Skills Placeholders */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-6 bg-gray-200 rounded-lg w-16" />
        <div className="h-6 bg-gray-200 rounded-lg w-20" />
        <div className="h-6 bg-gray-200 rounded-lg w-14" />
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="space-y-1 text-right">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-5 bg-gray-200 rounded w-12" />
          </div>
          <div className="flex-1 sm:flex-none h-10 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Carousel Controls Placeholders */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-4 sm:mt-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
}
