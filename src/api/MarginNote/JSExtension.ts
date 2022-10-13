import { DictObj } from ".."
import { UIWindow, UIViewController, UILocalNotification } from "../UIKit"

/**
 * LifeCycle of Addon
 */
export declare class JSExtension {
  [k: string]: any
  /**
   *
   */
  readonly window?: UIWindow
  /**
   * Query Addon Status, usally used for checking if activate the addon
   * @returns NSDictionary*
   */
  queryAddonCommandStatus(): {
    /**
     * path to icon file
     * image size must be 44x44 px
     */
    image: string
    /**
     * object of the function, usually self
     */
    object: any
    /**
     * selector of the function, for another word, when you click(tap) on the icon, what function will be executed
     */
    selector: string
    /**
     * checked status
     */
    checked: boolean
  } | null

  /**
   * @returns NSArray*
   * @param topicid NSString*
   */
  additionalTitleLinksOfNotebook(topicid: string): Array<any>
  /**
   * @returns UIViewController*
   * @param titleLink NSString*
   */
  viewControllerForTitleLink(titleLink: string): UIViewController
  /**
   * @returns void
   * @param controller UIViewController*
   */
  controllerWillLayoutSubviews(controller: UIViewController): void
  /**
   * @returns NSArray*
   */
  additionalShortcutKeys(): Array<any>
  /**
   * @returns NSDictionary*
   * @param command NSString*
   * @param keyFlags NSInteger
   */
  queryShortcutKeyWithKeyFlags(command: string, keyFlags: number): DictObj
  /**
   * @param command NSString*
   * @param keyFlags NSInteger
   * @returns void
   */
  processShortcutKeyWithKeyFlags(command: string, keyFlags: number): void
}

export declare namespace JSExtensionLifeCycle {
  type InstanceMethods = Partial<{
    /**
     * Do something when MarginNote open a window
     * @returns void
     */
    sceneWillConnect(): void
    /**
     *  Do something when MarginNote close a window
     */
    sceneDidDisconnect(): void
    /**
     * Do something when MarginNote window resign active
     */
    sceneWillResignActive(): void
    /**
     * Do something when activate MarginNote window
     */
    sceneDidBecomeActive(): void
    /**
     * Do something when notebook open
     * @param topicid NSString*
     */
    notebookWillOpen(topicid: string): void
    /**
     * Do something when notebook close
     * @param topicid NSString*
     */
    notebookWillClose(topicid: string): void
    /**
     * Do something when document open
     * @param docmd5 NSString*
     */
    documentDidOpen(docmd5: string): void
    /**
     * Do something when document close
     * @param docmd5 NSString*
     * @returns void
     */
    documentWillClose(docmd5: string): void
  }>
  type ClassMethods = Partial<{
    /**
     * Do something when addon finish loading
     * @returns void
     */
    addonDidConnect(): void
    /**
     * Do something when addon shuts down
     * @returns void
     */
    addonWillDisconnect(): void
    /**
     * Do something when application enter background
     * @returns void
     */
    applicationDidEnterBackground(): void
    /**
     * Do something when application enter foreground
     * @returns void
     */
    applicationWillEnterForeground(): void
    /**
     * @param notify UILocalNotification*
     * @returns void
     */
    applicationDidReceiveLocalNotification(notify: UILocalNotification): void
  }>
}
