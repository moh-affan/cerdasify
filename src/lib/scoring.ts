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

    const userAns = answerMap.get(q.questionId);
    const selectedIds = userAns?.selectedOptionIds || [];

    if (selectedIds.length === 0) {
      // Empty
      emptyCount += 1;
      const awarded = emptyWeight;
      totalScore += awarded;
      byTopic[topicKey].score += awarded;
      answersGraded.push({
        questionId: q.questionId,
        scoreAwarded: awarded,
        isCorrect: false,
        selectedOptionIds: [],
      });
      continue;
    }

    if (q.type === 'GRADED_SCALE') {
      // CPNS TKP style: Option has scoreValue 1 to 5
      const chosenOpt = q.options.find((o) => selectedIds.includes(o.id));
      const scoreAwarded = chosenOpt ? chosenOpt.scoreValue : 1;
      totalScore += scoreAwarded;
      byTopic[topicKey].score += scoreAwarded;
      if (scoreAwarded === 5) {
        correctCount += 1;
        byTopic[topicKey].correct += 1;
      }
      answersGraded.push({
        questionId: q.questionId,
        scoreAwarded,
        isCorrect: scoreAwarded === 5,
        selectedOptionIds: selectedIds,
      });
    } else {
      // SINGLE_CHOICE standard
      const correctOption = q.options.find((o) => o.isCorrect);
      const isCorrect = correctOption ? selectedIds.includes(correctOption.id) : false;

      let awarded = 0;
      if (isCorrect) {
        correctCount += 1;
        byTopic[topicKey].correct += 1;
        awarded = correctWeight;
      } else {
        wrongCount += 1;
        awarded = wrongWeight;
      }

      totalScore += awarded;
      byTopic[topicKey].score += awarded;
      answersGraded.push({
        questionId: q.questionId,
        scoreAwarded: awarded,
        isCorrect,
        selectedOptionIds: selectedIds,
      });
    }
  }

  // Determine passing status
  let isPassed = false;
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
    // Default 60% of max score
    isPassed = totalScore >= questions.length * correctWeight * 0.6;
  }

  return {
    totalScore,
    maxPossibleScore: questions.length * correctWeight,
    totalQuestions: questions.length,
    answeredCount: correctCount + wrongCount,
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
