import type {
  NSMutableURLRequest,
  NSData,
  NSHTTPURLResponse,
  NSError
} from "../api"
import { NSJSONWritingOptions, NSJSONReadingOptions } from "../api"
import { lang } from "./lang"

type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

class Response {
  data: NSData
  constructor(data: NSData) {
    this.data = data
  }
  json(): any {
    const res = NSJSONSerialization.JSONObjectWithDataOptions(
      this.data,
      NSJSONReadingOptions.MutableContainers
    )
    if (NSJSONSerialization.isValidJSONObject(res)) return res
    throw lang.not_JSON
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH"
  timeout?: number
  headers?: Record<string, any>
} & XOR<
  XOR<
    { json?: Record<string, any> },
    { form?: Record<string, string | number | boolean> }
  >,
  { search?: Record<string, string | number | boolean> }
>

function initRequest(
  url: string,
  options: RequestOptions
): NSMutableURLRequest {
  const request = NSMutableURLRequest.requestWithURL(
    NSURL.URLWithString(encodeURI(url))
  )
  request.setHTTPMethod(options.method ?? "GET")
  request.setTimeoutInterval(options.timeout ?? 3)
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    "Content-Type": "application/json",
    Accept: "application/json"
  }
  request.setAllHTTPHeaderFields(
    options.headers ? Object.assign(headers, options.headers) : headers
  )
  if (options.search) {
    request.setURL(
      NSURL.URLWithString(
        encodeURI(
          `${url}?${Object.entries(options.search).reduce((acc, cur) => {
            const [key, value] = cur
            return `${acc ? acc + "&" : ""}${key}=${value}`
          }, "")}`
        )
      )
    )
  } else if (options.form) {
    request.setHTTPBody(
      NSData.dataWithStringEncoding(
        Object.entries(options.form).reduce((acc, cur) => {
          const [key, value] = cur
          return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
        }, ""),
        4
      )
    )
  } else if (options.json)
    request.setHTTPBody(
      NSJSONSerialization.dataWithJSONObjectOptions(
        options.json,
        NSJSONWritingOptions.SortedKeys
      )
    )
  return request
}

export function fetch(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  return new Promise((resolve, reject) => {
    // UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    const queue = NSOperationQueue.mainQueue()
    const request = initRequest(url, options)
    NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
      request,
      queue,
      (res: NSHTTPURLResponse, data: NSData, err: NSError) => {
        // UIApplication.sharedApplication().networkActivityIndicatorVisible = false
        // It's strange, I can't get the res property
        // if (err.localizedDescription) reject(err.localizedDescription)
        if (data.length() == 0) reject(lang.not_receive)
        resolve(new Response(data))
      }
    )
  })
}

export default fetch
