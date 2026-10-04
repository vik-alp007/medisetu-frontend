/**
 * ML Adapter
 *
 * ML API -> mlService -> ADAPTER -> DiseasePredictionCard
 *
 * TEMPORARY ML RESPONSE SHAPE
 * REPLACE WITH ACTUAL ML API CONTRACT
 *
 * The UI consumes this normalized object:
 * {
 *   disease: string,
 *   confidence: number | null,      // 0..1, null when unknown
 *   recommendations: string[],
 *   isDemo: boolean
 * }
 *
 * The key names accepted below are GUESSES (not a contract). When the ML team
 * provides the real response, update ONLY this file.
 */
export const adaptPrediction = (raw, { isDemo = false } = {}) => {
  if (!raw || typeof raw !== 'object') {
    throw new Error('The prediction service returned an unreadable response.');
  }

  const disease =
    raw.disease ?? raw.prediction ?? raw.predicted_disease ?? raw.label ?? null;

  let confidence = raw.confidence ?? raw.probability ?? raw.score ?? null;
  if (confidence !== null && !Number.isNaN(Number(confidence))) {
    confidence = Number(confidence);
    if (confidence > 1) confidence = confidence / 100; // tolerate 0-100 percentages
    confidence = Math.min(1, Math.max(0, confidence));
  } else {
    confidence = null;
  }

  const recs = raw.recommendations ?? raw.advice ?? raw.suggestions ?? [];

  return {
    disease: disease ? String(disease) : null,
    confidence,
    recommendations: Array.isArray(recs) ? recs.map(String) : [String(recs)],
    isDemo,
  };
};
