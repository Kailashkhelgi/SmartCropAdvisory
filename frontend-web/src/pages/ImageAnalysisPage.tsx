import React, { useState, useRef } from 'react';

interface AnalysisResult {
  disease: string;
  confidence: number;
  severity: string;
  description: string;
  treatment: string[];
  prevention: string[];
}

// Rule-based local analysis based on visual color patterns
// In production this would call a real ML API
const analyzeImageLocally = (file: File): Promise<AnalysisResult[]> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = Math.min(img.width, 200);
      canvas.height = Math.min(img.height, 200);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data ?? [];

      let yellowPixels = 0, brownPixels = 0, darkPixels = 0, greenPixels = 0, total = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        total++;
        if (r > 180 && g > 150 && b < 80) yellowPixels++;
        else if (r > 120 && g < 80 && b < 60) brownPixels++;
        else if (r < 80 && g < 80 && b < 80) darkPixels++;
        else if (g > r + 20 && g > b + 20) greenPixels++;
      }

      const yellowRatio = yellowPixels / total;
      const brownRatio = brownPixels / total;
      const darkRatio = darkPixels / total;
      const greenRatio = greenPixels / total;

      const results: AnalysisResult[] = [];

      if (yellowRatio > 0.15) {
        results.push({
          disease: 'Leaf Yellowing (Chlorosis)',
          confidence: Math.min(95, Math.round(yellowRatio * 300)),
          severity: yellowRatio > 0.3 ? 'Severe' : 'Moderate',
          description: 'Yellow discoloration of leaves indicating nutrient deficiency (nitrogen, iron, or magnesium) or overwatering.',
          treatment: ['Apply nitrogen-rich fertilizer (Urea @ 20kg/acre)', 'Check soil pH — adjust to 6.0-7.0', 'Reduce irrigation frequency', 'Apply foliar spray of micronutrients'],
          prevention: ['Regular soil testing', 'Balanced NPK fertilization', 'Proper drainage', 'Monitor irrigation schedule'],
        });
      }

      if (brownRatio > 0.1) {
        results.push({
          disease: 'Leaf Blight / Brown Spot',
          confidence: Math.min(90, Math.round(brownRatio * 400)),
          severity: brownRatio > 0.25 ? 'Severe' : 'Moderate',
          description: 'Brown lesions on leaves caused by fungal pathogens (Helminthosporium, Alternaria). Common in humid conditions.',
          treatment: ['Apply Mancozeb 75% WP @ 2.5g/L water', 'Spray Propiconazole 25% EC @ 1ml/L', 'Remove and destroy infected leaves', 'Improve air circulation'],
          prevention: ['Avoid overhead irrigation', 'Crop rotation', 'Use disease-resistant varieties', 'Apply preventive fungicide at early stages'],
        });
      }

      if (darkRatio > 0.2) {
        results.push({
          disease: 'Powdery Mildew / Sooty Mold',
          confidence: Math.min(85, Math.round(darkRatio * 250)),
          severity: 'Moderate',
          description: 'Dark patches or powdery coating on leaves caused by fungal infection. Reduces photosynthesis.',
          treatment: ['Spray Sulphur 80% WP @ 3g/L water', 'Apply Carbendazim 50% WP @ 1g/L', 'Wash leaves with mild soap solution', 'Improve sunlight penetration'],
          prevention: ['Avoid dense planting', 'Ensure good air circulation', 'Avoid excess nitrogen', 'Regular monitoring'],
        });
      }

      if (results.length === 0) {
        if (greenRatio > 0.4) {
          results.push({
            disease: 'Healthy Plant',
            confidence: Math.min(92, Math.round(greenRatio * 150)),
            severity: 'None',
            description: 'The plant appears healthy with good green coloration. No visible signs of disease or pest damage detected.',
            treatment: ['Continue current care routine', 'Maintain regular fertilization schedule'],
            prevention: ['Regular monitoring', 'Balanced nutrition', 'Proper irrigation', 'Timely pest scouting'],
          });
        } else {
          results.push({
            disease: 'Nutrient Deficiency (General)',
            confidence: 65,
            severity: 'Mild',
            description: 'Possible nutrient imbalance detected. Leaves may show mixed symptoms of deficiency.',
            treatment: ['Conduct soil test to identify specific deficiency', 'Apply balanced NPK fertilizer', 'Add organic matter (compost @ 2 tons/acre)', 'Check soil pH'],
            prevention: ['Regular soil testing every season', 'Balanced fertilization program', 'Organic matter addition', 'Proper irrigation management'],
          });
        }
      }

      resolve(results.sort((a, b) => b.confidence - a.confidence));
    };
    img.src = URL.createObjectURL(file);
  });
};

const severityColor = (s: string) => {
  if (s === 'None') return '#2e7d32';
  if (s === 'Mild') return '#f57c00';
  if (s === 'Moderate') return '#e65100';
  return '#c62828';
};

const ImageAnalysisPage: React.FC<{ onNavigate?: (p: string) => void }> = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResults([]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await analyzeImageLocally(image);
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">📷 Crop Image Analysis</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Upload a photo of your crop leaves to detect diseases, pests, and nutrient deficiencies.
      </p>

      {/* Upload Area */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed var(--green-light)', borderRadius: 12, padding: '2rem',
            textAlign: 'center', cursor: 'pointer', background: preview ? '#f1f8e9' : '#fafafa',
            transition: 'all 0.2s',
          }}
        >
          {preview ? (
            <img src={preview} alt="crop" style={{ maxHeight: 250, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
          ) : (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📸</div>
              <p style={{ margin: 0, color: '#666' }}>Drag & drop a crop photo here, or click to select</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#999' }}>Supports JPG, PNG, WEBP</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

        {image && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={analyze} disabled={loading} style={{ flex: 1 }}>
              {loading ? '⏳ Analyzing…' : '🔍 Analyze Crop'}
            </button>
            <button className="btn-secondary" onClick={() => { setImage(null); setPreview(''); setResults([]); }}
              style={{ padding: '8px 16px' }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>🔬 Analysis Results</h3>
          {results.map((r, i) => (
            <div key={i} className="card" style={{ marginBottom: '1rem', borderLeft: `4px solid ${severityColor(r.severity)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--green-dark)' }}>{r.disease}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ background: severityColor(r.severity), color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {r.severity}
                  </span>
                  <span style={{ background: '#e8f5e9', color: 'var(--green-dark)', borderRadius: 20, padding: '2px 10px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {r.confidence}% confidence
                  </span>
                </div>
              </div>

              <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1rem' }}>{r.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#fff3e0', borderRadius: 8, padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#e65100', marginBottom: 8 }}>💊 Treatment</div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#555' }}>
                    {r.treatment.map((t, j) => <li key={j} style={{ marginBottom: 4 }}>{t}</li>)}
                  </ul>
                </div>
                <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>🛡️ Prevention</div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#555' }}>
                    {r.prevention.map((p, j) => <li key={j} style={{ marginBottom: 4 }}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageAnalysisPage;
