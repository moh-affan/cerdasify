import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseClient = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null;

export async function uploadToSupabaseStorage(
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<string | null> {
  if (!supabaseClient) return null;

  const bucketName = 'uploads';

  try {
    // Attempt upload
    const { error: uploadError } = await supabaseClient.storage
      .from(bucketName)
      .upload(filename, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      // If bucket does not exist, try to create it
      const statusCode = (uploadError as { statusCode?: string | number }).statusCode;
      if (uploadError.message.includes('not found') || String(statusCode) === '404') {
        await supabaseClient.storage.createBucket(bucketName, { public: true });
        const { error: retryError } = await supabaseClient.storage
          .from(bucketName)
          .upload(filename, fileBuffer, {
            contentType,
            upsert: false,
          });
        if (retryError) {
          console.warn('Supabase storage upload retry failed:', retryError.message);
          return null;
        }
      } else {
        console.warn('Supabase storage upload failed:', uploadError.message);
        return null;
      }
    }

    const { data } = supabaseClient.storage.from(bucketName).getPublicUrl(filename);
    return data?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase storage exception:', err instanceof Error ? err.message : err);
    return null;
  }
}
