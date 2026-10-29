import React from "react";

export function MessageSkeleton() {
  return (
    <div className="skeleton-group" aria-busy="true" aria-label="Loading messages">
      <div className="skeleton skeleton-avatar" />
      <div className="skeleton-lines">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line long" />
        <div className="skeleton skeleton-line medium" />
      </div>
    </div>
  );
}

export function MessageStreamSkeleton({ count = 4 }) {
  return (
    <div className="messages-scroll-area" style={{ overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, index) => (
        <MessageSkeleton key={index} />
      ))}
    </div>
  );
}
