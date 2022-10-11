import { MbBookNote } from "./MbBookNote"
import type { NSValue, NSData, DictObj } from ".."

export const enum NotebookType {
  Hiden = 0,
  Doc = 1,
  MindMap = 2,
  FlashCard = 3
}

interface TextContent {
  /** decimal unicode value, you should change to hexadecimal, and append \u */
  readonly char: string
  readonly rect: NSValue
}

export declare class MbBook {
  /**
   * Current topic ID
   */
  readonly currentTopicId?: string
  /**
   * Date of last visit
   */
  readonly lastVisit?: Date
  /**
   * docMd5 of the book
   */
  readonly docMd5?: string
  /**
   * pathFile of the book
   */
  readonly pathFile?: string
  /**
   * Title of the book
   */
  readonly docTitle?: string
  readonly pageCount: number

  textContentsForPageNo(pageNo: number): TextContent[][]
}

export declare class MbTopic {
  title?: string
  readonly topicId?: string
  readonly lastVisit?: Date
  readonly mainDocMd5?: string
  readonly historyDate?: Date
  readonly syncMode?: number | boolean
  readonly categoryList?: string
  readonly hashtags?: string
  readonly docList?: string
  readonly options?: DictObj
  readonly documents?: Array<MbBook>
  readonly notes?: Array<MbBookNote>
  readonly flags: NotebookType
  hideLinksInMindMapNode: boolean
}

export declare class MbModelTool {
  /**
   * get Notebook by ID
   * @param topicid NSString*
   * @returns MbTopic*
   */
  getNotebookById(topicid: string): MbTopic | undefined
  /**
   * @returns NSData*
   * @param hash NSString*
   */
  getMediaByHash(hash: string): NSData | undefined
  /**
   * @param noteid NSString*
   * @returns MbBookNote*
   */
  getNoteById(noteid: string): MbBookNote | undefined
  /**
   * @param md5 NSString*
   * @returns MbBookNote*
   */
  getDocumentById(md5: string): MbBook | undefined
  /**
   * @param noteid NSString*
   * @param topicid NSString*
   * @returns MbBookNote*
   */
  getFlashcardByNoteId(noteid: string, topicid: string): MbBookNote | undefined
  /**
   * @returns NSArray*
   * @param noteid NSString*
   */
  getFlashcardsByNoteId(noteid: string): Array<MbBookNote> | undefined
  /**
   * @param noteid NSString*
   * @returns boolean
   */
  hasFlashcardByNoteId(noteid: string): boolean
  /**
   * @returns void
   */
  savedb(): void
  /**
   * @returns NSArray*
   */
  allNotebooks(): Array<MbTopic>
  /**
   * @returns NSArray*
   */
  allDocuments(): Array<MbBook>
  /**
   * @param topicid NSString*
   * @returns void
   */
  setNotebookSyncDirty(topicid: string): void
  /**
   * @returns NSArray*
   * @param topicid NSString*
   * @param key NSString*
   */
  saveHistoryArchiveKey(topicid: string, key: string): Array<any>
  /**
   * @returns NSArray*
   * @param topicid NSString*
   * @param key NSString*
   */
  loadHistoryArchiveKey(topicid: string, key: string): Array<any>
  /**
   * @param noteid NSString*
   * @returns void
   */
  deleteBookNote(noteid: string): void
  /**
   * @param noteid NSString*
   * @returns void
   */
  deleteBookNoteTree(noteid: string): void
  /**
   * @returns NSArray*
   * @param notes NSArray*
   * @param topicid NSString*
   */
  cloneNotesToTopic(
    notes: Array<MbBookNote>,
    topicid: string
  ): Array<MbBookNote>
  /**
   * @returns NSArray*
   * @param notes NSArray*
   * @param topicid NSString*
   */
  cloneNotesToFlashcardsToTopic(
    notes: Array<MbBookNote>,
    topicid: string
  ): Array<MbBookNote>
  /**
   * @param topicid NSString*
   * @param storePath NSString*
   * @returns boolean
   */
  exportNotebookStorePath(topicid: string, storePath: string): boolean
  /**
   * @param storePath NSString*
   * @returns any
   */
  importNotebookFromStorePathMerge(storePath: string, merge: boolean): any
  getSketchNotesForMindMap(notebookid: string): MbBookNote[]
  getSketchNotesForDocumentMd5Page(
    notebookid: string,
    docmd5: string,
    page: number
  ): MbBookNote[]
}

declare global {
  const Database: {
    /**
     * accessor to MbModelTool in global scope
     * @returns MbModelTool*
     */
    sharedInstance(): MbModelTool
    transDictionaryToJSCompatible(dic: any): any
    transArrayToJSCompatible(arr: any): any
  }
}
