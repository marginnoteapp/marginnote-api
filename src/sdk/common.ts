import type { NSNull } from "src/api"
import { lang } from "./lang"
import { MN } from "./mn"

export function showHUD(message: string, duration = 2, window = self.window) {
  MN.app.showHUD(message, window, duration)
}

export const HUDController = {
  show(message: string, window = self.window) {
    MN.app.waitHUDOnView(message, window)
  },
  hidden(window = self.window) {
    MN.app.stopWaitHUDOnView(window)
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
  MN.app.openURL(NSURL.URLWithString(encodeURI(url)))
}

export function postNotification(key: string, userInfo: any) {
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )
}

export function isThisWindow(sender: any, window = self.window) {
  return MN.app.checkNotifySenderInWindow(sender, window)
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