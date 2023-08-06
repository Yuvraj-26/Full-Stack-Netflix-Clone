import useSwr from 'swr'

import fetcher from '@/lib/fetcher';

const useCurrentUser = () => {
  // Swr fetches API current but will not fetch again if data already exists
  // no need for state management or redux
  const { data, error, isLoading, mutate } = useSwr('/api/current', fetcher);
  return {
    data,
    error,
    isLoading,
    mutate,
  }
};

export default useCurrentUser;