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

  const pred =
    raw.prediction && typeof raw.prediction === 'object'
      ? raw.prediction
      : raw;

  const disease =
    pred.disease ??
    pred.prediction ??
    pred.predicted_disease ??
    pred.label ??
    raw.disease ??
    null;

  const rawConf =
    pred.confidence ??
    pred.probability ??
    pred.score ??
    raw.confidence ??
    null;

  let confidence = null;
  if (rawConf !== null && rawConf !== undefined) {
    const cleaned =
      typeof rawConf === 'string' ? rawConf.replace('%', '').trim() : rawConf;
    const num = Number(cleaned);
    if (!Number.isNaN(num)) {
      confidence = num > 1 ? num / 100 : num;
      confidence = Math.min(1, Math.max(0, confidence));
    }
  }

  const recs =
    pred.recommendation ??
    pred.recommendations ??
    raw.recommendations ??
    raw.advice ??
    raw.suggestions ??
    [];

  return {
    disease: disease ? String(disease) : null,
    confidence,
    recommendations: Array.isArray(recs) ? recs.map(String) : [String(recs)],
    isDemo,
  };
};
