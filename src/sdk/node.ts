import { MbBookNote, MNPic, NoteComment } from "src/api"
import { MN } from "./mn"
import { unique } from "./utils"

/**
 * Get picture base64 code by {@param} pic.
 * @param pic {@link MNPic}
 * @returns Base64 code of the picture.
 */
export function exportPic(pic: MNPic) {
  const base64 = MN.db.getMediaByHash(pic.paint)?.base64Encoding()
  return base64
    ? {
        html: `<img class="MNPic" src="data:image/jpeg;base64,${base64}"/>`,
        md: `![MNPic](data:image/jpeg;base64,${base64})`
      }
    : undefined
}

function getNoteExcerptTextPic(note: MbBookNote) {
  const acc = {
    ocr: [] as string[],
    html: [] as string[],
    md: [] as string[]
  }
  const text = note.excerptText?.trim()
  if (note.excerptPic) {
    const imgs = exportPic(note.excerptPic)
    if (imgs)
      Object.entries(imgs).forEach(([k, v]) => {
        if (k in acc) acc[k].push(v)
      })
    if (text) {
      acc.ocr.push(text)
    }
  } else {
    if (text) {
      Object.values(acc).forEach(k => k.push(text))
    }
  }
  return acc
}

export class NodeNote {
  public note: MbBookNote
  constructor(note: MbBookNote) {
    this.note = note.groupNoteId ? MN.db.getNoteById(note.groupNoteId)! : note
  }
  static getSelectedNodes() {
    const MindMapNodes: any[] | undefined =
      MN.notebookController.mindmapView.selViewLst
    return MindMapNodes?.length
      ? MindMapNodes.map(item => new NodeNote(item.note.note))
      : []
  }
  get nodeid() {
    return this.note.noteId
  }
  /**
   * Get card tree recursively, including all the node's children,grandchildren and grandgrandchildren etc.
   */
  get descendantNodes() {
    const { childNodes } = this
    if (!childNodes.length) {
      return {
        descendant: [] as NodeNote[],
        treeIndex: [] as number[][]
      }
    } else {
      function down(
        nodes: NodeNote[],
        level = 0,
        lastIndex = [] as number[],
        ret = {
          descendant: [] as NodeNote[],
          treeIndex: [] as number[][]
        }
      ) {
        level++
        nodes.forEach((node, index) => {
          ret.descendant.push(node)
          lastIndex = lastIndex.slice(0, level - 1)
          lastIndex.push(index)
          ret.treeIndex.push(lastIndex)
          if (node.childNodes?.length) {
            down(node.childNodes, level, lastIndex, ret)
          }
        })
        return ret
      }
      return down(childNodes)
    }
  }
  /**
   * Get ancester nodes recursively, including all the node's parent, grandparent and grandgrandparent etc.
   */
  get ancestorNodes() {
    function up(node: NodeNote, ancestorNodes: NodeNote[]) {
      if (node.note.parentNote) {
        const parentNode = new NodeNote(node.note.parentNote)
        ancestorNodes = up(parentNode, [...ancestorNodes, parentNode])
      }
      return ancestorNodes
    }
    return up(this, [])
  }

  get childNodes() {
    return this.note.childNotes?.map(k => new NodeNote(k)) ?? []
  }

  get parentNode() {
    return this.note.parentNote && new NodeNote(this.note.parentNote)
  }

  /**
   * Get all excerptions of one node.
   */
  get notes() {
    return this.note.comments.reduce(
      (acc, cur) => {
        cur.type == "LinkNote" && acc.push(MN.db.getNoteById(cur.noteid)!)
        return acc
      },
      [this.note]
    )
  }
  set titles(titles: string[]) {
    const newTitle = unique(titles).join("; ")
    if (this.note.excerptText === this.note.noteTitle) {
      this.note.noteTitle = newTitle
      this.note.excerptText = newTitle
    } else {
      this.note.noteTitle = newTitle
    }
  }
  get isOCR() {
    if (this.note.excerptPic?.paint) {
      return this.note.textFirst
    }
  }
  get title() {
    return this.note.noteTitle ?? ""
  }
  set title(title: string) {
    this.note.noteTitle = title
  }
  get mainExcerptText() {
    return this.note.excerptText ?? ""
  }
  set mainExcerptText(text: string) {
    this.note.excerptText = text
  }
  get titles() {
    return unique(this.note.noteTitle?.split(/\s*[;；]\s*/) ?? [])
  }
  appendTitles(...titles: string[]) {
    const newTitle = unique([...this.titles, ...titles]).join("; ")
    if (this.note.excerptText === this.note.noteTitle) {
      this.note.noteTitle = newTitle
      this.note.excerptText = newTitle
    } else {
      this.note.noteTitle = newTitle
    }
  }
  /** no # */
  get tags() {
    const tags = this.note.comments.reduce((acc, cur) => {
      if (cur.type == "TextNote" && cur.text.startsWith("#")) {
        acc.push(...cur.text.split(/\s+/).filter(k => k.startsWith("#")))
      }
      return acc
    }, [] as string[])
    return tags.map(k => k.slice(1))
  }
  set tags(tags: string[]) {
    this.tidyupTags()
    tags = unique(tags)
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => `#${k}`).join(" "))
  }
  appendTags(...tags: string[]) {
    this.tidyupTags()
    tags = unique([...this.tags, ...tags])
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => `#${k}`).join(" "))
    return this
  }
  /**
   * 把所有标签换到一行
   */
  tidyupTags() {
    const existingTags: string[] = []
    const tagCommentIndex: number[] = []
    this.note.comments.forEach((comment, index) => {
      if (comment.type == "TextNote" && comment.text.startsWith("#")) {
        const tags = comment.text.split(" ").filter(k => k.startsWith("#"))
        existingTags.push(...tags.map(tag => tag.slice(1)))
        tagCommentIndex.unshift(index)
      }
    })

    tagCommentIndex.forEach(index => {
      this.note.removeCommentByIndex(index)
    })

    this.appendTextComments(
      unique(existingTags)
        .map(k => `#${k}`)
        .join(" ")
    )
    return this
  }
  getCommentIndex(comment: MbBookNote | string) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (typeof comment == "string") {
        if (_comment.type == "TextNote" && _comment.text == comment) return i
      } else if (
        _comment.type == "LinkNote" &&
        _comment.noteid == comment.noteId
      )
        return i
    }
    return -1
  }
  get excerptsTextPic() {
    return this.notes.reduce(
      (acc, cur) => {
        Object.entries(getNoteExcerptTextPic(cur)).forEach(([k, v]) => {
          if (k in acc) acc[k].push(v)
        })
        return acc
      },
      {
        ocr: [] as string[],
        html: [] as string[],
        md: [] as string[]
      }
    )
  }
  get commentsTextPic() {
    return this.note.comments.reduce(
      (acc, cur) => {
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
      },
      {
        html: [] as string[],
        md: [] as string[]
      }
    )
  }
  get excerptsText() {
    return this.notes.reduce((acc, note) => {
      const text = note.excerptText?.trim()
      if (text) {
        if (!note.excerptPic?.paint || this.isOCR) {
          acc.push(text)
        }
      }
      return acc
    }, [] as string[])
  }
  get commentsText() {
    return this.note.comments.reduce((acc, cur) => {
      if (cur.type == "TextNote" || cur.type == "HtmlNote") {
        const text = cur.text.trim()
        if (text && !text.includes("marginnote3app") && !text.startsWith("#"))
          acc.push(text)
      }
      return acc
    }, [] as string[])
  }
  get allTextPic() {
    const retVal = getNoteExcerptTextPic(this.note)
    this.note.comments.forEach(k => {
      if (k.type === "PaintNote") {
        const imgs = exportPic(k)
        if (imgs)
          Object.entries(imgs).forEach(([k, v]) => {
            if (k in retVal) retVal[k].push(v)
          })
      } else if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text) Object.values(retVal).map(k => k.push(text))
      } else if (k.type == "LinkNote") {
        const note = MN.db.getNoteById(k.noteid)
        if (note)
          Object.entries(getNoteExcerptTextPic(note)).forEach(([k, v]) => {
            if (k in retVal) retVal[k].push(v)
          })
      }
    })
    return {
      html: retVal.html.join("\n\n"),
      ocr: retVal.ocr.join("\n\n"),
      md: retVal.md.join("\n\n")
    }
  }
  get allText() {
    const { mainExcerptText } = this
    const retVal =
      mainExcerptText && (!this.note.excerptPic?.paint || this.isOCR)
        ? [mainExcerptText]
        : []
    this.note.comments.forEach(k => {
      if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text) retVal.push(text)
      } else if (k.type == "LinkNote") {
        const note = MN.db.getNoteById(k.noteid)
        const text = note?.excerptText?.trim()
        if (text && (!note?.excerptPic?.paint || this.isOCR)) retVal.push(text)
      }
    })
    return retVal.join("\n\n")
  }
  get excerptsCommentsText() {
    const { mainExcerptText } = this
    const retVal =
      mainExcerptText && (!this.note.excerptPic?.paint || this.isOCR)
        ? [mainExcerptText]
        : []
    this.note.comments.forEach(k => {
      if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text && !text.includes("marginnote3app") && !text.startsWith("#"))
          retVal.push(text)
      } else if (k.type == "LinkNote") {
        const note = MN.db.getNoteById(k.noteid)
        const text = note?.excerptText?.trim()
        if (text && (!note?.excerptPic?.paint || this.isOCR)) retVal.push(text)
      }
    })
    return retVal
  }
  appendTextComments(...comments: string[]) {
    comments = unique(comments)
    const existComments = this.note.comments.filter(k => k.type === "TextNote")
    comments.forEach(comment => {
      if (
        comment &&
        existComments.every(k => k.type === "TextNote" && k.text !== comment)
      ) {
        this.note.appendTextComment(comment)
      }
    })
    return this
  }
  /**
   * Remove all comment but tag, link and also the filterd. tag and link will be sat at the end。
   * @param filter not deleted
   * @param f after deleted, before set tag and link
   * @returns
   */
  async removeCommentButLinkTag(
    // 不删除
    filter: (comment: NoteComment) => boolean,
    f?: (node: NodeNote) => Promise<void> | void
  ) {
    const { removedIndex, linkTags } = this.note.comments.reduce(
      (acc, comment, i) => {
        if (
          comment.type == "TextNote" &&
          (comment.text.includes("marginnote3app://note/") ||
            comment.text.startsWith("#"))
        ) {
          acc.linkTags.push(comment.text)
          acc.removedIndex.unshift(i)
        } else if (!filter(comment)) acc.removedIndex.unshift(i)
        return acc
      },
      {
        removedIndex: [] as number[],
        linkTags: [] as string[]
      }
    )
    removedIndex.forEach(k => {
      this.note.removeCommentByIndex(k)
    })
    f && (await f(this))
    this.appendTextComments(...linkTags)
    return this
  }
}
