type MutableRefObject = import('react').MutableRefObject;

export interface Opts {
  /** 埋点时机-露出元素相对于root元素的最小视图比例 */
  minRatio?: number;
  /** IntersectionObserver的options https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API */
  intersectionObserverOpts?: IntersectionObserverInit;
}

declare function useExposure(callback: (id: string) => void, ids: string[], opts: Opts): {
  intersectionObserver: IntersectionObserver | undefined;
  exposuredIds: string[];
  exposuredIdsRef: MutableRefObject<string[]>;
  addExposuredIds: (ids: string[]) => void;
  removeExposuredIds: (id: string) => void;
};

export = useExposure;
