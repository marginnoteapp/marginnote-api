import { StudyMode, MbBookNote } from "../api"
import { MN, postNotification } from "."

export function isNoteExist(note: MbBookNote | string) {
  if (typeof note === "string") return MN.db.getNoteById(note) ? true : false
  else return MN.db.getNoteById(note.noteId) ? true : false
}

/**
 * Cancellable actions, all actions that modify data should be wrapped in this method.
 * @param f f:()=>void, the action need to be cancelled.
 * @returns void
 */
export function undoGrouping(f: () => void) {
  if (MN.currnetNotebookid) {
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      MN.currnetNotebookid,
      f
    )
  }
}

/**
 * Undo group and then refresh the view.
 * @param f f:()=>void, the action need to be cancelled.
 * @returns void
 */
export function undoGroupingWithRefresh(f: () => void) {
  undoGrouping(f)
  RefreshAfterDBChange()
}

/**
 * Refresh the view after database change.
 * @returns void
 */
export function RefreshAfterDBChange() {
  if (MN.currnetNotebookid) {
    MN.db.setNotebookSyncDirty(MN.currnetNotebookid)
    postNotification("RefreshAfterDBChange", {
      topicid: MN.currnetNotebookid
    })
  }
}

/**
 * Remove the highlight symbol in the text.
 * @param text The text that you want to remove the highlight symbol.
 * @returns Processed text.
 */
export function removeHighlight(text: string) {
  return text.replace(/\*\*/g, "")
}

export function getDocURL() {
  if (
    MN.studyController.studyMode !== StudyMode.study ||
    !MN.currentDocmd5 ||
    MN.currentDocmd5 === "00000000" ||
    !MN.currnetNotebookid
  )
    return
  const notebook = MN.db.getNotebookById(MN.currnetNotebookid)!
  const note = notebook.notes?.find(
    k => k.docMd5 === MN.currentDocmd5 && k.modifiedDate
  )
  return note?.noteId
    ? `marginnote3app://note/${note.noteId}`
    : `marginnote3app://notebook/${MN.currnetNotebookid}`
}
