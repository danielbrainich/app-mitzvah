import React, { useMemo } from "react";
import { View, FlatList, useWindowDimensions, StyleSheet } from "react-native";
import UpcomingHolidayCard from "./UpcomingHolidayCard";

export default function UpcomingHolidaysCarousel({
    holidays = [],
    dateDisplay,
    peek = 24,
    gap = 16,
    height = 200,
}) {
    const { width } = useWindowDimensions();

    const cardWidth = useMemo(() => {
        // card is narrower than screen so next one can peek
        return Math.max(0, width - peek * 2);
    }, [width, peek]);

    const snapInterval = useMemo(() => cardWidth + gap, [cardWidth, gap]);

    if (!holidays.length) return null;

    return (
        <View style={{ height }}>
            <FlatList
                data={holidays}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                decelerationRate="fast"
                snapToInterval={snapInterval}
                snapToAlignment="start"
                disableIntervalMomentum
                contentContainerStyle={{
                    paddingLeft: 0, // left align more
                    paddingRight: peek, // space at the the end
                }}
                ItemSeparatorComponent={() => <View style={{ width: gap }} />}
                renderItem={({ item }) => (
                    <View style={{ width: cardWidth }}>
                        <UpcomingHolidayCard
                            holiday={item}
                            dateDisplay={dateDisplay}
                            cardWidth={cardWidth}
                        />
                    </View>
                )}
            />
        </View>
    );
}
