/**
 * Mock request — simulates API calls with configurable delay.
 * Replace with real HTTP calls when integrating with a backend.
 */

export type MockRequestConfig = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  params?: Record<string, unknown>;
  withOutToken?: boolean;
};

/**
 * Simulate a network request with a random delay.
 * In a real app, replace this with axios/fetch calls.
 */
export async function request<T = unknown>(config: MockRequestConfig): Promise<T> {
  // Simulate network latency: 200–800ms
  const delay = 200 + Math.random() * 600;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // This function is meant to be overridden by actual API handlers.
  // See mock-api.ts for the demo implementation.
  throw new Error(
    `Mock request not handled for ${config.method ?? 'GET'} ${config.url}. ` +
    `Import and use the mock API handlers from '@/auth/mock-api'.`,
  );
}
