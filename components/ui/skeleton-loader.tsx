"use client";

import React from "react";

interface SkeletonLoaderProps {
  /**
   * Number of skeleton items to show
   */
  count?: number;
  /**
   * Height of skeleton in pixels or CSS units
   */
  height?: string | number;
  /**
   * Width of skeleton in pixels or CSS units
   */
  width?: string | number;
  /**
   * CSS class to apply to skeleton
   */
  className?: string;
  /**
   * Show animated shimmer effect
   */
  shimmer?: boolean;
  /**
   * Border radius
   */
  borderRadius?: string;
}

/**
 * Skeleton Loader Component
 * Generic loading placeholder with optional shimmer animation
 */
export function SkeletonLoader({
  count = 1,
  height = 20,
  width = "100%",
  className = "",
  shimmer = true,
  borderRadius = "0.5rem",
}: SkeletonLoaderProps) {
  return (
    <div
      className={`space-y-4 ${className}`}
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height: typeof height === "number" ? `${height}px` : height,
            width: typeof width === "number" ? `${width}px` : width,
            borderRadius,
            backgroundColor: "#e2e8f0",
            animation: shimmer ? "shimmer 2s infinite" : undefined,
          }}
          className="rounded-md"
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Card Skeleton
 * Skeleton for card-based layouts
 */
export function CardSkeleton({
  count = 1,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-200 dark:bg-slate-700 rounded-lg p-4 space-y-3"
        >
          <SkeletonLoader height={24} width="60%" />
          <SkeletonLoader height={16} width="100%" />
          <SkeletonLoader height={16} width="100%" />
          <SkeletonLoader height={16} width="80%" />
        </div>
      ))}
    </div>
  );
}

/**
 * Text Skeleton
 * Multiple lines of text skeleton
 */
export function TextSkeleton({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} role="status" aria-busy="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader
          key={i}
          height={16}
          width={i === lines - 1 ? "70%" : "100%"}
        />
      ))}
    </div>
  );
}

/**
 * Avatar Skeleton
 * Circular skeleton for avatars
 */
export function AvatarSkeleton({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      role="status"
      aria-busy="true"
    />
  );
}

/**
 * Image Skeleton
 * Skeleton for image placeholders
 */
export function ImageSkeleton({
  width = 400,
  height = 300,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  const aspectRatio = (height / width) * 100;

  return (
    <div
      className={`bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden ${className}`}
      role="status"
      aria-busy="true"
      style={{
        paddingBottom: `${aspectRatio}%`,
        position: "relative",
        width: "100%",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse" />
    </div>
  );
}
