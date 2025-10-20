
import { UrlData } from '../types';

const API_BASE_URL = 'https://api.cbm-publisher.com';

export const shortenUrl = async (url: string): Promise<UrlData> => {
  const formData = new FormData();
  formData.append('url', url);

  const response = await fetch(`${API_BASE_URL}/webhook/domain`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to shorten URL. Please try again.' }));
    throw new Error(errorData.message || 'An unknown error occurred.');
  }

  const data: UrlData[] = await response.json();
  if (!data || data.length === 0) {
    throw new Error('Invalid response from the server.');
  }

  return data[0];
};

export const getRedirectUrl = async (hash: string): Promise<UrlData | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/webhook/redirect?id=${hash}`);

        if (!response.ok) {
            // Treat 404 as "not found", otherwise it's a server error.
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Server error: ${response.status}`);
        }

        const data: UrlData[] = await response.json();
        
        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    } catch (error) {
        console.error('Error fetching redirect URL:', error);
        return null;
    }
};
