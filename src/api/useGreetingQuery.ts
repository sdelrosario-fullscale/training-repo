import { useQuery } from '@tanstack/react-query';

const greetingKey = ['greeting'] as const;

function fetchGreeting(): Promise<string> {
  return Promise.resolve('Client and server state are ready.');
}

export function useGreetingQuery() {
  return useQuery({
    queryKey: greetingKey,
    queryFn: fetchGreeting,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
