import type { JSValue, NSURLRequest, NSOperationQueue } from "."

declare global {
  const NSURLConnection: {
    sendAsynchronousRequestQueueCompletionHandler(
      request: NSURLRequest,
      queue: NSOperationQueue,
      completionHandler: JSValue
    ): void
    connectionWithRequest(request: NSURLRequest, delegate: any): NSURLConnection
  }
}

export declare type NSURLConnection = {}
