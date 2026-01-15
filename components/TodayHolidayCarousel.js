import React, { useMemo, useRef, useState, useCallback } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import { ui } from "../styles/theme";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

export default function TodayHolidayCarousel({
    items = [],
    renderItem,
    height = 320, // set from screen if you want
    dotSize = 8 ,
    dotGap = 8,
}) {
    const { width: winW } = useWindowDimensions();
    const listRef = useRef(null);
    const [index, setIndex] = useState(0);

    // match your screen paddingHorizontal: 8 (ui.screen)
    // and your inner centered maxWidth handling (if you have it)
    const pageWidth = useMemo(() => winW - 16, [winW]);

    const onMomentumEnd = useCallback(
        (e) => {
            const x = e.nativeEvent.contentOffset.x || 0;
            const i = clamp(
                Math.round(x / pageWidth),
                0,
                Math.max(0, items.length - 1)
            );
            setIndex(i);
        },
        [items.length, pageWidth]
    );

    if (!items?.length) return null;

    return (
        <View style={{ width: "100%" }}>
            <FlatList
                ref={listRef}
                data={items}
                keyExtractor={(_, i) => String(i)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={items.length > 1}
                onMomentumScrollEnd={onMomentumEnd}
                renderItem={({ item, index: i }) => (
                    <View style={{ width: pageWidth, height }}>
                        {renderItem({ item, index: i })}
                    </View>
                )}
            />

            {/* Dots */}
            {items.length > 1 ? (
                <View style={ui.carouselDotsRow}>
                    {items.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                ui.carouselDot,
                                {
                                    width: dotSize,
                                    height: dotSize,
                                    borderRadius: dotSize / 2,
                                    marginHorizontal: dotGap / 2,
                                },
                                i === index ? ui.carouselDotActive : null,
                            ]}
                        />
                    ))}
                </View>
            ) : null}
        </View>
    );
}
