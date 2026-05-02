import { useState, useEffect } from 'react';
import { listCmsRecords, listPublishedRecords } from '../lib/cmsRepository';

export function useCmsCollection<T>(collectionName: string, publishedOnly: boolean = false) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollection = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = publishedOnly 
        ? await listPublishedRecords<T>(collectionName)
        : await listCmsRecords<T>(collectionName);
      setData(records);
    } catch (err: any) {
      console.error(`Error fetching collection ${collectionName}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [collectionName, publishedOnly]);

  return { data, loading, error, refetch: fetchCollection };
}
