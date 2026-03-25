"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api";

export function useApiQuery<T>(key: string[], path: string, options?: { enabled?: boolean }) {
  const { getToken } = useAuth();

  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const token = await getToken();
      return apiClient(path, {}, token);
    },
    ...options,
  });
}

export function useApiMutation<TData = unknown, TVariables = unknown>(
  path: string,
  method: string = "POST",
  options?: {
    onSuccess?: (data: TData) => void;
    invalidateKeys?: string[][];
  }
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const token = await getToken();
      return apiClient(
        path,
        {
          method,
          body: variables ? JSON.stringify(variables) : undefined,
        },
        token
      );
    },
    onSuccess: (data) => {
      options?.invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      options?.onSuccess?.(data);
    },
  });
}
