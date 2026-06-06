const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const headers = { "Content-Type": "application/json" };
    
    // Gunakan token API jika dikonfigurasi di environment variables
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

    if (!res.ok) {
      return Response.json(
        { error: `HF API returned status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const embedding = Array.isArray(data[0]) ? data[0] : data;
    return Response.json(embedding);
  } catch (err) {
    console.error("Error in server-side encode API:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
