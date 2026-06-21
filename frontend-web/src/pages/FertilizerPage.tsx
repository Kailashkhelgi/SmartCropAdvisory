import React, { useEffect, useState } from 'react';
import { advisoryApi, soilApi } from '../api/client';

interface SoilProfile { id: string; plotName: string; soilType: string; ph: number; }

const CROPS = [
  'Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton',
  'Sugarcane', 'Groundnut', 'Tomato', 'Onion', 'Mustard',
  'Potato', 'Sunflower', 'Chickpea', 'Lentil', 'Bajra',
];

interface FertilizerPageProps {
  plotId?: string;
  cropId?: string;
  onNavigate?: (page: string) => void;
}

const FertilizerPage: React.FC<FertilizerPageProps> = ({ onNavigate }) => {
  const [soilProfiles, setSoilProfiles] = useState<SoilProfile[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    soilApi.list?.()
      .then((res: { data: { data?: SoilProfile[] } }) => {
        const profiles = Array.isArray(res.data?.data) ? res.data.data : [];
        setSoilProfiles(profiles as SoilProfile[]);
        if ((profiles as SoilProfile[]).length === 1) setSelectedPlotId((profiles as SoilProfile[])[0].id);
      })
      .catch(() => setSoilProfiles([]))
      .finally(() => setLoadingProfiles(false));
  }, []);

  const fetchGuidance = () => {
    if (!selectedPlotId || !selectedCrop) return;
    setLoading(true);
    setError('');
    setData(null);
    advisoryApi
      .getFertilizer(selectedPlotId, selectedCrop)
      .then((res) => {
        const payload = res.data?.data ?? res.data;
        setData(payload as Record<string, unknown>);
      })
      .catch((err: unknown) => {
        const axiosErr = err as { response?: { data?: { error?: { message?: string } | string; message?: string } } };
        const errBody = axiosErr.response?.data?.error;
        const msg = typeof errBody === 'object' ? errBody?.message
          : typeof errBody === 'string' ? errBody
          : axiosErr.response?.data?.message ?? 'Failed to load fertilizer guidance.';
        setError(msg ?? 'Failed to load fertilizer guidance.');
      })
      .finally(() => setLoading(false));
  };

  const statusColor = (status: string) => {
    if (status?.toLowerCase().includes('low')) return '#c62828';
    if (status?.toLowerCase().includes('medium')) return '#f57c00';
    return '#2e7d32';
  };

  return (
    <div>
      <h1 className="page-title">🧪 Fertilizer Guidance</h1>

      {/* Selectors */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>Select Field & Crop</h3>

        {loadingProfiles ? (
          <p style={{ color: '#666' }}>Loading soil profiles…</p>
        ) : soilProfiles.length === 0 ? (
          <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: 8 }}>
            <p style={{ margin: 0 }}>
              No soil profiles found.{' '}
              <button type="button" onClick={() => onNavigate?.('soil-profile')}
                style={{ background: 'none', border: 'none', color: 'var(--green-dark)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }}>
                Create a soil profile first →
              </button>
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', color: '#555' }}>Field / Plot:</label>
              <select value={selectedPlotId} onChange={e => { setSelectedPlotId(e.target.value); setData(null); setError(''); }}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }}>
                <option value="">-- Select field --</option>
                {soilProfiles.map(p => (
                  <option key={p.id} value={p.id}>{p.plotName} ({p.soilType})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', color: '#555' }}>Crop:</label>
              <select value={selectedCrop} onChange={e => { setSelectedCrop(e.target.value); setData(null); setError(''); }}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }}>
                <option value="">-- Select crop --</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn-primary" onClick={fetchGuidance}
              disabled={!selectedPlotId || !selectedCrop || loading}
              style={{ padding: '8px 20px', whiteSpace: 'nowrap' }}>
              {loading ? '⏳ Analyzing…' : '🔍 Get Guidance'}
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8 }}>
          <p style={{ margin: 0, color: '#c62828' }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {data && (
        <div>
          {/* Soil Health Status */}
          {data.soilHealth && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>🌱 Soil Health Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                {Object.entries(data.soilHealth as Record<string, string>).map(([key, val]) => (
                  <div key={key} style={{ background: '#f9f9f9', borderRadius: 8, padding: '10px 14px', borderLeft: `4px solid ${statusColor(val)}` }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: 4 }}>
                      {key.replace(/([A-Z])/g, ' $1').replace('Status', '').trim()}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: statusColor(val) }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fertilizer Recommendations */}
          {Array.isArray(data.recommendations) && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>
                💊 Fertilizer Schedule for {data.crop as string}
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {(data.recommendations as Array<Record<string, string>>).map((rec, i) => (
                  <div key={i} style={{ background: '#f1f8e9', borderRadius: 8, padding: '12px 16px', borderLeft: '4px solid var(--green-light)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--green-dark)', marginBottom: 6 }}>{rec.fertilizer}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4px', fontSize: '0.9rem' }}>
                      <span style={{ color: '#666' }}>Quantity:</span>
                      <span style={{ fontWeight: 600 }}>{rec.quantity}</span>
                      <span style={{ color: '#666' }}>Timing:</span>
                      <span>{rec.timing}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy format support */}
          {data.schedule && Array.isArray(data.schedule) && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>💊 Chemical Fertilizer Schedule</h3>
              {(data.schedule as Array<Record<string, unknown>>).map((item, i) => (
                <div key={i} style={{ background: '#f1f8e9', borderRadius: 8, padding: '12px 16px', marginBottom: 8, borderLeft: '4px solid var(--green-light)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--green-dark)' }}>{item.type as string}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
                    <span style={{ color: '#666' }}>Qty: </span><strong>{item.quantity as string} {item.unit as string}</strong>
                    <span style={{ color: '#666', marginLeft: 16 }}>Timing: </span>{item.timing as string}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Organic alternatives */}
          {data.organicAlternatives && Array.isArray(data.organicAlternatives) && (data.organicAlternatives as unknown[]).length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>🌿 Organic Alternatives</h3>
              {(data.organicAlternatives as Array<Record<string, unknown>>).map((item, i) => (
                <div key={i} style={{ background: '#f9f9f9', borderRadius: 8, padding: '12px 16px', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{item.type as string}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
                    {item.quantity as string} {item.unit as string} — {item.timing as string}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Soil Amendments */}
          {data.soilAmendments && Array.isArray(data.soilAmendments) && (data.soilAmendments as unknown[]).length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #0288d1' }}>
              <h3 style={{ marginBottom: '1rem', color: '#01579b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔧 Soil Amendments (pH Correction)
              </h3>
              {(data.soilAmendments as Array<Record<string, unknown>>).map((item, i) => (
                <div key={i} style={{ background: '#e1f5fe', borderRadius: 8, padding: '12px 16px', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: '#01579b' }}>{item.type as string}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
                    <strong>Recommended Qty: </strong>{item.quantity as string} {item.unit as string}
                  </div>
                  {item.reason && (
                    <div style={{ fontSize: '0.85rem', color: '#555', marginTop: 6, fontStyle: 'italic', borderTop: '1px solid #b3e5fc', paddingTop: 6 }}>
                      <strong>Reason: </strong>{item.reason as string}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !error && !data && selectedPlotId && selectedCrop && (
        <div className="card" style={{ textAlign: 'center', color: '#666' }}>
          <p>Click "Get Guidance" to get fertilizer recommendations for your field.</p>
        </div>
      )}
    </div>
  );
};

export default FertilizerPage;
