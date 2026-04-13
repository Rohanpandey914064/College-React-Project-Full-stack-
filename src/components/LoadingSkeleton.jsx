import React from 'react';

const SkeletonBox = ({ h = 20, w = '100%', radius = 'var(--r-md)', style = {} }) => (
  <div
    className="skeleton"
    style={{ height: h, width: w, borderRadius: radius, ...style }}
  />
);

export const LoadingSkeletonCard = () => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
    <SkeletonBox h={40} w={40} radius="var(--r-md)" />
    <SkeletonBox h={32} w="60%" />
    <SkeletonBox h={16} w="90%" />
    <SkeletonBox h={16} w="75%" />
  </div>
);

export const LoadingSkeletonRow = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', padding: 'var(--sp-4)' }}>
    <SkeletonBox h={28} w={28} radius="50%" />
    <SkeletonBox h={16} w="30%" />
    <SkeletonBox h={16} w="20%" />
    <SkeletonBox h={16} w="15%" />
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid-4" style={{ marginTop: 'var(--sp-6)' }}>
    {[...Array(4)].map((_, i) => <LoadingSkeletonCard key={i} />)}
  </div>
);

export default LoadingSkeleton;
