# use-exposure
埋点用的react hooks

## 使用

`npm i use-exposure -S` or `yarn add use-exposure`

针对列表的曝光埋点，曝光项的dom属性上必须挂data-exposure-id=xxx

```tsx
import React, { useState, useEffect } from 'react';
import useExposure from 'useExposure';
import track from 'you-track-pkg';

const Demo: React.FC = () => {
  const [list, setList] = useState([
    { id: '0' },
    { id: '1' },
  ]);

  useExposure((id) => {
    const index = list.find(item => item.id === id);
    track({
      act: 'exposure',
      pg: 'PMXXX',
      blk: 'XXX',
      pos: `T${index}`,
      itemid: `post_${id}`,
      eid: '-1',
      ext: { label: 'xxx' },
    });
  }, list.map(item => `${item.tid}`));

  useEffect(() => {
    const timer = setInterval(() => {
      const newItem = {
        id: `${Date.now()}`,
      };
      setList(oldList => ([...oldList, newItem]));
    }, 1000);
    return () => clearInterval(timer);
  }, [])
  
  return (
    <ul>
      {list.map(item => (
        <li key={item.id} data-exposure-id={item.id}>{item.id}</li>
      ))}
    </ul>
  );
};
```

## api

```typescript
interface Opts {
  /** 埋点时机-露出元素相对于root元素的最小视图比例 */
  minRatio?: number;
  /** IntersectionObserver的options https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API */
  intersectionObserverOpts?: IntersectionObserverInit; // default: threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
}

function useExposure(callback: (id: string) => void, ids: string[], opts: Opts): {
  intersectionObserver: IntersectionObserver | undefined;
  exposuredIds: string[];
  exposuredIdsRef: MutableRefObject<string[]>;
  addExposuredIds: (ids: string[]) => void;
  removeExposuredIds: (id: string) => void;
};
```