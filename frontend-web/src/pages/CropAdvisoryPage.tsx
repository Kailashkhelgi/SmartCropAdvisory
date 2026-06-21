import React, { useEffect, useState } from 'react';
import { advisoryApi, soilApi } from '../api/client';

interface CropRecommendation {
  rank: number;
  cropName: string;
  expectedYieldRange: string;
  waterRequirement: string;
  estimatedInputCost: string;
  suitabilityScore?: number;
}

interface SoilProfile {
  id: string;
  plotName: string;
  soilType: string;
  ph: number;
}

interface CropAdvisoryPageProps {
  plotId?: string;
  onNavigate?: (page: string) => void;
}

const CropAdvisoryPage: React.FC<CropAdvisoryPageProps> = ({ onNavigate }) => {
  const [soilProfiles, setSoilProfiles] = useState<SoilProfile[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState('');
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');

  // Load soil profiles on mount
  useEffect(() => {
    soilApi.list?.()
      .then((res: { data: { data?: SoilProfile[]; profiles?: SoilProfile[] } }) => {
        const d = res.data?.data ?? (res.data as { profiles?: SoilProfile[] })?.profiles ?? res.data;
        const profiles = Array.isArray(d) ? d : [];
        setSoilProfiles(profiles);
        if (profiles.length === 1) setSelectedPlotId(profiles[0].id);
      })
      .catch(() => setSoilProfiles([]))
      .finally(() => setLoadingProfiles(false));
  }, []);

  const fetchRecommendations = () => {
    if (!selectedPlotId) return;
    setLoading(true);
    setError('');
    setErrorCode('');
    setCrops([]);
    advisoryApi
      .getCrops(selectedPlotId)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        // Handle both array format and object with crops array
        const cropsArray = Array.isArray(data) ? data : data?.crops ?? [];
        
        // Transform backend format to frontend format
        const transformedCrops = cropsArray.map((crop: {
          name: string;
          yieldRange: { min: number; max: number };
          waterRequirement: string;
          estimatedInputCost: number;
        }, index: number) => ({
          rank: index + 1,
          cropName: crop.name,
          expectedYieldRange: `${crop.yieldRange.min}-${crop.yieldRange.max} quintals/acre`,
          waterRequirement: crop.waterRequirement,
          estimatedInputCost: `₹${crop.estimatedInputCost.toLocaleString('en-IN')}/acre`,
          suitabilityScore: 8 - Math.floor(index / 2), // Generate mock suitability scores
        }));
        
        setCrops(transformedCrops);
      })
      .catch((err: unknown) => {
        const axiosErr = err as {
          response?: { data?: { error?: { code?: string; message?: string } | string; message?: string } };
        };
        const errBody = axiosErr.response?.data?.error;
        const code = typeof errBody === 'object' ? errBody?.code ?? '' : '';
        const message =
          typeof errBody === 'object' ? errBody?.message
          : typeof errBody === 'string' ? errBody
          : axiosErr.response?.data?.message ?? 'Failed to load crop recommendations.';
        setErrorCode(code);
        setError(message ?? 'Failed to load crop recommendations.');
      })
      .finally(() => setLoading(false));
  };

  const suitabilityColor = (score?: number) => {
    if (!score) return '#666';
    if (score >= 8) return '#2e7d32';
    if (score >= 5) return '#f57c00';
    return '#c62828';
  };

  return (
    <div>
      <h1 className="page-title">🌾 Crop Advisory</h1>

      {/* Soil Profile Selector */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>Select Your Field</h3>

        {loadingProfiles ? (
          <p style={{ color: '#666' }}>Loading your soil profiles…</p>
        ) : soilProfiles.length === 0 ? (
          <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: 8 }}>
            <p style={{ margin: 0 }}>
              No soil profiles found.{' '}
              <button
                type="button"
                onClick={() => onNavigate?.('soil-profile')}
                style={{ background: 'none', border: 'none', color: 'var(--green-dark)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }}
              >
                Create a soil profile first →
              </button>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', color: '#555' }}>
                Choose a plot/field:
              </label>
              <select
                value={selectedPlotId}
                onChange={e => { setSelectedPlotId(e.target.value); setCrops([]); setError(''); }}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }}
              >
                <option value="">-- Select a field --</option>
                {soilProfiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.plotName} ({p.soilType}, pH {p.ph})
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={fetchRecommendations}
              disabled={!selectedPlotId || loading}
              style={{ padding: '8px 20px', whiteSpace: 'nowrap' }}
            >
              {loading ? '⏳ Analyzing…' : '🔍 Get Recommendations'}
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8 }}>
          {errorCode === 'INCOMPLETE_SOIL_PROFILE' ? (
            <p style={{ margin: 0 }}>
              Your soil profile is incomplete. Please{' '}
              <button type="button" onClick={() => onNavigate?.('soil-profile')}
                style={{ background: 'none', border: 'none', color: 'var(--green-dark)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                complete your soil profile
              </button>{' '}
              (add pH, N, P, K values) before requesting recommendations.
            </p>
          ) : (
            <p style={{ margin: 0, color: '#c62828' }}>{error}</p>
          )}
        </div>
      )}

      {/* Results */}
      {crops.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>
            Top {crops.length} Recommended Crops
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {crops.map((crop) => (
              <div key={crop.rank} className="card" style={{ borderLeft: `4px solid ${suitabilityColor(crop.suitabilityScore)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--green-dark)' }}>
                    #{crop.rank} {crop.cropName}
                  </h3>
                  {crop.suitabilityScore && (
                    <span style={{
                      background: suitabilityColor(crop.suitabilityScore),
                      color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.8rem', fontWeight: 600
                    }}>
                      Score: {crop.suitabilityScore}/10
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                  <div style={{ background: '#f9f9f9', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Expected Yield</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{crop.expectedYieldRange}</div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Water Requirement</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{crop.waterRequirement}</div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Input Cost</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{crop.estimatedInputCost}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && crops.length === 0 && selectedPlotId && (
        <div className="card" style={{ textAlign: 'center', color: '#666' }}>
          <p>Click "Get Recommendations" to analyze your soil and get crop suggestions.</p>
        </div>
      )}
    </div>
  );
};

export default CropAdvisoryPage;
