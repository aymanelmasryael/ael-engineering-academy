/* AEL Academy — Quiz Package v1.0 */

window.AELQuiz = {
  version: '1.0.0',

  grade(quiz, answers) {
    if (!quiz || !quiz.questions) return null;
    let correct = 0;
    const total = quiz.questions.length;
    const details = [];

    quiz.questions.forEach((q, i) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correct++;
      details.push({
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      });
    });

    const score = Math.round((correct / total) * 100);
    const passed = score >= (quiz.passingScore || 80);

    return { score, correct, total, passed, details };
  },

  getState(quizId) {
    try {
      const state = JSON.parse(localStorage.getItem('ael-academy-state') || '{}');
      return state.quizResults?.[quizId] || null;
    } catch (e) {
      return null;
    }
  },

  saveState(quizId, result) {
    try {
      const state = JSON.parse(localStorage.getItem('ael-academy-state') || '{}');
      if (!state.quizResults) state.quizResults = {};
      state.quizResults[quizId] = {
        ...result,
        timestamp: Date.now()
      };
      localStorage.setItem('ael-academy-state', JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save quiz state:', e);
    }
  },

  renderResult(result) {
    if (!result) return '';
    const barColor = result.passed ? 'var(--green)' : 'var(--red)';
    return `
      <div class="quiz-result">
        <div class="quiz-score" style="color:${barColor}">${result.score}%</div>
        <div class="quiz-detail">${result.correct}/${result.total} correct</div>
        <div class="quiz-status">${result.passed ? 'Passed' : 'Failed'}</div>
      </div>`;
  }
};
