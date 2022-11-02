import { OSType } from "../api"
import type { UIColor } from "../api"
import { gte } from "semver"

class MNAPP {
  readonly app = Application.sharedInstance()
  get studyController() {
    return this.app.studyController(this.app.focusWindow)
  }
  get notebookController() {
    return this.studyController.notebookController
  }
  get currentDocumentController() {
    return this.studyController.readerController.currentDocumentController
  }
  get currentWindow() {
    return this.app.focusWindow
  }
  get currentThemeColor(): UIColor {
    return this.themeColor[this.app.currentTheme!]
  }
  get currentAddon() {
    return {
      key: self.addon?.key ?? "mnaddon",
      title: self.addon?.title ?? "MarginNote"
    }
  }
  get currnetNotebookid() {
    try {
      return this.notebookController.notebookId
    } catch {
      return undefined
    }
  }
  get currentDocmd5() {
    try {
      // 只要在笔记本内，就算没有文档，也会存在一个 docmd5，只是长度变为了 32 位随机。尽量让这个值固定，8 个 0，避免生成更多的无效配置。
      const { docMd5 } = this.currentDocumentController
      if (docMd5 && docMd5.length === 32) return "00000000"
      else return docMd5
    } catch {
      return undefined
    }
  }
  readonly isZH = NSLocale.preferredLanguages()?.[0].startsWith("zh")
  readonly db = Database.sharedInstance()
  /**
   * @version 4.0.2(97)
   */
  readonly version = this.app.appVersion ?? "3.7.21"
  readonly buildNum = this.app.build ? Number(this.app.build) : 96
  readonly isMNE = gte(this.version, "4.0.0")
  readonly isMac = this.app.osType == OSType.macOS
  readonly isMacMNE =
    this.isMac && gte(this.version, "4.0.2") && this.buildNum >= 97
  readonly isMacMN3 = this.isMac && !this.isMacMNE
  readonly themeColor = {
    Gray: UIColor.colorWithHexString("#414141"),
    Default: UIColor.colorWithHexString("#FFFFFF"),
    Dark: UIColor.colorWithHexString("#000000"),
    Green: UIColor.colorWithHexString("#E9FBC7"),
    Sepia: UIColor.colorWithHexString("#F5EFDC")
  }
}

export const MN = new MNAPP()
