import React, { useMemo, useRef, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";

export default function TodayHolidayCarousel({
    data = [],
    height = 300,
    peek = 0,
    gap = 18,
    CardComponent,
    formatDate,
    hebrewDate,
    ...cardProps
}) {
    const listRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const hasMultiple = data.length > 1;
    const effectivePeek = hasMultiple ? peek : 0;
    const effectiveGap = hasMultiple ? gap : 0;

    // ✅ Make cards narrower by ONLY the right-peek amount
    const cardWidth = useMemo(() => {
        if (!containerWidth) return 0;
        const w = containerWidth - effectivePeek;
        return w > 0 ? w : containerWidth;
    }, [containerWidth, effectivePeek]);

    const snapToInterval = useMemo(() => {
        if (!hasMultiple || !cardWidth) return undefined;
        return cardWidth + effectiveGap;
    }, [hasMultiple, cardWidth, effectiveGap]);

    if (!data.length) return null;

    return (
        <View
            style={[styles.wrap, { height }]}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            {containerWidth > 0 && cardWidth > 0 ? (
                <FlatList
                    ref={listRef}
                    data={data}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    bounces={true}
                    snapToInterval={snapToInterval}
                    snapToAlignment="start"
                    disableIntervalMomentum
                    contentContainerStyle={{
                        paddingLeft: 0,
                        paddingRight: 0,
                    }}
                    ItemSeparatorComponent={
                        hasMultiple
                            ? () => <View style={{ width: effectiveGap }} />
                            : null
                    }
                    renderItem={({ item, index }) => {
                        const isLast = index === data.length - 1;

                        return (
                            <View
                                style={{
                                    // ✅ last card becomes "single-card width"
                                    width: isLast ? containerWidth : cardWidth,
                                }}
                            >
                                <CardComponent
                                    holiday={item}
                                    formatDate={formatDate}
                                    hebrewDate={hebrewDate}
                                    cardWidth={
                                        isLast ? containerWidth : cardWidth
                                    }
                                    {...cardProps}
                                />
                            </View>
                        );
                    }}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { width: "100%" },
});
