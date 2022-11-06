import { DocumentController, MbBookNote } from ".."

export * from "./Application"
export * from "./NoteDatabase"
export * from "./Utility"
export * from "./MbBookNote"
export * from "./SQLite"
export * from "./JSExtension"

export const enum DirectionOfSelection {
  toRight = 1,
  toLeft = 2
}

export type UserInfo<K> = K extends
  | "onPopupMenuOnSelection"
  | "onClosePopupMenuOnSelection"
  ? {
      winRect: string
      arrow: DirectionOfSelection
      documentController: DocumentController
    }
  : K extends "onPopupMenuOnNote" | "onClosePopupMenuOnNote"
  ? { note: MbBookNote }
  : K extends "onChangeExcerptRange" | "onProcessNewExcerpt"
  ? { noteid: string }
  : K extends "onAddonBroadcast"
  ? { message: string }
  : Record<string, any>
