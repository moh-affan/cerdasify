import { NextResponse } from 'next/server';

/** Error yang aman ditampilkan ke pengguna, lengkap dengan status HTTP. */
export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
    public extra?: Record<string, unknown>
  ) {
    super(message);
  }
}

export function errorMessage(error: unknown, fallback = 'Server error'): string {
  return error instanceof Error ? error.message : fallback;
}

/**
 * Respons error standar untuk Route Handler.
 * - UNAUTHORIZED / FORBIDDEN dari requireUser/requireAdmin → 401 / 403
 * - ApiError → status & pesannya sendiri
 * - Error lain → dicatat di log server, klien hanya menerima pesan umum (tidak membocorkan detail internal)
 */
export function apiError(error: unknown, logLabel: string) {
  const message = errorMessage(error);
  if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Silakan masuk terlebih dahulu' }, { status: 401 });
  if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Anda tidak memiliki akses' }, { status: 403 });
  if (error instanceof ApiError) return NextResponse.json({ error: error.message, ...error.extra }, { status: error.status });
  console.error(`${logLabel}:`, error);
  return NextResponse.json({ error: 'Terjadi kesalahan pada server. Silakan coba lagi.' }, { status: 500 });
}

/** Membaca body JSON; body rusak menjadi 400, bukan 500. */
export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ApiError('Format data tidak valid', 400);
  }
}
