import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'

/**
 * Native-shell setup. No-ops in the browser so `npm run dev` and the deployed
 * web build are unaffected.
 */
const setupNativeShell = async () => {
  if (!Capacitor.isNativePlatform()) return

  try {
    // The app is dark, so the status bar needs light icons. `Style.Dark` means
    // "dark background", which is what gives us light content.
    await StatusBar.setStyle({ style: Style.Dark })
    // Draw behind the status bar; the CSS safe-area insets keep content clear of it.
    await StatusBar.setOverlaysWebView({ overlay: true })
  } catch {
    // StatusBar is unavailable on some devices; the app still works without it.
  }

  try {
    await SplashScreen.hide()
  } catch {
    // Splash screen already hidden by launchAutoHide.
  }
}

export default setupNativeShell
