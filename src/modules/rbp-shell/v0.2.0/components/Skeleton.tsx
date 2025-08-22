// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
import React from "react";

export default function Skeleton() {
  const Shimmer = ({ className = "" }) => <div className={`animate-pulse rounded-xl bg-black/5 ${className}`} />;
  return (
    <div className="grid gap-6">
      <Shimmer className="h-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <Shimmer className="h-28" />
          <Shimmer className="h-28" />
        </div>
        <Shimmer className="h-28" />
      </div>
      <Shimmer className="h-40" />
    </div>
  );
}
// <!-- END RBP GENERATED: rbp-shell-mvp -->
