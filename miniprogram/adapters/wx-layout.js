const DEFAULT_APP_BAR_HEIGHT = 88
const DEFAULT_MENU_BUTTON_TOP = 48
const DEFAULT_MENU_BUTTON_HEIGHT = 32
const DEFAULT_APP_BAR_TITLE_RIGHT = 108
const DEFAULT_CONTENT_TOP = DEFAULT_APP_BAR_HEIGHT + 12

function getWxApi(wxApi) {
  if (wxApi) {
    return wxApi
  }

  if (typeof wx !== 'undefined') {
    return wx
  }

  return null
}

function getStatusBarHeight(wxApi) {
  const runtime = getWxApi(wxApi)

  if (!runtime) {
    return 0
  }

  const windowInfo = runtime.getWindowInfo ? runtime.getWindowInfo() : runtime.getSystemInfoSync()
  return windowInfo.statusBarHeight || 0
}

function getDefaultAppBarMetrics() {
  return {
    appBarHeight: DEFAULT_APP_BAR_HEIGHT,
    menuButtonTop: DEFAULT_MENU_BUTTON_TOP,
    menuButtonHeight: DEFAULT_MENU_BUTTON_HEIGHT,
    appBarTitleRight: DEFAULT_APP_BAR_TITLE_RIGHT,
    contentTop: DEFAULT_CONTENT_TOP
  }
}

function getAppBarMetrics(wxApi) {
  const runtime = getWxApi(wxApi)

  if (!runtime) {
    return getDefaultAppBarMetrics()
  }

  const windowInfo = runtime.getWindowInfo ? runtime.getWindowInfo() : runtime.getSystemInfoSync()
  const menuButton = runtime.getMenuButtonBoundingClientRect ? runtime.getMenuButtonBoundingClientRect() : null
  const hasMenuButtonMetrics = menuButton &&
    typeof menuButton.top === 'number' &&
    typeof menuButton.left === 'number' &&
    typeof menuButton.height === 'number'

  if (!hasMenuButtonMetrics) {
    return getDefaultAppBarMetrics()
  }

  const statusBarHeight = windowInfo.statusBarHeight || 0
  const menuGap = Math.max(menuButton.top - statusBarHeight, 0)
  const navBarHeight = menuButton.height + menuGap * 2
  const windowWidth = windowInfo.windowWidth || windowInfo.screenWidth || 0

  return {
    appBarHeight: Math.ceil(statusBarHeight + navBarHeight),
    menuButtonTop: Math.ceil(menuButton.top),
    menuButtonHeight: Math.ceil(menuButton.height),
    appBarTitleRight: Math.ceil(windowWidth - menuButton.left + 12),
    contentTop: Math.ceil(statusBarHeight + navBarHeight + 12)
  }
}

module.exports = {
  getStatusBarHeight,
  getDefaultAppBarMetrics,
  getAppBarMetrics
}
