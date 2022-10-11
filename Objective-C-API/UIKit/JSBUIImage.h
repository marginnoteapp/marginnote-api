#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <CoreImage/CoreImage.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBUIImage <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

//@property (nonatomic, readonly) UIEdgeInsets capInsets;
@property (nonatomic, readonly) CGFloat scale;
//@property (nonatomic, readonly) UIImageRenderingMode renderingMode;
@property (nonatomic, readonly) NSInteger leftCapWidth;
@property (nonatomic, readonly) id CGImage;
@property (nonatomic, readonly) CGSize size;
@property (nonatomic, readonly) NSInteger topCapHeight;
//@property (nonatomic, readonly) UIEdgeInsets alignmentRectInsets;
//@property (nonatomic, readonly) NSArray *images;
//@property (nonatomic, readonly) NSTimeInterval duration;
@property (nonatomic, readonly) UIImageOrientation imageOrientation;
//@property (nonatomic, readonly) UIImageResizingMode resizingMode;

+ (UIImage *)imageNamed:(NSString *)name;
+ (UIImage *)imageWithContentsOfFile:(NSString *)path;
+ (UIImage *)imageWithData:(NSData *)data;
+ (UIImage *)imageWithData:(NSData *)data scale:(CGFloat)scale;
+ (UIImage *)imageWithCGImage:(id)cgImage;
+ (UIImage *)imageWithCGImage:(id)cgImage scale:(CGFloat)scale orientation:(UIImageOrientation)orientation;

//- (id)initWithContentsOfFile:(NSString *)path;
//- (id)initWithData:(NSData *)data;
//- (id)initWithData:(NSData *)data scale:(CGFloat)scale;
//- (id)initWithCGImage:(id)cgImage;
//- (id)initWithCGImage:(id)cgImage scale:(CGFloat)scale orientation:(UIImageOrientation)orientation;
//- (id)initWithCIImage:(CIImage *)ciImage;
//- (id)initWithCIImage:(CIImage *)ciImage scale:(CGFloat)scale orientation:(UIImageOrientation)orientation;
- (id)CGImage;
- (void)drawAtPoint:(CGPoint)point;
- (void)drawAtPoint:(CGPoint)point blendMode:(CGBlendMode)blendMode alpha:(CGFloat)alpha;
- (void)drawInRect:(CGRect)rect;
- (void)drawInRect:(CGRect)rect blendMode:(CGBlendMode)blendMode alpha:(CGFloat)alpha;
- (void)drawAsPatternInRect:(CGRect)rect;
- (UIImage *)resizableImageWithCapInsets:(UIEdgeInsets)capInsets;
//- (UIImage *)resizableImageWithCapInsets:(UIEdgeInsets)capInsets resizingMode:(UIImageResizingMode)resizingMode;
- (UIImage *)imageWithAlignmentRectInsets:(UIEdgeInsets)alignmentInsets;
//- (UIImage *)imageWithRenderingMode:(UIImageRenderingMode)renderingMode;
- (UIImage *)stretchableImageWithLeftCapWidth:(NSInteger)leftCapWidth topCapHeight:(NSInteger)topCapHeight;
- (NSData *)jpegData:(double)compressionQuality;
- (NSData *)pngData;

#pragma clang diagnostic pop

@end
