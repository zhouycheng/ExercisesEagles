const DEFAULT_QUIZ_TITLE = '章节练习'
const DEFAULT_TEST_DURATION_MINUTES = 10
const QUIZ_MODES = {
  NORMAL: 'normal',
  VIEW: 'view',
  TEST: 'test'
}

function createKeyMap(keys) {
  return (Array.isArray(keys) ? keys : []).reduce((map, key) => {
    map[key] = true
    return map
  }, {})
}

function normalizeQuizMode(value) {
  if (value === QUIZ_MODES.VIEW || value === QUIZ_MODES.TEST) {
    return value
  }

  return QUIZ_MODES.NORMAL
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return Math.floor(parsed)
}

function formatTimer(totalSeconds) {
  const safeSeconds = Math.max(Number(totalSeconds) || 0, 0)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  const secondText = seconds < 10 ? `0${seconds}` : `${seconds}`

  return `${minutes}:${secondText}`
}

function getInitialQuizViewData() {
  const durationSeconds = DEFAULT_TEST_DURATION_MINUTES * 60

  return {
    quizMode: QUIZ_MODES.NORMAL,
    isViewMode: false,
    isTestMode: false,
    shouldRevealAnswer: false,
    showOverviewStatus: true,
    overviewSubtitle: '',
    bookId: '',
    quizTitle: DEFAULT_QUIZ_TITLE,
    quizPath: '/page/quiz/index',
    questions: [],
    total: 0,
    currentIndex: 0,
    currentNumber: 0,
    currentQuestion: null,
    selectedIndex: null,
    selectedKeys: [],
    answers: [],
    progressPercent: 0,
    hasAnswered: false,
    isCurrentAnswerCorrect: false,
    currentCorrectAnswerCode: '',
    currentExplanation: '',
    questionAnalysisClass: '',
    primaryActionText: '下一题',
    isQuestionScrollable: false,
    questionScrollTop: 0,
    isLastQuestion: false,
    isCompleted: false,
    favoriteQuestionIds: [],
    isCurrentQuestionFavorite: false,
    showSubmitModal: false,
    showQuestionOverview: false,
    unansweredCount: 0,
    overviewItems: [],
    durationSeconds,
    timerSeconds: durationSeconds,
    timerText: formatTimer(durationSeconds),
    correctCount: 0,
    score: 0,
    bestScore: 0,
    resultItems: []
  }
}

class QuizSession {
  constructor(options) {
    const normalizedOptions = options || {}
    const quiz = normalizedOptions.quiz || null
    const quizMode = normalizeQuizMode(normalizedOptions.quizMode)
    const isViewMode = quizMode === QUIZ_MODES.VIEW
    const isTestMode = quizMode === QUIZ_MODES.TEST
    const durationMinutes = parsePositiveInteger(normalizedOptions.durationMinutes, DEFAULT_TEST_DURATION_MINUTES)
    const durationSeconds = durationMinutes * 60
    const quizTitle = quiz && isTestMode ? `${quiz.bookName} - 模拟测试` : (quiz ? quiz.title : DEFAULT_QUIZ_TITLE)

    this.storageKey = normalizedOptions.storageKey || ''
    this.state = Object.assign(getInitialQuizViewData(), {
      quizMode,
      isViewMode,
      isTestMode,
      shouldRevealAnswer: isViewMode,
      showOverviewStatus: !isViewMode,
      overviewSubtitle: isViewMode ? '点击题号快速查看' : '',
      bookId: quiz ? quiz.bookId : '',
      quizTitle,
      quizPath: normalizedOptions.quizPath || (quiz ? quiz.sharePath : '/page/quiz/index'),
      questions: quiz ? quiz.questions : [],
      total: quiz ? quiz.questions.length : 0,
      durationSeconds,
      timerSeconds: durationSeconds,
      timerText: formatTimer(durationSeconds),
      bestScore: Number(normalizedOptions.bestScore) || 0
    })
  }

  getViewData() {
    return Object.assign({}, this.state)
  }

  getShareMessage() {
    return {
      title: this.state.quizTitle || '题小鹰答题',
      path: this.state.quizPath || '/page/quiz/index'
    }
  }

  reset() {
    const questions = this.state.questions
    const firstQuestion = questions[0] || null
    const isViewMode = this.state.isViewMode
    const patch = {
      currentIndex: 0,
      currentNumber: firstQuestion ? 1 : 0,
      currentQuestion: this.getQuestionView(firstQuestion, null, []),
      selectedIndex: null,
      selectedKeys: [],
      answers: [],
      progressPercent: this.getProgressPercent(0),
      hasAnswered: false,
      shouldRevealAnswer: isViewMode,
      isCurrentAnswerCorrect: isViewMode,
      currentCorrectAnswerCode: isViewMode ? this.getQuestionCorrectAnswerCode(firstQuestion) : '',
      currentExplanation: isViewMode ? this.getQuestionExplanation(firstQuestion) : '',
      questionAnalysisClass: isViewMode ? this.getQuestionAnalysisClass(true) : '',
      primaryActionText: this.getPrimaryActionText(0, false, []),
      isQuestionScrollable: false,
      questionScrollTop: 0,
      isLastQuestion: questions.length <= 1,
      isCompleted: false,
      favoriteQuestionIds: [],
      isCurrentQuestionFavorite: false,
      showSubmitModal: false,
      showQuestionOverview: false,
      unansweredCount: isViewMode ? 0 : questions.length,
      overviewItems: this.getOverviewItems([], 0),
      timerSeconds: this.state.durationSeconds,
      timerText: formatTimer(this.state.durationSeconds),
      correctCount: 0,
      score: 0,
      resultItems: []
    }

    return this.updateState(patch, {
      measureQuestion: true,
      startTimer: this.shouldStartTimerAfterPatch(patch),
      stopTimer: true
    })
  }

  updateTimer(timerSeconds) {
    const safeSeconds = Math.max(Number(timerSeconds) || 0, 0)

    return this.updateState({
      timerSeconds: safeSeconds,
      timerText: formatTimer(safeSeconds)
    })
  }

  autoSubmitQuiz() {
    if (this.state.isCompleted) {
      return {
        stopTimer: true
      }
    }

    this.state.timerSeconds = 0
    this.state.timerText = formatTimer(0)

    if (this.shouldConfirmCurrentAnswer()) {
      this.commitCurrentAnswerInternal(this.state.selectedKeys)
    }

    return this.finishQuiz()
  }

  selectOption(selectedIndex) {
    if (this.state.isCompleted || this.state.hasAnswered || this.state.isViewMode) {
      return null
    }

    const question = this.getCurrentBaseQuestion()

    if (!question || Number.isNaN(selectedIndex) || !question.options[selectedIndex]) {
      return null
    }

    const selectedKey = question.options[selectedIndex].key

    if (question.isMultiple) {
      const selectedKeys = this.toggleSelectedKey(this.state.selectedKeys, selectedKey)
      return this.updateState({
        selectedIndex: null,
        selectedKeys,
        currentQuestion: this.getQuestionView(question, null, selectedKeys),
        primaryActionText: this.getPrimaryActionText(this.state.currentIndex, false, selectedKeys)
      })
    }

    return this.commitCurrentAnswer([selectedKey])
  }

  toggleFavoriteQuestion() {
    const question = this.getCurrentBaseQuestion()
    if (!question) {
      return null
    }

    const favoriteQuestionIds = this.state.favoriteQuestionIds.slice()
    const favoriteIndex = favoriteQuestionIds.indexOf(question.id)
    const isCurrentQuestionFavorite = favoriteIndex === -1

    if (isCurrentQuestionFavorite) {
      favoriteQuestionIds.push(question.id)
    } else {
      favoriteQuestionIds.splice(favoriteIndex, 1)
    }

    const result = this.updateState({
      favoriteQuestionIds,
      isCurrentQuestionFavorite
    })
    result.value = isCurrentQuestionFavorite
    return result
  }

  goNext() {
    if (!this.state.questions.length) {
      return null
    }

    if (this.shouldConfirmCurrentAnswer()) {
      return this.commitCurrentAnswer(this.state.selectedKeys)
    }

    if (this.state.isLastQuestion) {
      if (this.state.isViewMode) {
        return {
          command: {
            type: 'returnBookDetail'
          }
        }
      }

      return this.submitQuiz()
    }

    return this.showQuestionAtIndex(this.state.currentIndex + 1)
  }

  goPrev() {
    if (this.state.currentIndex === 0) {
      return null
    }

    return this.showQuestionAtIndex(this.state.currentIndex - 1)
  }

  submitQuiz() {
    if (this.state.isViewMode) {
      return {
        command: {
          type: 'returnBookDetail'
        }
      }
    }

    const unansweredIndexes = this.getUnansweredIndexes(this.state.answers)

    if (unansweredIndexes.length > 0) {
      return this.updateState({
        showSubmitModal: true,
        unansweredCount: unansweredIndexes.length,
        overviewItems: this.getOverviewItems(this.state.answers, this.state.currentIndex)
      })
    }

    return this.finishQuiz()
  }

  closeSubmitModal() {
    return this.updateState({
      showSubmitModal: false
    })
  }

  openPaperOverview() {
    return this.updateState({
      showSubmitModal: false,
      showQuestionOverview: true,
      overviewItems: this.getOverviewItems(this.state.answers, this.state.currentIndex)
    })
  }

  closeQuestionOverview() {
    return this.updateState({
      showQuestionOverview: false
    })
  }

  jumpToQuestion(index) {
    const nextIndex = Number(index)

    if (Number.isNaN(nextIndex) || nextIndex < 0 || nextIndex >= this.state.questions.length) {
      return null
    }

    return this.showQuestionAtIndex(nextIndex, {
      showQuestionOverview: false
    })
  }

  forceSubmitQuiz() {
    if (this.shouldConfirmCurrentAnswer()) {
      this.commitCurrentAnswerInternal(this.state.selectedKeys)
    }

    this.state.showSubmitModal = false
    this.state.showQuestionOverview = false
    return this.finishQuiz()
  }

  finishQuiz() {
    const questions = this.state.questions

    if (!questions.length) {
      return null
    }

    const answers = this.state.answers
    const correctCount = answers.filter(item => item && item.isCorrect).length
    const score = Math.round((correctCount / questions.length) * 100)
    const bestScore = Math.max(score, this.state.bestScore)
    const resultItems = questions.map((question, index) => {
      const answer = answers[index] || {}
      return {
        id: question.id,
        number: index + 1,
        prompt: question.prompt,
        selectedAnswer: this.getQuestionAnswerText(question, answer.selectedKeys),
        correctAnswer: this.getQuestionAnswerText(question, question.answerKeys),
        isCorrect: !!answer.isCorrect,
        explanation: this.getQuestionExplanation(question)
      }
    })

    return this.updateState({
      answers: answers.slice(),
      isCompleted: true,
      showSubmitModal: false,
      showQuestionOverview: false,
      timerSeconds: this.state.timerSeconds,
      timerText: this.state.timerText,
      correctCount,
      score,
      bestScore,
      resultItems
    }, {
      stopTimer: true,
      saveBestScore: this.storageKey ? {
        key: this.storageKey,
        value: bestScore
      } : null
    })
  }

  showQuestionAtIndex(index, extraData) {
    const question = this.state.questions[index]
    const savedAnswer = this.state.answers[index] || null
    const selectedKeys = savedAnswer ? savedAnswer.selectedKeys : []
    const hasAnswered = !!savedAnswer
    const shouldRevealAnswer = this.state.isViewMode || hasAnswered

    return this.updateState(Object.assign({
      currentIndex: index,
      currentNumber: index + 1,
      currentQuestion: this.getQuestionView(question, savedAnswer, selectedKeys),
      selectedIndex: savedAnswer && savedAnswer.selectedIndex !== undefined ? savedAnswer.selectedIndex : null,
      selectedKeys,
      progressPercent: this.getProgressPercent(index),
      hasAnswered,
      shouldRevealAnswer,
      isCurrentAnswerCorrect: this.state.isViewMode || (savedAnswer ? !!savedAnswer.isCorrect : false),
      currentCorrectAnswerCode: shouldRevealAnswer ? this.getQuestionCorrectAnswerCode(question) : '',
      currentExplanation: shouldRevealAnswer ? this.getQuestionExplanation(question) : '',
      questionAnalysisClass: shouldRevealAnswer ? this.getQuestionAnalysisClass(savedAnswer ? !!savedAnswer.isCorrect : true) : '',
      primaryActionText: this.getPrimaryActionText(index, hasAnswered, selectedKeys),
      isQuestionScrollable: false,
      questionScrollTop: 0,
      isCurrentQuestionFavorite: question ? this.isFavoriteQuestion(question.id) : false,
      isLastQuestion: index === this.state.questions.length - 1,
      overviewItems: this.getOverviewItems(this.state.answers, index)
    }, extraData || {}), {
      measureQuestion: true
    })
  }

  commitCurrentAnswer(selectedKeys) {
    const patch = this.commitCurrentAnswerInternal(selectedKeys)

    if (!patch) {
      return null
    }

    return {
      data: patch
    }
  }

  commitCurrentAnswerInternal(selectedKeys) {
    const question = this.getCurrentBaseQuestion()

    if (!question) {
      return null
    }

    const answer = this.createAnswer(question, selectedKeys)
    const answers = this.state.answers.slice()
    answers[this.state.currentIndex] = answer
    const patch = {
      selectedIndex: answer.selectedIndex,
      selectedKeys: answer.selectedKeys,
      answers,
      hasAnswered: true,
      shouldRevealAnswer: true,
      isCurrentAnswerCorrect: answer.isCorrect,
      currentQuestion: this.getQuestionView(question, answer, answer.selectedKeys),
      currentCorrectAnswerCode: this.getQuestionCorrectAnswerCode(question),
      currentExplanation: this.getQuestionExplanation(question),
      questionAnalysisClass: this.getQuestionAnalysisClass(answer.isCorrect),
      unansweredCount: this.getUnansweredIndexes(answers).length,
      overviewItems: this.getOverviewItems(answers, this.state.currentIndex),
      primaryActionText: this.getPrimaryActionText(this.state.currentIndex, true, answer.selectedKeys)
    }

    Object.assign(this.state, patch)
    return patch
  }

  createAnswer(question, selectedKeys) {
    const selectedKeyMap = createKeyMap(selectedKeys)
    const normalizedSelectedKeys = question.options
      .map((option) => option.key)
      .filter((key) => selectedKeyMap[key])
    const answerKeyMap = createKeyMap(question.answerKeys)
    const isCorrect = normalizedSelectedKeys.length === question.answerKeys.length &&
      normalizedSelectedKeys.every((key) => answerKeyMap[key])

    return {
      questionId: question.id,
      selectedIndex: normalizedSelectedKeys.length ? question.options.findIndex((option) => option.key === normalizedSelectedKeys[0]) : undefined,
      selectedKeys: normalizedSelectedKeys,
      isCorrect
    }
  }

  shouldConfirmCurrentAnswer() {
    const question = this.getCurrentBaseQuestion()
    return !!question && question.isMultiple && !this.state.hasAnswered && this.state.selectedKeys.length > 0
  }

  toggleSelectedKey(selectedKeys, selectedKey) {
    const nextSelectedKeys = selectedKeys.slice()
    const keyIndex = nextSelectedKeys.indexOf(selectedKey)

    if (keyIndex >= 0) {
      nextSelectedKeys.splice(keyIndex, 1)
    } else {
      nextSelectedKeys.push(selectedKey)
    }

    return nextSelectedKeys
  }

  getCurrentBaseQuestion() {
    return this.state.questions[this.state.currentIndex] || null
  }

  getQuestionView(question, answer, pendingSelectedKeys) {
    if (!question) {
      return null
    }

    const selectedKeys = answer ? answer.selectedKeys : pendingSelectedKeys
    const selectedKeyMap = createKeyMap(selectedKeys)
    const answerKeyMap = createKeyMap(question.answerKeys)

    return Object.assign({}, question, {
      options: question.options.map((option) => {
        const isSelected = !!selectedKeyMap[option.key]
        const isCorrect = !!answerKeyMap[option.key]
        return Object.assign({}, option, {
          isSelected,
          isCorrect,
          isWrongSelected: isSelected && !isCorrect
        })
      })
    })
  }

  getPrimaryActionText(index, hasAnswered, selectedKeys) {
    const question = this.state.questions[index]

    if (this.state.isViewMode) {
      return index === this.state.questions.length - 1 ? '返回' : '下一题'
    }

    if (question && question.isMultiple && !hasAnswered && selectedKeys.length > 0) {
      return '确认答案'
    }

    return index === this.state.questions.length - 1 ? '交卷' : '下一题'
  }

  getQuestionAnalysisClass(isCorrect) {
    if (this.state.isViewMode) {
      return 'question-analysis-view'
    }

    return isCorrect ? 'question-analysis-correct' : 'question-analysis-wrong'
  }

  getProgressPercent(index) {
    if (!this.state.questions.length) {
      return 0
    }

    return Math.round(((index + 1) / this.state.questions.length) * 100)
  }

  getUnansweredIndexes(answers) {
    const indexes = []

    for (let index = 0; index < this.state.questions.length; index += 1) {
      if (!answers[index]) {
        indexes.push(index)
      }
    }

    return indexes
  }

  isFavoriteQuestion(questionId) {
    return this.state.favoriteQuestionIds.indexOf(questionId) !== -1
  }

  getQuestionExplanation(question) {
    if (!question) {
      return ''
    }

    return question.explanation || '暂无解析。'
  }

  getQuestionCorrectAnswerCode(question) {
    if (!question || !Array.isArray(question.answerKeys)) {
      return ''
    }

    const answerKeyMap = createKeyMap(question.answerKeys)
    return question.options
      .filter((option) => answerKeyMap[option.key])
      .map((option) => option.code || option.key)
      .join('、')
  }

  getQuestionAnswerText(question, answerKeys) {
    if (!question || !Array.isArray(answerKeys) || !answerKeys.length) {
      return '未作答'
    }

    const answerKeyMap = createKeyMap(answerKeys)
    const answerTexts = question.options
      .filter((option) => answerKeyMap[option.key])
      .map((option) => `${option.code || option.key}. ${option.text}`)

    return answerTexts.length ? answerTexts.join('；') : '未作答'
  }

  getOverviewItems(answers, currentIndex) {
    return this.state.questions.map((question, index) => ({
      id: question.id,
      number: index + 1,
      answered: !!answers[index],
      active: index === currentIndex
    }))
  }

  shouldStartTimerAfterPatch(patch) {
    return this.state.isTestMode &&
      !patch.isCompleted &&
      !!this.state.questions.length
  }

  updateState(patch, meta) {
    Object.assign(this.state, patch)
    return Object.assign({
      data: patch
    }, meta || {})
  }
}

module.exports = {
  DEFAULT_QUIZ_TITLE,
  DEFAULT_TEST_DURATION_MINUTES,
  QUIZ_MODES,
  QuizSession,
  formatTimer,
  getInitialQuizViewData,
  normalizeQuizMode,
  parsePositiveInteger
}
