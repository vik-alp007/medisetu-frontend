import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tiny data-loading hook with explicit LOADING / ERROR / SUCCESS state.
 * `loader` should be a stable function (module-level service function).
 */
export const useAsync = (loader) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const mounted = useRef(true);

  const run = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await loader();
      if (mounted.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (mounted.current) setState({ data: null, loading: false, error });
    }
  }, [loader]);

  useEffect(() => {
    mounted.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    run();
    return () => {
      mounted.current = false;
    };
  }, [run]);

  return { ...state, reload: run };
};

export default useAsync;
