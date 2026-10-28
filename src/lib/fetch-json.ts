// Helper fetch JSON untuk komponen klien: batas waktu, respons non-JSON aman, dan percobaan ulang.

export interface ApiJson {
  error?: string;
  redirectUrl?: string;
}

/** status 0 = jaringan putus / timeout (tidak ada respons dari server). */
export class RequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: ApiJson = {}
  ) {
    super(message);
  }
}

export async function requestJson<T extends ApiJson>(url: string, init: RequestInit = {}, timeoutMs = 15000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    // Halaman error platform (502/504) berupa HTML, bukan JSON
    const data = (await res.json().catch(() => ({}))) as T;
    if (!res.ok) {
      const fallback = res.status >= 500 ? 'Server sedang sibuk. Silakan coba lagi.' : 'Permintaan gagal diproses.';
      throw new RequestError(data.error || fallback, res.status, data);
    }
    return data;
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError('Koneksi internet terputus atau server tidak merespons.', 0);
  } finally {
    clearTimeout(timer);
  }
}

export const isRetryable = (error: unknown) =>
  error instanceof RequestError && (error.status === 0 || error.status === 429 || error.status >= 500);

/** Ulangi permintaan yang gagal karena jaringan/server dengan jeda 1s, 2s, 4s, ... */
export async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i >= attempts - 1 || !isRetryable(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i));
    }
  }
}
