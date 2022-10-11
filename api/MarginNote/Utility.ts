import { UIWindow, UIViewController, UITableView } from "../UIKit"
import type { JSValue, NSData } from ".."

declare global {
  const SpeechManager: {
    /**
     * create a new instance
     */
    sharedInstance(): SpeechManager
  }
  const UndoManager: {
    /**
     * create a new instance
     */
    sharedInstance(): UndoManager
  }
  /**
   * zip & unzip tools
   */
  const ZipArchive: {
    initWithPath(path: string): ZipArchive
    /**
     * @param path NSString*
     * @param destination NSString*
     */
    unzipFileAtPathToDestination(path: string, destination: string): boolean
    unzipFileAtPathToDestinationOverwritePassword(
      path: string,
      destination: string,
      overwrite: boolean,
      password: string
    ): boolean
    createZipFileAtPathWithFilesAtPaths(
      path: string,
      filenames: Array<any>
    ): boolean
    /**
     * @param path NSString*
     * @param directoryPath NSString*
     */
    createZipFileAtPathWithContentsOfDirectory(
      path: string,
      directoryPath: string
    ): boolean
  }
  class MenuController extends UIViewController {
    /**
     * new instance
     */
    static new(): MenuController
    menuTableView?: UITableView
    commandTable?: {
      title: string
      /** OC Object */
      object: any
      selector: string
      height?: number
      param: Record<string, any>
      checked: boolean
    }[]
    sections?: Array<any>
    /**
     *  int
     */
    rowHeight: number
    /**
     *  int
     */
    secHeight: number
    /**
     *  int
     */
    fontSize: number
    preferredContentSize: {
      width: number
      height: number
    }
  }
}

export declare type SpeechManager = {
  /**
   * start speech notes
   */
  startSpeechNotes(notes: Array<any>): void
  /**
   * stop speech
   */
  stopSpeech(): void
  /**
   * pause speech
   */
  pauseSpeech(): void
  /**
   * continue speech
   */
  continueSpeech(): void
  /**
   * previous speech
   */
  prevSpeech(): void
  /**
   * next speech
   */
  nextSpeech(): void
  canPrev(): boolean
  canNext(): boolean
  playText(text: string): void
  /**
   * @param text NSString*
   * @param languageTxt NSString*
   */
  playTextLanguageTxt(text: string, languageTxt: string): void
  /**
   * If speaking
   */
  readonly speaking: boolean
  /**
   * If paused
   */
  readonly paused: boolean
  /**
   * when speak text
   */
  readonly sysSpeaking: boolean
  /**
   * Scene window
   */
  sceneWindow?: UIWindow
  languageCode?: string
}
export declare type UndoManager = {
  /**
   * @param actionName NSString*
   * @param topicid NSString*
   * @param block JSValue*
   */
  undoGrouping(actionName: string, topicid: string, block: JSValue): void
  /**
   * undo an action
   */
  undo(): void
  /**
   * redo an action
   */
  redo(): void
  /**
   * if can undo
   */
  canUndo(): boolean
  /**
   * if can redo
   */
  canRedo(): boolean
  /**
   * clear all actions
   */
  clearAll(): void
}
/**
 * zip & unzip tools
 */
export declare type ZipArchive = {
  open(): boolean
  writeFile(path: string): boolean
  writeDataFilename(data: NSData, filename: string): boolean
  close(): boolean
}
