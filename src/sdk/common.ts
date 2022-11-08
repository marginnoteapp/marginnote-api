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

/**
 *
 * @param url
 * @param encode default false
 * @returns
 */
export function genURL(url: string, encode = false) {
  url = url.trim()
  if (!/^[\w\-]+:\/\//.test(url)) url = `https://${url}`
  return NSURL.URLWithString(encode ? encodeURI(url) : url)
}

/**
 *
 * @param url
 * @param encode default false
 * @returns
 */
export function openUrl(url: string, encode = false) {
  MN.app.openURL(genURL(url, encode))
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
