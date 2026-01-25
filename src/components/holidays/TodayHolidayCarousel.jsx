import React, { useMemo, useRef, useState, useCallback } from "react";
import { View, FlatList, useWindowDimensions, StyleSheet } from "react-native";
import { ui, spacing } from "../../constants/theme";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function pageIndexFromOffset(offsetX, pageWidth, itemCount) {
    const x = offsetX || 0;
    return clamp(Math.round(x / pageWidth), 0, Math.max(0, itemCount - 1));
}

export default function TodayHolidayCarousel({
    items = [],
    renderItem,
    height = 320,
}) {
    const { width: winW } = useWindowDimensions();
    const listRef = useRef(null);
    const [index, setIndex] = useState(0);

    const pageWidth = useMemo(() => winW - 16, [winW]);

    const onMomentumEnd = useCallback(
        (e) => {
            const x = e?.nativeEvent?.contentOffset?.x ?? 0;
            setIndex(pageIndexFromOffset(x, pageWidth, items.length));
        },
        [items.length, pageWidth]
    );

    if (!items?.length) return null;

    return (
        <View style={styles.container}>
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

            {items.length > 1 && (
                <View style={ui.paginationDots}>
                    {items.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                ui.paginationDot,
                                i === index && ui.paginationDotActive,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});
