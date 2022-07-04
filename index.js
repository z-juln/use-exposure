import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** 针对列表的曝光埋点，曝光项的dom属性上必须挂data-exposure-id=xxx */
const useExposure = (callback, ids, opts) => {
  const minRatio = opts.minRatio ?? 1;
  const observerOpts = opts.intersectionObserverOpts;

  const exposuredIdsRef = useRef([]);
  const [intersectionObserver, setIntersectionObserver] = useState();
  const hardIds = useMemo(() => [...new Set(ids)], [ids]); // 防止值相同, 数组引用地址不同

  /** 记录已被曝光的ids，防止重复曝光 */
  const addExposuredIds = useCallback((ids) => {
    exposuredIdsRef.current = [...exposuredIdsRef.current, ...ids];
  }, []);

  const removeExposuredId = useCallback((id) => {
    exposuredIdsRef.current = exposuredIdsRef.current.filter(oldId => oldId != id);
  }, []);

  useEffect(() => {
    let observer;
    // setExtData时机一般在useEffect，所以这里要延后执行
    const timer = setTimeout(() => {
      clearTimeout(timer);
      observer = new IntersectionObserver((entrys) => {
        entrys.forEach(({ intersectionRatio, target }) => {
          if (intersectionRatio >= minRatio) {
            const id = target.dataset.exposureId;
            if (typeof id === 'string') {
              callback(id);
              addExposuredIds([id]);
              observer.unobserve(target);
            }
          }
        });
      }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        ...observerOpts,
      });
      setIntersectionObserver(observer);
    }, 0);
    return () => observer?.disconnect?.();
  }, []);

  useEffect(() => {
    if (!intersectionObserver) return;
    const exposuredIds = exposuredIdsRef.current;
    hardIds.filter(id => !exposuredIds.includes(id)).forEach(id => {
      const element = document.querySelector(`[data-exposure-id="${id}"]`);
      if (element) {
        intersectionObserver.observe(element);
      }
    });
  }, [hardIds, intersectionObserver]);

  return {
    intersectionObserver,
    exposuredIds: exposuredIdsRef.current,
    exposuredIdsRef,
    addExposuredIds,
    removeExposuredId,
  };
};

export default useExposure;
