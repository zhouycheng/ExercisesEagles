const questionBankCatalog = require('../utils/question-bank-catalog.js')

module.exports = {
  getBookSummaries: questionBankCatalog.getBookSummaries,
  getBookDetail: questionBankCatalog.getBookDetail,
  getFirstBookDetail: questionBankCatalog.getFirstBookDetail,
  getChapterQuiz: questionBankCatalog.getChapterQuiz,
  getBookQuiz: questionBankCatalog.getBookQuiz,
  getBookDrawQuiz: questionBankCatalog.getBookDrawQuiz,
  getFirstChapterQuiz: questionBankCatalog.getFirstChapterQuiz,
  formatChapterLabel: questionBankCatalog.formatChapterLabel
}
