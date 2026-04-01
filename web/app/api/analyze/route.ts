import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // Convert PDF Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text from PDF using pdf-parse securely on the server
    console.log("Analyzing uploaded PDF...");
    const pdfData = await pdfParse(buffer);
    const fullText = pdfData.text;

    console.log(`Extracted \${fullText.length} characters from PDF.`);

    // Chunking Strategy Implementation (Approx 3000 tokens ~ 12,000 characters per chunk)
    // To avoid hitting API context limits for 50+ page PDFs, we implement a simple split:
    const chunkSize = 12000;
    const maxChunks = 5; // Limiting for MVP performance so it doesn't timeout Vercel
    let chunks = [];
    
    for (let i = 0; i < fullText.length; i += chunkSize) {
      chunks.push(fullText.substring(i, i + chunkSize));
      if (chunks.length >= maxChunks) break; // MVP limit
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let combinedInsights = "";

    console.log("Processing chunks through Gemini 1.5 Flash...");
    for (let i = 0; i < chunks.length; i++) {
      const chunkPrompt = `
        Analyze the following tender document chunk. Extract ONLY:
        1. Direct Eligibility Criteria
        2. Financial Barriers
        3. Compliance Checklist
        
        Tender Document Text:
        \${chunks[i]}
      `;
      const result = await model.generateContent(chunkPrompt);
      combinedInsights += result.response.text() + "\n";
    }

    // Final Summary Aggregation Prompt (The Magic Sauce)
    const summaryPrompt = `
      You are a specialized government tender analyst. Here are the extracted raw insights from a large PDF document:
      \${combinedInsights}
      
      Summarize everything into a clean JSON structure with these exact keys. Merge duplicates and keep it professional:
      {
        "eligibility": ["..."],
        "financial_barriers": ["..."],
        "compliance_checklist": ["..."]
      }
      Respond ONLY with valid JSON. Do not include markdown \`\`\`json wrappers.
    `;

    const finalResult = await model.generateContent(summaryPrompt);
    const responseText = finalResult.response.text();
    
    // Clean up JSON response
    const cleanedJson = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    const data = JSON.parse(cleanedJson);

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to analyze document" }, { status: 500 });
  }
}
