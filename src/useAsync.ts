import React from "react";

type FunctionReturningPromise<T> = () => Promise<T>;

export type UseAsyncReturn<T> = {
  value: T | null;
  error: Error | null;
  loading: boolean;
};

export function useAsync<T>(fn: FunctionReturningPromise<T>) {
  const [state, setState] = React.useState<UseAsyncReturn<T>>({
    value: null,
    error: null,
    loading: true,
  });

  React.useEffect(() => {
    fn().then(
      (value) => setState({ value, error: null, loading: false }),
      (error) => setState({ value: null, error, loading: false }),
    );
  }, [fn]);

  return state;
}
