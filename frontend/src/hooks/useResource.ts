import { useEffect, useState } from 'react';

export type ResourceState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'ready'; data: T; error: null }
  | { status: 'error'; data: null; error: string };

/**
 * Module-level request cache. `/api/jobs/` is read by both the hero (for the
 * derived figures) and the experience index, and the payload is immutable for
 * the lifetime of a page view, so it should cross the wire exactly once.
 */
const inflight = new Map<string, Promise<unknown>>();

/** Test seam: drops the cache so each case starts from a cold network. */
export const clearResourceCache = (): void => inflight.clear();

const load = <T,>(url: string): Promise<T> => {
  const cached = inflight.get(url);
  if (cached) return cached as Promise<T>;

  const request = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json() as Promise<T>;
    })
    .catch((err) => {
      // A failed request must not be cached, or a transient blip becomes permanent.
      inflight.delete(url);
      throw err;
    });

  inflight.set(url, request);
  return request;
};

/**
 * Fetches a read-only API list endpoint and models all three states explicitly.
 * The previous components dropped failures into `console.error` and rendered
 * nothing, which is indistinguishable from "this person has no experience".
 */
export function useResource<T>(url: string): ResourceState<T> {
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let active = true;

    load<T>(url)
      .then((data) => {
        if (active) setState({ status: 'ready', data, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        setState({
          status: 'error',
          data: null,
          error: err instanceof Error ? err.message : 'Request failed',
        });
      });

    return () => {
      active = false;
    };
  }, [url]);

  return state;
}
