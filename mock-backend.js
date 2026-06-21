const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data
const mockUser = {
  id: '1',
  name: 'Demo Farmer',
  mobileNumber: '8147288280',
  preferredLang: 'en',
  village: 'Demo Village',
  district: 'Ludhiana',
  state: 'Punjab',
  landSizeAcres: 5
};

const mockSoilProfiles = [
  {
    id: '1',
    farmerId: '1',
    plotName: 'North Field',
    latitude: 30.9010,
    longitude: 75.8573,
    soilType: 'Loamy',
    ph: 7.2,
    nitrogen: 120,
    phosphorus: 40,
    potassium: 80
  }
];

const mockCropRecommendations = [
  {
    name: 'Wheat',
    yieldRange: { min: 25, max: 35 },
    waterRequirement: 'Medium (450-650mm)',
    estimatedInputCost: 15000,
    suitabilityScore: 9
  },
  {
    name: 'Rice',
    yieldRange: { min: 30, max: 45 },
    waterRequirement: 'High (1200-1500mm)',
    estimatedInputCost: 18000,
    suitabilityScore: 8
  },
  {
    name: 'Maize',
    yieldRange: { min: 35, max: 50 },
    waterRequirement: 'Medium (500-800mm)',
    estimatedInputCost: 12000,
    suitabilityScore: 7
  },
  {
    name: 'Cotton',
    yieldRange: { min: 15, max: 25 },
    waterRequirement: 'Medium (600-800mm)',
    estimatedInputCost: 20000,
    suitabilityScore: 7
  },
  {
    name: 'Sugarcane',
    yieldRange: { min: 600, max: 900 },
    waterRequirement: 'High (1500-2500mm)',
    estimatedInputCost: 35000,
    suitabilityScore: 6
  },
  {
    name: 'Potato',
    yieldRange: { min: 120, max: 150 },
    waterRequirement: 'Medium (500-700mm)',
    estimatedInputCost: 22000,
    suitabilityScore: 8
  },
  {
    name: 'Tomato',
    yieldRange: { min: 200, max: 350 },
    waterRequirement: 'High (600-800mm)',
    estimatedInputCost: 25000,
    suitabilityScore: 8
  }
];

function generateMockWeatherData(lat, lon) {
  const now = new Date();
  const list = [];
  
  // Generate 40 intervals of 3 hours each (5 days)
  for (let i = 0; i < 40; i++) {
    const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Diurnal temp variation: warmer in afternoon, cooler at night
    const baseTemp = 28;
    const tempVar = 6 * Math.sin((hour - 8) / 24 * 2 * Math.PI); // peak around 2 PM
    const daySeed = Math.sin(i / 8); // multiday wave
    const temp = Math.round((baseTemp + tempVar + daySeed * 3) * 10) / 10;
    
    const feels_like = Math.round((temp + (Math.random() > 0.5 ? 1 : -1) * Math.random()) * 10) / 10;
    const humidity = Math.round(50 + 20 * Math.sin((hour + 4) / 24 * 2 * Math.PI) + Math.random() * 5);
    const pressure = Math.round(1008 + Math.sin(hour / 12 * Math.PI) * 2);
    const windSpeed = Math.round((3 + Math.random() * 4 + (i % 7 === 0 ? 5 : 0)) * 10) / 10;
    
    let main = 'Clear';
    let description = 'clear sky';
    let pop = 0;
    let rain3h = 0;
    
    if (i % 8 === 2 || i % 8 === 3) {
      main = 'Clouds';
      description = 'scattered clouds';
    } else if (i % 15 === 0) {
      main = 'Rain';
      description = 'light rain';
      pop = 0.25;
      rain3h = 0.8;
    } else if (i === 12) {
      main = 'Thunderstorm';
      description = 'thunderstorm with rain';
      pop = 0.85;
      rain3h = 4.5;
    } else if (i % 10 === 0) {
      main = 'Clouds';
      description = 'broken clouds';
    }
    
    const yyyy = time.getFullYear();
    const mm = String(time.getMonth() + 1).padStart(2, '0');
    const dd = String(time.getDate()).padStart(2, '0');
    const hh = String(time.getHours()).padStart(2, '0');
    const dt_txt = `${yyyy}-${mm}-${dd} ${hh}:00:00`;
    
    list.push({
      dt: Math.floor(time.getTime() / 1000),
      main: {
        temp,
        feels_like,
        humidity,
        pressure
      },
      weather: [
        {
          main,
          description,
          icon: main === 'Clear' ? '01d' : main === 'Clouds' ? '03d' : main === 'Rain' ? '10d' : '11d'
        }
      ],
      wind: {
        speed: windSpeed
      },
      dt_txt,
      pop,
      rain: rain3h > 0 ? { '3h': rain3h } : undefined
    });
  }

  return {
    lat: lat || 30.9010,
    lon: lon || 75.8573,
    temperature: list[0].main.temp,
    humidity: list[0].main.humidity,
    list,
    lastUpdated: new Date().toISOString()
  };
}

const mockMarketPrices = [
  {
    crop: 'Wheat',
    mandi: 'Ludhiana Mandi',
    minPrice: 2100,
    maxPrice: 2250,
    modalPrice: 2180,
    distance: 5,
    lastUpdated: new Date().toISOString()
  },
  {
    crop: 'Wheat',
    mandi: 'Jalandhar Mandi',
    minPrice: 2080,
    maxPrice: 2230,
    modalPrice: 2160,
    distance: 45,
    lastUpdated: new Date().toISOString()
  },
  {
    crop: 'Wheat',
    mandi: 'Amritsar Mandi',
    minPrice: 2120,
    maxPrice: 2270,
    modalPrice: 2200,
    distance: 85,
    lastUpdated: new Date().toISOString()
  }
];

// Auth endpoints
app.post('/api/v1/auth/register', (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: mockUser,
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token'
    },
    error: null
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: mockUser,
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token'
    },
    error: null
  });
});

// Farmer endpoints
app.get('/api/v1/farmers/me', (req, res) => {
  res.json({
    status: 'success',
    data: mockUser,
    error: null
  });
});

app.put('/api/v1/farmers/me', (req, res) => {
  res.json({
    status: 'success',
    data: { ...mockUser, ...req.body },
    error: null
  });
});

// Soil profile endpoints
app.get('/api/v1/soil-profiles', (req, res) => {
  res.json({
    status: 'success',
    data: mockSoilProfiles,
    error: null
  });
});

app.post('/api/v1/soil-profiles', (req, res) => {
  const newProfile = { id: Date.now().toString(), ...req.body };
  res.json({
    status: 'success',
    data: newProfile,
    error: null
  });
});

app.get('/api/v1/soil-profiles/:id', (req, res) => {
  res.json({
    status: 'success',
    data: mockSoilProfiles[0],
    error: null
  });
});

// Advisory endpoints
app.get('/api/v1/advisory/crops', (req, res) => {
  res.json({
    status: 'success',
    data: mockCropRecommendations,
    error: null
  });
});

app.get('/api/v1/advisory/fertilizer', (req, res) => {
  const cropName = req.query.cropName || 'Wheat';
  
  // Crop-specific fertilizer recommendations
  const fertilizerData = {
    'Wheat': {
      cropName: 'Wheat',
      schedule: [
        {
          stage: 'Sowing',
          fertilizer: 'DAP (Diammonium Phosphate)',
          quantity: '50 kg/acre',
          timing: 'At sowing time'
        },
        {
          stage: 'First Irrigation (CRI Stage)',
          fertilizer: 'Urea',
          quantity: '40 kg/acre',
          timing: '21 days after sowing'
        },
        {
          stage: 'Second Irrigation',
          fertilizer: 'Urea',
          quantity: '30 kg/acre',
          timing: '40 days after sowing'
        },
        {
          stage: 'Third Irrigation',
          fertilizer: 'Potash (MOP)',
          quantity: '20 kg/acre',
          timing: '60 days after sowing'
        }
      ],
      organicAlternatives: [
        {
          name: 'Vermicompost',
          quantity: '2 tons/acre',
          timing: 'Before sowing, mix with soil'
        },
        {
          name: 'Farm Yard Manure (FYM)',
          quantity: '5 tons/acre',
          timing: '2 weeks before sowing'
        }
      ],
      soilAmendments: 'For pH below 6.5, apply lime @ 200 kg/acre'
    },
    'Rice': {
      cropName: 'Rice',
      schedule: [
        {
          stage: 'Nursery Preparation',
          fertilizer: 'DAP',
          quantity: '30 kg/acre',
          timing: 'Before sowing in nursery'
        },
        {
          stage: 'Transplanting',
          fertilizer: 'Urea + DAP',
          quantity: '25 kg Urea + 60 kg DAP/acre',
          timing: 'At transplanting time'
        },
        {
          stage: 'Tillering Stage',
          fertilizer: 'Urea',
          quantity: '50 kg/acre',
          timing: '20-25 days after transplanting'
        },
        {
          stage: 'Panicle Initiation',
          fertilizer: 'Urea + Potash',
          quantity: '40 kg Urea + 30 kg MOP/acre',
          timing: '40-45 days after transplanting'
        },
        {
          stage: 'Flowering',
          fertilizer: 'Urea',
          quantity: '25 kg/acre',
          timing: '60-65 days after transplanting'
        }
      ],
      organicAlternatives: [
        {
          name: 'Green Manure (Dhaincha)',
          quantity: '8-10 kg seeds/acre',
          timing: '45 days before transplanting, incorporate into soil'
        },
        {
          name: 'Azolla (Bio-fertilizer)',
          quantity: '500 gm/acre',
          timing: 'Apply in standing water after 10 days of transplanting'
        }
      ],
      soilAmendments: 'Apply Zinc Sulphate @ 10 kg/acre if zinc deficiency observed'
    },
    'Maize': {
      cropName: 'Maize',
      schedule: [
        {
          stage: 'Sowing',
          fertilizer: 'DAP + Potash',
          quantity: '40 kg DAP + 20 kg MOP/acre',
          timing: 'At sowing time'
        },
        {
          stage: 'Knee-High Stage',
          fertilizer: 'Urea',
          quantity: '50 kg/acre',
          timing: '25-30 days after sowing'
        },
        {
          stage: 'Tasseling Stage',
          fertilizer: 'Urea',
          quantity: '35 kg/acre',
          timing: '45-50 days after sowing'
        },
        {
          stage: 'Silking Stage',
          fertilizer: 'Foliar spray - 19:19:19',
          quantity: '2 kg in 200 L water/acre',
          timing: '60-65 days after sowing'
        }
      ],
      organicAlternatives: [
        {
          name: 'Compost',
          quantity: '3 tons/acre',
          timing: 'Before sowing, incorporate into soil'
        },
        {
          name: 'Poultry Manure',
          quantity: '1.5 tons/acre',
          timing: '2 weeks before sowing'
        }
      ],
      soilAmendments: 'Apply Sulphur @ 15 kg/acre if soil is deficient'
    },
    'Cotton': {
      cropName: 'Cotton',
      schedule: [
        {
          stage: 'Sowing',
          fertilizer: 'DAP + Potash',
          quantity: '50 kg DAP + 25 kg MOP/acre',
          timing: 'At sowing time'
        },
        {
          stage: 'Vegetative Growth',
          fertilizer: 'Urea',
          quantity: '40 kg/acre',
          timing: '30-35 days after sowing'
        },
        {
          stage: 'Square Formation',
          fertilizer: 'Urea + Potash',
          quantity: '35 kg Urea + 20 kg MOP/acre',
          timing: '50-55 days after sowing'
        },
        {
          stage: 'Flowering',
          fertilizer: 'Urea',
          quantity: '30 kg/acre',
          timing: '75-80 days after sowing'
        },
        {
          stage: 'Boll Development',
          fertilizer: 'Foliar spray - 0:52:34',
          quantity: '2 kg in 200 L water/acre',
          timing: '90-95 days after sowing'
        }
      ],
      organicAlternatives: [
        {
          name: 'Neem Cake',
          quantity: '200 kg/acre',
          timing: 'Before sowing, mix with soil'
        },
        {
          name: 'Vermicompost',
          quantity: '2.5 tons/acre',
          timing: 'Before sowing'
        }
      ],
      soilAmendments: 'Apply Gypsum @ 200 kg/acre for better fiber quality'
    },
    'Sugarcane': {
      cropName: 'Sugarcane',
      schedule: [
        {
          stage: 'Planting',
          fertilizer: 'FYM + DAP + Potash',
          quantity: '10 tons FYM + 60 kg DAP + 30 kg MOP/acre',
          timing: 'At planting time'
        },
        {
          stage: 'Tillering (45 days)',
          fertilizer: 'Urea',
          quantity: '80 kg/acre',
          timing: '45 days after planting'
        },
        {
          stage: 'Grand Growth (90 days)',
          fertilizer: 'Urea + Potash',
          quantity: '70 kg Urea + 40 kg MOP/acre',
          timing: '90 days after planting'
        },
        {
          stage: 'Elongation (120 days)',
          fertilizer: 'Urea',
          quantity: '50 kg/acre',
          timing: '120 days after planting'
        }
      ],
      organicAlternatives: [
        {
          name: 'Press Mud',
          quantity: '5 tons/acre',
          timing: 'At planting, mix in furrows'
        },
        {
          name: 'Bio-compost',
          quantity: '3 tons/acre',
          timing: 'Before planting'
        }
      ],
      soilAmendments: 'Apply Sulphur @ 20 kg/acre and Zinc Sulphate @ 12 kg/acre'
    },
    'Potato': {
      cropName: 'Potato',
      schedule: [
        {
          stage: 'Planting',
          fertilizer: 'DAP + Potash',
          quantity: '80 kg DAP + 50 kg MOP/acre',
          timing: 'At planting time in furrows'
        },
        {
          stage: 'Earthing Up',
          fertilizer: 'Urea',
          quantity: '60 kg/acre',
          timing: '25-30 days after planting'
        },
        {
          stage: 'Tuber Initiation',
          fertilizer: 'Urea + Potash',
          quantity: '40 kg Urea + 30 kg MOP/acre',
          timing: '45-50 days after planting'
        },
        {
          stage: 'Tuber Bulking',
          fertilizer: 'Foliar spray - 19:19:19',
          quantity: '2.5 kg in 200 L water/acre',
          timing: '60-65 days after planting'
        }
      ],
      organicAlternatives: [
        {
          name: 'Well-decomposed FYM',
          quantity: '8 tons/acre',
          timing: '2 weeks before planting'
        },
        {
          name: 'Vermicompost',
          quantity: '2 tons/acre',
          timing: 'At planting time'
        }
      ],
      soilAmendments: 'Apply Sulphur @ 25 kg/acre for better tuber quality'
    },
    'Tomato': {
      cropName: 'Tomato',
      schedule: [
        {
          stage: 'Transplanting',
          fertilizer: 'DAP + Potash',
          quantity: '60 kg DAP + 40 kg MOP/acre',
          timing: 'At transplanting time'
        },
        {
          stage: 'Vegetative Growth',
          fertilizer: 'Urea',
          quantity: '50 kg/acre',
          timing: '20-25 days after transplanting'
        },
        {
          stage: 'Flowering',
          fertilizer: 'Urea + Potash',
          quantity: '40 kg Urea + 30 kg MOP/acre',
          timing: '40-45 days after transplanting'
        },
        {
          stage: 'Fruit Development',
          fertilizer: 'Calcium Nitrate',
          quantity: '30 kg/acre',
          timing: '60-65 days after transplanting'
        },
        {
          stage: 'Fruit Ripening',
          fertilizer: 'Foliar spray - 0:52:34',
          quantity: '2 kg in 200 L water/acre',
          timing: '75-80 days after transplanting'
        }
      ],
      organicAlternatives: [
        {
          name: 'Vermicompost',
          quantity: '3 tons/acre',
          timing: 'Before transplanting'
        },
        {
          name: 'Neem Cake',
          quantity: '150 kg/acre',
          timing: 'At transplanting time'
        }
      ],
      soilAmendments: 'Apply Calcium @ 50 kg/acre to prevent blossom end rot'
    }
  };
  
  // Get fertilizer data for the requested crop, default to Wheat if not found
  const cropId = req.query.cropId || req.query.cropName || 'Wheat';
  const rawData = fertilizerData[cropId] || fertilizerData['Wheat'];
  
  const mappedSchedule = (rawData.schedule || []).map(item => {
    const qtyStr = item.quantity || '';
    const numPart = parseFloat(qtyStr) || 0;
    const unitPart = qtyStr.replace(/^[0-9.\s]+/, '') || 'kg/acre';
    return {
      type: item.fertilizer,
      quantity: numPart,
      unit: unitPart,
      timing: `${item.stage} (${item.timing})`
    };
  });

  const mappedOrganic = (rawData.organicAlternatives || []).map(item => {
    const qtyStr = item.quantity || '';
    const numPart = parseFloat(qtyStr) || 0;
    const unitPart = qtyStr.replace(/^[0-9.\s]+/, '') || 'tons/acre';
    return {
      type: item.name,
      quantity: numPart,
      unit: unitPart,
      timing: item.timing
    };
  });

  const mappedAmendments = [];
  if (rawData.soilAmendments) {
    mappedAmendments.push({
      type: 'Agricultural Amendment',
      quantity: 200,
      unit: 'kg/acre',
      reason: rawData.soilAmendments
    });
  }

  res.json({
    status: 'success',
    data: {
      crop: cropId,
      schedule: mappedSchedule,
      organicAlternatives: mappedOrganic,
      soilAmendments: mappedAmendments
    },
    error: null
  });
});

// Weather endpoint
app.get('/api/v1/weather', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const weatherData = generateMockWeatherData(lat, lon);
  res.json({
    status: 'success',
    data: weatherData,
    error: null
  });
});

// Market prices endpoint
app.get('/api/v1/market-prices', (req, res) => {
  res.json({
    status: 'success',
    data: mockMarketPrices,
    error: null
  });
});

// Image analysis endpoint
app.post('/api/v1/images/analyze', (req, res) => {
  res.json({
    status: 'success',
    data: {
      pestOrDisease: 'Late Blight',
      confidence: 0.87,
      treatments: {
        chemical: [
          {
            name: 'Mancozeb',
            dosage: '2g/L',
            method: 'Foliar spray every 7-10 days'
          }
        ],
        organic: [
          {
            name: 'Neem oil',
            dosage: '5ml/L',
            method: 'Foliar spray every 5-7 days'
          }
        ]
      }
    },
    error: null
  });
});

// Feedback endpoint
app.post('/api/v1/feedback', (req, res) => {
  res.json({
    status: 'success',
    data: { message: 'Feedback recorded successfully' },
    error: null
  });
});

// Notifications endpoint
app.get('/api/v1/notifications', (req, res) => {
  res.json({
    status: 'success',
    data: [
      {
        id: '1',
        type: 'weather_alert',
        message: 'Heavy rainfall expected in next 24 hours. Take protective measures.',
        createdAt: new Date().toISOString()
      }
    ],
    error: null
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
  console.log('Frontend can now connect to this mock API');
});
