import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}
type UseMutationReturn<T> = [(data: any) => void, UseMutationState<T>];

export default function UseMutation<T = any>(url: string): UseMutationReturn<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  function mutation(data: any) {
    setState({
      loading: true,
      data: undefined,
      error: undefined,
    });
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setState((prev) => ({
          ...prev,
          data,
        }));
      })
      .catch((error) => {
        setState((prev) => ({
          ...prev,
          error,
        }));
      })
      .finally(() => {
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      });
  }
  return [mutation, state];
}
