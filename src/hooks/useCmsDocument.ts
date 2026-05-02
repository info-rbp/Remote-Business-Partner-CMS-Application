import { useState, useEffect } from 'react';
import { getCmsRecord } from '../lib/cmsRepository';

export function useCmsDocument<T>(collectionName: string, id: string | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocument = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const record = await getCmsRecord<T>(collectionName, id);
      setData(record);
    } catch (err: any) {
      console.error(`Error fetching document ${id} from ${collectionName}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [collectionName, id]);

  return { data, loading, error, refetch: fetchDocument };
}
