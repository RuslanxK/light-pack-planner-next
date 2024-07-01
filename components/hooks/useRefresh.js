import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const useRefresh = () => {
  const router = useRouter();
  const [isTriggered, setIsTriggered] = useState(false);
  const [resolve, setResolve] = useState(null);
  const [isPending, startTransition] = useTransition();

  const refresh = () => new Promise((resolve) => {
    setResolve(() => resolve);
    startTransition(() => {
      router.refresh();
    });
  });

  useEffect(() => {
    if (isTriggered && !isPending) {
      resolve?.();
      setIsTriggered(false);
      setResolve(null);
    }
    if (isPending) {
      setIsTriggered(true);
    }
  }, [isTriggered, isPending, resolve]);

  return { refresh };
};

export default useRefresh;
