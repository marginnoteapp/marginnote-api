#import <Foundation/NSObject.h>
#import <Foundation/NSEnumerator.h>

@import Foundation;
@import JavaScriptCore;

@protocol JSBNSMutableSet;

@protocol JSBNSCountedSet <JSExport, JSBNSMutableSet>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

- (NSUInteger)countForObject:(id)object;
- (NSEnumerator *)objectEnumerator;
- (void)addObject:(id)object;
- (void)removeObject:(id)object;

#pragma clang diagnostic pop

@end
