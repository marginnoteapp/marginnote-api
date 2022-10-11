#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <QuartzCore/CATransform3D.h>

#import <UIKit/UIKit.h>
#if !TARGET_OS_IPHONE
#import "PSTCollectionView.h"
#import "PSTCollectionViewLayout.h"
#endif
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBUICollectionViewLayout <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, readonly) BOOL invalidateEverything;
@property (nonatomic, readonly) NSIndexPath *indexPathAfterUpdate;
@property (nonatomic, readonly) UICollectionView *collectionView;
@property (nonatomic) CGRect frame;
@property (nonatomic, readonly) NSString *representedElementKind;
//@property (nonatomic, readonly) UICollectionUpdateAction updateAction;
@property (nonatomic, retain) NSIndexPath *indexPath;
@property (nonatomic) CGSize size;
@property (nonatomic) CATransform3D transform3D;
//@property (nonatomic, readonly) UICollectionElementCategory representedElementCategory;
@property (nonatomic) CGAffineTransform transform;
@property (nonatomic) CGFloat alpha;
@property (nonatomic) CGPoint center;
@property (nonatomic, getter = isHidden) BOOL hidden;
@property (nonatomic) NSInteger zIndex;
@property (nonatomic, readonly) NSIndexPath *indexPathBeforeUpdate;
@property (nonatomic) CGRect bounds;
@property (nonatomic, readonly) BOOL invalidateDataSourceCounts;

+ (Class)layoutAttributesClass;
+ (Class)invalidationContextClass;

- (void)invalidateLayout;
//- (void)invalidateLayoutWithContext:(UICollectionViewLayoutInvalidationContext *)context;
- (void)registerClass:(id)viewClass forDecorationViewOfKind:(NSString *)decorationViewKind;
//- (void)registerNib:(UINib *)nib forDecorationViewOfKind:(NSString *)decorationViewKind;
- (void)prepareLayout;
- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect;
- (UICollectionViewLayoutAttributes *)layoutAttributesForItemAtIndexPath:(NSIndexPath *)indexPath;
- (UICollectionViewLayoutAttributes *)layoutAttributesForSupplementaryViewOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath;
- (UICollectionViewLayoutAttributes *)layoutAttributesForDecorationViewOfKind:(NSString *)decorationViewKind atIndexPath:(NSIndexPath *)indexPath;
- (BOOL)shouldInvalidateLayoutForBoundsChange:(CGRect)newBounds;
//- (UICollectionViewLayoutInvalidationContext *)invalidationContextForBoundsChange:(CGRect)newBounds;
- (CGPoint)targetContentOffsetForProposedContentOffset:(CGPoint)proposedContentOffset withScrollingVelocity:(CGPoint)velocity;
- (CGPoint)targetContentOffsetForProposedContentOffset:(CGPoint)proposedContentOffset;
- (CGSize)collectionViewContentSize;

#pragma clang diagnostic pop

@end
