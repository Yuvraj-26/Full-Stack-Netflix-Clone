import useSwr from 'swr'
import fetcher from '@/lib/fetcher';

// use billboard
const useBillboard = () => {
  const { data, error, isLoading } = useSwr('/api/random', fetcher, {
    // disable revalidation
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading
  }
};

export default useBillboard;