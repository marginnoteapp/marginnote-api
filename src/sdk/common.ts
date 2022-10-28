import type { NSNull } from "src/api"
import { lang } from "./lang"
import { MN } from "./mn"

export function showHUD(
  message: string,
  duration = 2,
  window = MN.currentWindow
) {
  MN.app.showHUD(message, window, duration)
}

export const HUDController = {
  show(message: string, window = MN.currentWindow) {
    MN.app.waitHUDOnView(message, window)
  },
  hidden(message?: string, duration = 2, window = MN.currentWindow) {
    MN.app.stopWaitHUDOnView(window)
    message && showHUD(message, duration, window)
  }
}

export function getLocalDataByKey(key: string) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

export function setLocalDataByKey(data: any, key: string) {
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
}

export function alert(message: string) {
  MN.app.alert(message)
}

export function getObjCClassDeclar(name: string, type: string) {
  return `${name} : ${type}`
}

export function evaluateJavaScript(webView: UIWebView, script: string) {
  return new Promise<string>(resolve =>
    webView.evaluateJavaScript(script, resolve)
  )
}

export function openUrl(url: string) {
  url = url.trimStart()
  if (
    !/^[\w-]+:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(url)
  )
    url = `https://${url}`
  MN.app.openURL(NSURL.URLWithString(encodeURI(url)))
}

export function postNotification(key: string, userInfo: any) {
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )
}

export function isNSNull(obj: any): obj is NSNull {
  return obj === NSNull.new()
}

export function NSNull2Null<T>(k: T) {
  return isNSNull(k) ? null : (k as Exclude<T, NSNull>)
}

export function copy(text: string, hud = true) {
  if (text) {
    UIPasteboard.generalPasteboard().string = text.trim()
    hud && showHUD(lang.copy_success)
  } else hud && showHUD(lang.copy_empty)
}
