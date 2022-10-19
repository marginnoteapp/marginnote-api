import { OSType } from "../api"
import type { UIColor } from "../api"

function getVersion() {
  return "3.7.19"
}

class MNAPP {
  get studyController() {
    return Application.sharedInstance().studyController(
      Application.sharedInstance().focusWindow
    )
  }
  get notebookController() {
    return Application.sharedInstance().studyController(
      Application.sharedInstance().focusWindow
    ).notebookController
  }
  get currentDocumentController() {
    return Application.sharedInstance().studyController(
      Application.sharedInstance().focusWindow
    ).readerController.currentDocumentController
  }
  get currentWindow() {
    return Application.sharedInstance().focusWindow
  }
  get currentThemeColor(): UIColor {
    return this.themeColor[Application.sharedInstance().currentTheme!]
  }
  get currentAddon() {
    return {
      key: self.addon?.key ?? "mnaddon",
      title: self.addon?.title ?? "MarginNote"
    }
  }
  get currnetNotebookid() {
    return Application.sharedInstance().studyController(
      Application.sharedInstance().focusWindow
    ).notebookController.notebookId
  }
  get currentDocmd5() {
    return Application.sharedInstance().studyController(
      Application.sharedInstance().focusWindow
    ).readerController.currentDocumentController.docMd5
  }
  readonly isMac = Application.sharedInstance().osType == OSType.macOS
  readonly isZH = NSLocale.preferredLanguages()?.[0].startsWith("zh")
  readonly app = Application.sharedInstance()
  readonly db = Database.sharedInstance()
  readonly version = getVersion()
  readonly themeColor = {
    Gray: UIColor.colorWithHexString("#414141"),
    Default: UIColor.colorWithHexString("#FFFFFF"),
    Dark: UIColor.colorWithHexString("#000000"),
    Green: UIColor.colorWithHexString("#E9FBC7"),
    Sepia: UIColor.colorWithHexString("#F5EFDC")
  }
}

export const MN = new MNAPP()
