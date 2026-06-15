import { pipeline, env } from '@xenova/transformers';

// Disable local models search to prevent Webpack bundling errors
env.allowLocalModels = false;

let extractor = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
  }
  return extractor;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Jika berjalan di Vercel (atau env variable HF_API_KEY tersedia), coba gunakan HF Inference API terlebih dahulu.
    // Hal ini untuk menghindari Vercel Function Size limit & Execution Timeout saat mengunduh model.
    const isVercel = process.env.VERCEL === "1" || process.env.NOW_BUILDER === "1";
    const hasHFKey = !!process.env.HF_API_KEY;

    if (isVercel || hasHFKey) {
      try {
        console.log("🔄 Vercel/Production Mode: Menggunakan Hugging Face Inference API...");
        const HF_API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";
        const headers = { "Content-Type": "application/json" };
        
        if (process.env.HF_API_KEY) {
          headers["Authorization"] = `Bearer ${process.env.HF_API_KEY}`;
        }

        const res = await fetch(HF_API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            inputs: query,
            options: { wait_for_model: true },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const embedding = Array.isArray(data[0]) ? data[0] : data;
          return Response.json(embedding);
        } else {
          console.warn(`⚠️ HF API mengembalikan status ${res.status}. Melakukan fallback ke model lokal...`);
        }
      } catch (err) {
        console.warn("⚠️ Gagal memanggil HF API. Melakukan fallback ke model lokal:", err.message);
      }
    }

    // 2. Local Mode: Gunakan @xenova/transformers secara lokal & offline
    console.log("💻 Local/Development Mode: Menggunakan @xenova/transformers lokal...");
    const encode = await getExtractor();
    const output = await encode(query, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);
    
    return Response.json(embedding);
  } catch (err) {
    console.error("❌ Error di server-side encode API:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

