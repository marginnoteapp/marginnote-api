#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBNSParagraphStyle <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (readonly) NSDictionary *options;
@property (readwrite) CGFloat paragraphSpacing;
@property (readwrite, copy) NSArray *tabStops;
@property (readwrite) CGFloat headIndent;
@property (readwrite) NSLineBreakMode lineBreakMode;
@property (readwrite) float hyphenationFactor;
@property (readwrite) NSTextAlignment alignment;
@property (readonly) CGFloat location;
@property (readwrite) CGFloat tailIndent;
@property (readwrite) CGFloat firstLineHeadIndent;
@property (readwrite) CGFloat lineSpacing;
@property (readwrite) CGFloat minimumLineHeight;
@property (readwrite) CGFloat paragraphSpacingBefore;
@property (readwrite) CGFloat maximumLineHeight;
@property (readwrite) CGFloat lineHeightMultiple;
@property (readwrite) NSWritingDirection baseWritingDirection;
@property (readwrite) CGFloat defaultTabInterval;

+ (NSParagraphStyle *)defaultParagraphStyle;
+ (NSWritingDirection)defaultWritingDirectionForLanguage:(NSString *)languageName;

#pragma clang diagnostic pop

@end
