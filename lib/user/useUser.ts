import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface IResponse {
  ok: boolean;
  user: {
    id: number;
    name: string;
  };
}

export default function useUser() {
  const router = useRouter();
  const { data, error } = useSWR<IResponse>("/api/user/is-logged-in");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (error || data?.ok === false) {
      router.replace("/log-in");
      setIsLoading(false);
      return;
    }
  }, [data, error, router]);

  useEffect(() => {
    if (data?.ok === true) {
      setIsLoading(false);
    }
  }, [data]);

  return {
    user: data?.user,
    isLoading,
  };
}
