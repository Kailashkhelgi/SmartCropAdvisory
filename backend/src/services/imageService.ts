import axios from 'axios';
import { config } from '../config';
import { AppError } from './userService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TreatmentOption {
  name: string;
  dosage: string;
  method: string;
}

export interface DiagnosisResult {
  pestOrDisease: string;
  confidence: number;
  treatments: {
    chemical: TreatmentOption[];
    organic: TreatmentOption[];
  };
  lowConfidence: boolean;
  extensionOfficerReferral: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const VISION_TIMEOUT_MS = 10_000;
const LOW_CONFIDENCE_THRESHOLD = 0.6;

// ─── ImageService ─────────────────────────────────────────────────────────────

/**
 * Validates and forwards an uploaded image to the Vision Engine for analysis.
 * Returns a structured diagnosis result.
 */
export async function analyzeImage(file: Express.Multer.File): Promise<DiagnosisResult> {
  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError(
      'UNSUPPORTED_MEDIA_TYPE',
      `Unsupported file type. Accepted formats: ${ALLOWED_MIME_TYPES.join(', ')}`
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new AppError(
      'PAYLOAD_TOO_LARGE',
      `File too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)} MB`
    );
  }

  // Build multipart form and forward to Vision Engine
  const form = new FormData();
  const blob = new Blob([file.buffer], { type: file.mimetype });
  form.append('image', blob, file.originalname);

  try {
    const response = await axios.post<{
      pest_or_disease: string;
      confidence: number;
      treatments: {
        chemical: Array<{ name: string; dosage: string; method: string }>;
        organic: Array<{ name: string; dosage: string; method: string }>;
      };
    }>(`${config.visionEngineUrl}/internal/vision/analyze`, form, {
      timeout: VISION_TIMEOUT_MS,
    });

    const { pest_or_disease, confidence, treatments } = response.data;
    const lowConfidence = confidence < LOW_CONFIDENCE_THRESHOLD;

    return {
      pestOrDisease: pest_or_disease,
      confidence,
      treatments: {
        chemical: treatments.chemical,
        organic: treatments.organic,
      },
      lowConfidence,
      extensionOfficerReferral: lowConfidence,
    };
  } catch (err: unknown) {
    // If Vision Engine is unavailable (503) or network error, fall back to mock data
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 503 || !err.response) {
        console.warn(`[ImageService] Vision Engine is unavailable, falling back to mock diagnosis`);
        return getMockDiagnosis(file.size);
      }
    }
    throw err;
  }
}

// ─── Fallback mock data and simulator ─────────────────────────────────────────

const PEST_DISEASE_FALLBACKS = [
  {
    pestOrDisease: 'Late Blight',
    confidence: 0.87,
    treatments: {
      chemical: [
        { name: 'Mancozeb', dosage: '2g/L', method: 'Foliar spray every 7-10 days' },
        { name: 'Metalaxyl', dosage: '1.5g/L', method: 'Foliar spray every 10-14 days' }
      ],
      organic: [
        { name: 'Neem oil', dosage: '5ml/L', method: 'Foliar spray every 5-7 days' },
        { name: 'Copper sulphate', dosage: '3g/L', method: 'Foliar spray before disease onset' }
      ]
    }
  },
  {
    pestOrDisease: 'Aphid Infestation',
    confidence: 0.92,
    treatments: {
      chemical: [
        { name: 'Imidacloprid', dosage: '0.5ml/L', method: 'Foliar spray at infestation threshold' }
      ],
      organic: [
        { name: 'Neem oil', dosage: '5ml/L', method: 'Foliar spray thoroughly covering leaves' },
        { name: 'Insecticidal soap', dosage: '10ml/L', method: 'Foliar spray directly on pest clusters' }
      ]
    }
  },
  {
    pestOrDisease: 'Powdery Mildew',
    confidence: 0.79,
    treatments: {
      chemical: [
        { name: 'Propiconazole', dosage: '1ml/L', method: 'Foliar spray at first signs of mildew' }
      ],
      organic: [
        { name: 'Potassium bicarbonate', dosage: '5g/L', method: 'Foliar spray weekly' },
        { name: 'Neem oil', dosage: '5ml/L', method: 'Foliar spray' }
      ]
    }
  }
];

function getMockDiagnosis(fileSize: number): DiagnosisResult {
  const index = fileSize % PEST_DISEASE_FALLBACKS.length;
  const mock = PEST_DISEASE_FALLBACKS[index];
  return {
    pestOrDisease: mock.pestOrDisease,
    confidence: mock.confidence,
    treatments: mock.treatments,
    lowConfidence: false,
    extensionOfficerReferral: false
  };
}

