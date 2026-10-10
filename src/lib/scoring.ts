export interface ScoringRule {
  correctScore?: number;
  wrongScore?: number;
  emptyScore?: number;
  passingScore?: number;
  twkPassingGrade?: number;
  tiuPassingGrade?: number;
  tkpPassingGrade?: number;
}

export interface QuestionGradingData {
  questionId: string;
  topicName?: string;
  categoryName?: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'GRADED_SCALE';
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    scoreValue: number;
  }[];
}

export interface UserAnswerData {
  questionId: string;
  selectedOptionIds: string[];
  isDoubtful: boolean;
}

export interface ScoreResult {
  totalScore: number;
  maxPossibleScore: number;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  isPassed: boolean;
  scoreBreakdown: {
    byTopic: Record<
      string,
      {
        total: number;
        correct: number;
        score: number;
      }
    >;
    answersGraded: {
      questionId: string;
      scoreAwarded: number;
      isCorrect: boolean;
      selectedOptionIds: string[];
    }[];
  };
}

export function calculateScore(
  questions: QuestionGradingData[],
  answers: UserAnswerData[],
  rules: ScoringRule = {}
): ScoreResult {
  const correctWeight = rules.correctScore ?? 4;
  const wrongWeight = rules.wrongScore ?? -1;
  const emptyWeight = rules.emptyScore ?? 0;

  const answerMap = new Map<string, UserAnswerData>();
  for (const ans of answers) {
    answerMap.set(ans.questionId, ans);
  }

  let totalScore = 0;
  let maxPossibleScore = 0;
  let answeredCount = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;

  const byTopic: Record<string, { total: number; correct: number; score: number }> = {};
  const answersGraded: ScoreResult['scoreBreakdown']['answersGraded'] = [];

  for (const q of questions) {
    const topicKey = q.topicName || 'Umum';
    if (!byTopic[topicKey]) {
      byTopic[topicKey] = { total: 0, correct: 0, score: 0 };
    }
    byTopic[topicKey].total += 1;

    const validIds = new Set(q.options.map((o) => o.id));
    // Abaikan ID opsi yang bukan milik soal ini & duplikat
    const selectedIds = [...new Set(answerMap.get(q.questionId)?.selectedOptionIds ?? [])].filter((id) =>
      validIds.has(id)
    );

    if (q.type === 'GRADED_SCALE') {
      maxPossibleScore += Math.max(0, ...q.options.map((o) => o.scoreValue));
    } else {
      maxPossibleScore += correctWeight;
    }

    if (selectedIds.length === 0) {
      emptyCount += 1;
      totalScore += emptyWeight;
      byTopic[topicKey].score += emptyWeight;
      answersGraded.push({ questionId: q.questionId, scoreAwarded: emptyWeight, isCorrect: false, selectedOptionIds: [] });
      continue;
    }

    answeredCount += 1;

    if (q.type === 'GRADED_SCALE') {
      // CPNS TKP: setiap opsi bernilai 1–5, hanya satu opsi yang boleh dipilih
      const chosenOpt = selectedIds.length === 1 ? q.options.find((o) => o.id === selectedIds[0]) : undefined;
      const scoreAwarded = chosenOpt ? chosenOpt.scoreValue : 0;
      const topScore = Math.max(0, ...q.options.map((o) => o.scoreValue));
      const isTop = Boolean(chosenOpt) && scoreAwarded === topScore;
      totalScore += scoreAwarded;
      byTopic[topicKey].score += scoreAwarded;
      if (isTop) {
        correctCount += 1;
        byTopic[topicKey].correct += 1;
      }
      answersGraded.push({ questionId: q.questionId, scoreAwarded, isCorrect: isTop, selectedOptionIds: selectedIds });
      continue;
    }

    // SINGLE_CHOICE: tepat satu opsi dan itu yang benar.
    // MULTI_CHOICE: himpunan pilihan harus sama persis dengan himpunan opsi benar.
    const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
    const isCorrect =
      correctIds.length > 0 &&
      (q.type === 'MULTI_CHOICE'
        ? selectedIds.length === correctIds.length && correctIds.every((id) => selectedIds.includes(id))
        : selectedIds.length === 1 && correctIds.includes(selectedIds[0]));

    const awarded = isCorrect ? correctWeight : wrongWeight;
    if (isCorrect) {
      correctCount += 1;
      byTopic[topicKey].correct += 1;
    } else {
      wrongCount += 1;
    }
    totalScore += awarded;
    byTopic[topicKey].score += awarded;
    answersGraded.push({ questionId: q.questionId, scoreAwarded: awarded, isCorrect, selectedOptionIds: selectedIds });
  }

  // Determine passing status
  let isPassed: boolean;
  if (rules.passingScore !== undefined) {
    isPassed = totalScore >= rules.passingScore;
  } else if (rules.twkPassingGrade || rules.tiuPassingGrade || rules.tkpPassingGrade) {
    // CPNS breakdown check
    let passTwk = true;
    let passTiu = true;
    let passTkp = true;

    for (const [topic, val] of Object.entries(byTopic)) {
      const lower = topic.toLowerCase();
      if (lower.includes('twk') && rules.twkPassingGrade) {
        passTwk = val.score >= rules.twkPassingGrade;
      }
      if (lower.includes('tiu') && rules.tiuPassingGrade) {
        passTiu = val.score >= rules.tiuPassingGrade;
      }
      if (lower.includes('tkp') && rules.tkpPassingGrade) {
        passTkp = val.score >= rules.tkpPassingGrade;
      }
    }
    isPassed = passTwk && passTiu && passTkp;
  } else {
    // Default: 60% dari skor maksimum
    isPassed = totalScore >= maxPossibleScore * 0.6;
  }

  return {
    totalScore,
    maxPossibleScore,
    totalQuestions: questions.length,
    answeredCount,
    correctCount,
    wrongCount,
    emptyCount,
    isPassed,
    scoreBreakdown: {
      byTopic,
      answersGraded,
    },
  };
}
