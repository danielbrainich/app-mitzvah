// components/TodayHolidayCarousel.js
import React, { useMemo } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";

/**
 * Horizontal pager-style carousel.
 * - Parent owns the data + drawer logic.
 * - This component only handles layout + snapping.
 *
 * Props:
 * - data: array of holiday objects
 * - CardComponent: component that renders a card (receives { holiday, cardWidth, index, ... })
 * - height: height of the carousel viewport
 * - cardHeight: optional (passed through to CardComponent)
 * - peek: how much of the next card is visible
 * - gap: spacing between cards
 */
export default function TodayHolidayCarousel({
    data = [],
    CardComponent,
    height = 360,
    cardHeight = 360,
    peek = 42,
    gap = 18,
}) {
    const { width } = useWindowDimensions();

    const cardWidth = useMemo(
        () => Math.max(0, width - peek * 2),
        [width, peek]
    );
    const snapInterval = useMemo(() => cardWidth + gap, [cardWidth, gap]);

    if (!data?.length || !CardComponent) return null;

    return (
        <View style={{ height }}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={snapInterval}
                snapToAlignment="start"
                disableIntervalMomentum
                contentContainerStyle={{
                    paddingLeft: peek,
                    paddingRight: peek,
                }}
                ItemSeparatorComponent={() => <View style={{ width: gap }} />}
                renderItem={({ item, index }) => (
                    <View style={{ width: cardWidth }}>
                        <CardComponent
                            holiday={item}
                            index={index}
                            cardWidth={cardWidth}
                            cardHeight={cardHeight}
                        />
                    </View>
                )}
            />
        </View>
    );
}
