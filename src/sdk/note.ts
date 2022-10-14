import { MbBookNote, MNPic, noteComment, StudyMode } from "../api"
import { MN, postNotification } from "."
import { escapeURLParam, unique } from "./utils"

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
 * Get infomation of the selected nodes.
 * @returns Array which contains the infomation of the selected nodes.

 */
export function getSelectNodes(): MbBookNote[] {
  const MindMapNodes: any[] | undefined =
    MN.notebookController.mindmapView.selViewLst
  return MindMapNodes?.length ? MindMapNodes.map(item => item.note.note) : []
}

/**
 * Get card tree recursively, including all the node's children,grandchildren and grandgrandchildren etc.
 * @param node The card that you want to get its children node information.
 * @returns MbBookNote[] - An array which contains all the children nodes.
 */
export function getNodeTree(node: MbBookNote) {
  const DFS = (
    nodes: MbBookNote[],
    level = 0,
    lastIndex = [] as number[],
    res = {
      children: [] as MbBookNote[],
      treeIndex: [] as number[][]
    }
  ) => {
    level++
    nodes.forEach((node, index) => {
      res.children.push(node)
      lastIndex = lastIndex.slice(0, level - 1)
      lastIndex.push(index)
      res.treeIndex.push(lastIndex)
      node.childNotes?.length && DFS(node.childNotes, level, lastIndex, res)
    })
    return res
  }
  if (!node.childNotes?.length)
    return {
      onlyChildren: [],
      onlyFirstLevel: [],
      allNodes: [node],
      treeIndex: [[]] as number[][]
    }
  const { children, treeIndex } = DFS(node.childNotes!)
  return {
    // 只有子节点
    onlyChildren: children,
    // 只有第一层的子节点
    onlyFirstLevel: node.childNotes!,
    // 选中的卡片及其子节点
    allNodes: [node, ...children],
    treeIndex
  }
}

/**
 * Get ancester nodes recursively, including all the node's parent, grandparent and grandgrandparent etc.
 * @param node The card that you want to get its ancestor nodes information.
 * @returns MbBookNote[] - An array which contains all the ancestor nodes.
 */
export function getAncestorNodes(node: MbBookNote): MbBookNote[] {
  const up = (node: MbBookNote, ancestorNodes: MbBookNote[]) => {
    if (node.parentNote) {
      ancestorNodes = up(node.parentNote, [...ancestorNodes, node.parentNote])
    }
    return ancestorNodes
  }
  return up(node, [])
}

/**
 * Get all excerptions of one node.
 * @param node The card that you want to get its excerptions.
 * @returns Array Each element of the array contains one excerpt note's info.
 */
export function getExcerptNotes(node: MbBookNote): MbBookNote[] {
  return node.comments.reduce(
    (acc, cur) => {
      cur.type == "LinkNote" && acc.push(MN.db.getNoteById(cur.noteid)!)
      return acc
    },
    [node]
  )
}

/**
 * Get picture base64 code by {@param} pic.
 * @param pic {@link MNPic}
 * @returns Base64 code of the picture.
 */
export function exportPic(pic: MNPic) {
  const base64 = MN.db.getMediaByHash(pic.paint)?.base64Encoding()
  return base64
    ? {
        base64,
        img: `data:image/jpeg;base64,${escapeURLParam(base64)}`,
        html: `<img class="MNImg" src="data:image/jpeg;base64,${base64}"/>`,
        md: `![](data:image/jpeg;base64,${escapeURLParam(base64)})`
      }
    : undefined
}

/**
 * Get all excerpt text in a card.
 * @param node The card that you want to get its excerpt text.
 * @param highlight Highlighted by default.
 * @param mdsize Text after OCR by default.
 * @returns Dict of excerpt text.
 */
export function getExcerptText(node: MbBookNote, highlight = true) {
  const res = {
    text: [] as string[],
    ocr: [] as string[],
    base64: [] as string[],
    img: [] as string[],
    html: [] as string[],
    md: [] as string[]
  }
  return getExcerptNotes(node).reduce((acc, cur) => {
    const text = cur.excerptText?.trim()
    if (cur.excerptPic) {
      const imgs = exportPic(cur.excerptPic)
      if (imgs)
        Object.entries(imgs).forEach(([k, v]) => {
          if (k in acc) acc[k].push(v)
        })
      if (text) {
        acc.ocr.push(text)
        if (node.textFirst) acc.text.push(text)
      }
    } else {
      if (text) {
        Object.values(acc).forEach(k =>
          k.push(highlight ? text : removeHighlight(text))
        )
      }
    }
    return acc
  }, res)
}

/**
 * Get index of comments.
 * @param note The card that you want to get its comments' index.
 * @param comment The comment that you want to get its index.
 * @returns Number The index of the comment.
 */
export function getCommentIndex(
  note: MbBookNote,
  comment: MbBookNote | string
) {
  const comments = note.comments
  for (let i = 0; i < comments.length; i++) {
    const _comment = comments[i]
    if (typeof comment == "string") {
      if (_comment.type == "TextNote" && _comment.text == comment) return i
    } else if (_comment.type == "LinkNote" && _comment.noteid == comment.noteId)
      return i
  }
  return -1
}

export async function removeCommentButLinkTag(
  node: MbBookNote,
  // 不删除
  filter: (comment: noteComment) => boolean,
  f?: (node: MbBookNote) => Promise<void> | void
) {
  const reservedComments = [] as string[]
  const len = node.comments.length
  node.comments.reverse().forEach((k, i) => {
    if (
      k.type == "TextNote" &&
      (k.text.includes("marginnote3app") || k.text.startsWith("#"))
    ) {
      reservedComments.push(k.text)
      node.removeCommentByIndex(len - i - 1)
    } else if (!filter(k)) node.removeCommentByIndex(len - i - 1)
  })
  f && (await f(node))
  appendTextComment(node, ...reservedComments)
}

/**
 * Get all the text in the card, include excerpt text, comment, tags.
 * @param node MindMap node, a card.
 * @param separator The separator between the text and comments.
 * @param highlight default true, will retention highlight symbol, **.
 * @returns string
 */
export function getAllText(
  node: MbBookNote,
  separator = "\n",
  highlight = true
) {
  return [
    ...getExcerptText(node, highlight).text,
    ...getAllCommnets(node).text,
    getAllTags(node).join(" ")
  ].join(separator)
}

/**
 * Remove the highlight symbol in the text.
 * @param text The text that you want to remove the highlight symbol.
 * @returns Processed text.
 */
export function removeHighlight(text: string) {
  return text.replace(/\*\*/g, "")
}

/**
 * Get all tags of one node.
 * @param node The card that you want to get its tags.
 * @param hash True by default. If false, will delete "#" in the tag.
 * @returns Array of strings. Each element is a tag.
 */
export function getAllTags(node: MbBookNote, hash = true) {
  const tags = node.comments.reduce((acc, cur) => {
    if (cur.type == "TextNote" || cur.type == "HtmlNote") {
      acc.push(...cur.text.split(/\s/).filter(k => k.startsWith("#")))
    }
    return acc
  }, [] as string[])
  return hash ? tags : tags.map(k => k.slice(1))
}

/**
 * Get all comments of one node.
 * @param node The card that you want to get all kind of its comments.
 * @returns Resource dict.
 */
export function getAllCommnets(node: MbBookNote) {
  const res = {
    text: [] as string[],
    base64: [] as string[],
    img: [] as string[],
    html: [] as string[],
    md: [] as string[]
  }
  return node.comments.reduce((acc, cur) => {
    if (cur.type === "PaintNote") {
      const imgs = exportPic(cur)
      if (imgs)
        Object.entries(imgs).forEach(([k, v]) => {
          if (k in acc) acc[k].push(v)
        })
    } else if (cur.type == "TextNote" || cur.type == "HtmlNote") {
      const text = cur.text.trim()
      if (text && !text.includes("marginnote3app") && !text.startsWith("#"))
        Object.values(acc).map(k => k.push(text))
    }
    return acc
  }, res)
}

/**
 * Add labels, and remove emphasis
 * @param node The card that you want to process.
 * @param tags The tags that you want to add.
 * @param force Force merging tags, even if no tags are added
 */
export function addTags(node: MbBookNote, tags: string[], force = false) {
  const existingTags: string[] = []
  const tagCommentIndex: number[] = []
  node.comments.forEach((comment, index) => {
    if (comment.type == "TextNote") {
      const _tags = comment.text.split(" ")
      if (_tags.every(tag => tag.startsWith("#"))) {
        existingTags.push(..._tags.map(tag => tag.slice(1)))
        tagCommentIndex.push(index)
      }
    }
  })

  // 如果该标签已存在，而且不是强制，就退出
  if (!force && (!tags.length || tags.every(tag => existingTags.includes(tag))))
    return

  // 从后往前删，索引不会变
  tagCommentIndex
    .reverse()
    .forEach(index => void node.removeCommentByIndex(index))

  const newTags = unique([...existingTags, ...tags])
  const tagLine = newTags.reduce((acc, cur) => {
    if (cur) return acc ? `${acc} #${cur}` : `#${cur}`
    else return acc
  }, "")
  appendTextComment(node, removeHighlight(tagLine))
  return tagLine
}

export function modifyNodeTitle(
  node: MbBookNote,
  titles: string | string[],
  merge = false
) {
  node = node.groupNoteId ? MN.db.getNoteById(node.groupNoteId)! : node
  const oldTitle = node.noteTitle?.split(/\s*[;；]\s*/) ?? []
  if (typeof titles === "string") titles = [titles]
  const newTitle = unique(merge ? [...oldTitle, ...titles] : titles).join("; ")
  if (node.excerptText === node.noteTitle) {
    node.noteTitle = newTitle
    node.excerptText = newTitle
  } else {
    node.noteTitle = newTitle
  }
}

export function appendTextComment(node: MbBookNote, ...comments: string[]) {
  comments.length &&
    comments.forEach(comment => {
      comment && node.appendTextComment(comment)
    })
}

export function getDocURL() {
  if (!MN.currnetNotebookid || MN.studyController.studyMode !== StudyMode.study)
    return
  const notebook = MN.db.getNotebookById(MN.currnetNotebookid)!
  const note = MN.notebookController.mindmapView.mindmapNodes?.reduce(
    (acc, k) => {
      if (k.note.docMd5 === MN.currentDocmd5 && k.note.modifiedDate) {
        if (acc?.modifiedDate) {
          if (acc.modifiedDate < k.note.modifiedDate) return k.note
        } else return k.note
      }
      return acc
    },
    undefined as undefined | MbBookNote
  )
  return note?.noteId
    ? `marginnote3app://note/${note.noteId}`
    : `marginnote3app://notebook/${notebook.topicId}`
}
