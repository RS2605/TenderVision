"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, UploadCloud, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AnalysisData {
  eligibility: string[];
  financial_barriers: string[];
  compliance_checklist: string[];
}

export function TenderAnalysis({ uid }: { uid?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    setData(null);
    setScore(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setData(result.data);
      
      // Real Matching Algorithm connecting Gemini Data + Firestore Profile
      let calculatedScore = 50; // Baseline score
      if (uid) {
        try {
          const profileSnap = await getDoc(doc(db, "msme_profiles", uid));
          if (profileSnap.exists()) {
            const profile = profileSnap.data();
            const keywords = [...(profile.revenueKeywords || []), profile.industry].map((k: string) => k.toLowerCase());
            
            let matchedCriteria = 0;
            let totalCriteria = 0;

            const allCriteria = [...(result.data.eligibility || []), ...(result.data.compliance_checklist || [])];
            
            for (const criteria of allCriteria) {
              totalCriteria++;
              const criteriaLower = criteria.toLowerCase();
              if (keywords.some((k: string) => criteriaLower.includes(k))) {
                matchedCriteria++;
              }
            }
            
            // Add dynamic score based on matching keywords
            if (totalCriteria > 0) {
              calculatedScore = 50 + Math.floor((matchedCriteria / totalCriteria) * 50);
            } else {
              calculatedScore = 75; // No explicit negative criteria found
            }
          }
        } catch (profileErr) {
          console.error("Failed to parse MSME Profile score", profileErr);
        }
      }
      setScore(Math.min(calculatedScore, 100)); 

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please check console.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 w-full relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
      
      {/* Premium File Upload Block */}
      <Card className="flex flex-col items-center justify-center p-8 border-gold/40 border-dashed border-2 hover:bg-white/10 transition-colors">
        <UploadCloud className="w-16 h-16 text-gold mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Upload Tender PDF</h2>
        <p className="text-white/50 mb-6 text-center max-w-sm">
          Select a 50+ page government tender PDF for instant AI extraction and matching.
        </p>
        
        <label className="cursor-pointer">
          <span className="bg-gold text-deepNavy px-6 py-3 rounded-md font-bold shadow-md hover:bg-gold/90 transition-all flex items-center gap-2">
            {file ? file.name : "Browse Files"}
          </span>
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </label>
        
        {file && (
          <Button 
            onClick={handleUpload} 
            disabled={isAnalyzing} 
            className="mt-6 w-full max-w-xs" 
            size="lg"
            variant="secondary"
          >
            {isAnalyzing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Document...</>
            ) : "Start AI Assessment"}
          </Button>
        )}

        {error && <p className="text-red-400 mt-4 font-semibold">{error}</p>}
      </Card>

      {/* Dynamic Results Display */}
      {data && score !== null && (
        <div className="flex flex-col gap-6 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-semibold text-white">Extraction Results</h2>
          </div>
          
          <Card className="flex flex-col items-center justify-center p-8 border-gold/40">
            <h2 className="text-xl font-bold text-white/70 tracking-widest uppercase mb-4">Match Score</h2>
            <div className="relative flex items-center justify-center w-48 h-48 rounded-full border-8 border-white/5">
              <div 
                className="absolute inset-0 rounded-full border-8 border-gold opacity-80" 
                style={{ clipPath: `polygon(0 0, 100% 0, 100% \${score}%, 0 \${score}%)`, transition: 'clip-path 1.5s ease-out' }}
              />
              <span className="text-5xl font-extrabold text-gold">{score}%</span>
            </div>
          </Card>

          <ChecklistCard title="Eligibility Criteria" items={data.eligibility || []} />
          <ChecklistCard title="Financial Barriers" items={data.financial_barriers || []} />
          <ChecklistCard title="Compliance Checklist" items={data.compliance_checklist || []} />
        </div>
      )}
    </div>
  );
}

function ChecklistCard({ title, items }: { title: string, items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
