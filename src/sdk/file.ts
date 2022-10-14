import { NSJSONReadingOptions } from "../api"
import { MN } from "./mn"

export function isfileExists(path: string) {
  return NSFileManager.defaultManager().fileExistsAtPath(path)
}

export function writeTextFile(path: string, text: string) {
  NSData.dataWithStringEncoding(text, 4).writeToFileAtomically(path, false)
}

export function readJSON(path: string) {
  const ret = NSJSONSerialization.JSONObjectWithDataOptions(
    NSData.dataWithContentsOfFile(path),
    NSJSONReadingOptions.MutableContainers
  )
  if (NSJSONSerialization.isValidJSONObject(ret)) {
    return ret
  } else throw "Invalid JSON"
}

export function copyFile(src: string, dest: string) {
  return NSFileManager.defaultManager().copyItemAtPathToPath(src, dest)
}

export function writeJSON(path: string, data: any) {
  NSData.dataWithStringEncoding(
    JSON.stringify(data, undefined, 2),
    4
  ).writeToFileAtomically(path, false)
}

/**
 * @param file file path
 * @param UTI https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/UTIRef/Articles/System-DeclaredUniformTypeIdentifiers.html#//apple_ref/doc/uid/TP40009259-SW1
 */
export function saveFile(file: string, UTI: string) {
  // iPad 上默认就会使用分享的接口
  MN.app.saveFileWithUti(file, UTI)
  // if (MN.isMac) {
  // } else {
  //   postNotification("OpenInApp", {
  //     fileURL: file,
  //     UTI
  //     // UTI: "public.folder"
  //     // UTI:  "com.adobe.pdf"
  //   })
  // }
}

export function saveTextFile(text: string, fileName: string, UTI: string) {
  const path = `${MN.app.tempPath}/${fileName}`
  writeTextFile(path, text)
  saveFile(path, UTI)
}

/**
 *
 * not work on iPad
 */
export async function openFile(...uti: string[]) {
  // ["com.adobe.pdf"],
  return new Promise<string | undefined>(resolve => {
    MN.app.openFileWithUTIs(uti, MN.studyController, (path: string) => {
      resolve(path)
    })
    resolve(undefined)
  })
}
