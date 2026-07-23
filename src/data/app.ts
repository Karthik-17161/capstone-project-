export const user = {
  name: "Karthik",
  farm: "Green Valley Farms",
  location: "vijayavada,vaddesaram",
  fields: 6,
  language: "English",
  avatar: "K",
};

export const kpis = [
  { label: "Total Detections", value: 1284, delta: "+12.4%", tone: "primary" },
  { label: "Today's Detections", value: 37, delta: "+3", tone: "accent" },
  { label: "High Risk Cases", value: 9, delta: "-2", tone: "orange" },
  { label: "Healthy Plants", value: "94%", delta: "+1.2%", tone: "leaf" },
] as const;

export const weeklyDetections = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: [18, 24, 31, 22, 46, 39, 37],
};

export const pestDistribution = {
  labels: ["Whitefly", "Aphid", "Bollworm", "Thrips", "Mealybug"],
  values: [42, 26, 14, 11, 7],
};

export const weather = {
  now: {
    temp: 31,
    humidity: 82,
    rain: 0,
    wind: 8,
    condition: "Partly cloudy",
  },
  forecast: [
    { day: "Thu", temp: 32, cond: "sun", rain: 0 },
    { day: "Fri", temp: 30, cond: "cloud", rain: 10 },
    { day: "Sat", temp: 28, cond: "rain", rain: 60 },
    { day: "Sun", temp: 29, cond: "cloud", rain: 20 },
    { day: "Mon", temp: 33, cond: "sun", rain: 0 },
  ],
};

export const crop = {
  name: "Cotton",
  stage: "Vegetative",
  planted: 48,
  previousSpray: "Neem Oil",
  lastSpray: "2026-07-10",
};

export const detection = {
  image: "Cotton Leaf",
  pest: "Whitefly",
  scientific: "Bemisia tabaci",
  confidence: 97.3,
  severity: "Moderate",
  lifeStage: "Adult",
  boxes: 6,
  detectedAt: "2026-07-22 09:14",
  riskLevel: "High",
  riskScore: 86,
  factors: [
    { label: "Weather", value: 78 },
    { label: "Severity", value: 62 },
    { label: "Crop Stage", value: 88 },
    { label: "Field History", value: 71 },
  ],
};

export const recommendation = {
  name: "Imidacloprid",
  type: "Chemical",
  dosage: "0.3 ml/L",
  sprayWithin: "24 Hours",
  reason:
    "Whitefly infestation confirmed at moderate severity during peak vegetative stage. Warm humid conditions accelerate reproduction — a systemic neonicotinoid provides fast knockdown and residual protection.",
  safety: [
    "Wear gloves and long sleeves",
    "Avoid spraying during midday heat",
    "Keep away from children and livestock",
  ],
  phi: "21 days",
  nextInspection: "5 days",
};

export const alternatives = [
  {
    name: "Neem Oil",
    type: "Organic",
    pros: ["Safe for pollinators", "No PHI", "Improves plant vigor"],
    cons: ["Slower knockdown", "Needs reapplication every 5–7 days"],
    stage: "All stages",
    icon: "leaf",
  },
  {
    name: "Encarsia formosa",
    type: "Biological",
    pros: ["Self-sustaining", "Zero residue", "Ideal for greenhouses"],
    cons: ["Needs stable humidity", "Slow to establish"],
    stage: "Early infestation",
    icon: "bug",
  },
  {
    name: "Imidacloprid",
    type: "Chemical",
    pros: ["Fast knockdown", "Systemic residual", "Rain-fast"],
    cons: ["Bee toxicity", "21-day PHI", "Resistance risk"],
    stage: "Moderate–High",
    icon: "shield",
  },
  {
    name: "Manual Removal",
    type: "Physical",
    pros: ["Zero chemicals", "Low cost"],
    cons: ["Labor intensive", "Only viable on small plots"],
    stage: "Early / Spot",
    icon: "hand",
  },
];

export const history = [
  {
    date: "2026-07-22",
    crop: "Cotton",
    pest: "Whitefly",
    severity: "Moderate",
    risk: 86,
    treatment: "Imidacloprid",
    status: "Scheduled",
  },
  {
    date: "2026-07-19",
    crop: "Tomato",
    pest: "Thrips",
    severity: "Low",
    risk: 34,
    treatment: "Neem Oil",
    status: "Completed",
  },
  {
    date: "2026-07-17",
    crop: "Chili",
    pest: "Aphid",
    severity: "High",
    risk: 78,
    treatment: "Neem + Soap",
    status: "Completed",
  },
  {
    date: "2026-07-14",
    crop: "Cotton",
    pest: "Bollworm",
    severity: "Very High",
    risk: 94,
    treatment: "Bt Spray",
    status: "Completed",
  },
  {
    date: "2026-07-11",
    crop: "Grape",
    pest: "Mealybug",
    severity: "Moderate",
    risk: 61,
    treatment: "Buprofezin",
    status: "Completed",
  },
  {
    date: "2026-07-08",
    crop: "Cotton",
    pest: "Whitefly",
    severity: "Low",
    risk: 28,
    treatment: "Monitoring",
    status: "Completed",
  },
  {
    date: "2026-07-05",
    crop: "Onion",
    pest: "Thrips",
    severity: "Moderate",
    risk: 57,
    treatment: "Spinosad",
    status: "Completed",
  },
  {
    date: "2026-07-02",
    crop: "Cotton",
    pest: "Jassid",
    severity: "Low",
    risk: 22,
    treatment: "Neem Oil",
    status: "Completed",
  },
  {
    date: "2026-06-29",
    crop: "Tomato",
    pest: "Whitefly",
    severity: "High",
    risk: 81,
    treatment: "Imidacloprid",
    status: "Completed",
  },
  {
    date: "2026-06-26",
    crop: "Chili",
    pest: "Mite",
    severity: "Moderate",
    risk: 55,
    treatment: "Sulphur Dust",
    status: "Completed",
  },
];

export const alerts = [
  { time: "09:14", text: "High-risk whitefly outbreak in Field 3", tone: "orange" },
  { time: "08:02", text: "Rain expected Saturday — reschedule spraying", tone: "accent" },
  { time: "Yesterday", text: "Neem Oil re-application due in Field 5", tone: "primary" },
];
