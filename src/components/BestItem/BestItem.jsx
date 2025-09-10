import { useEffect, useRef, useState } from 'react';
import ItemCard from '../itemCard/ItemCard';
import Items from '../../item.json';

const BestItem = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRef = useRef(null);

  const bestItems = Items.filter((e) => e.best);
  const visibleItems = bestItems.slice(0, visibleCount);

  useEffect(() => {
    if (visibleCount >= bestItems.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, bestItems.length));
        }
      },
      {
        rootMargin: '100px',
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [visibleCount, bestItems.length]);

  if (bestItems.length === 0) {
    return <div className="text-center text-gray-500 mt-16 mb-36">لا توجد منتجات متاحة حالياً.</div>;
  }

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-1 mt-3 px-3">
      {visibleItems.map((item, i) => (
        <ItemCard key={i} item={item} />
      ))}

      {/* Load More Trigger */}
      {visibleCount < bestItems.length && (
        <div ref={loadMoreRef} className="col-span-full h-10"></div>
      )}
    </div>
  );
};

export default BestItem;
