import React, { useMemo } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import UpcomingHolidayCard from "./UpcomingHolidayCard";

export default function UpcomingHolidaysCarousel({
    holidays = [],
    formatDate,
    hebrewDate,
    peek = 24,
    gap = 16,
    height = 200,
    todayIso,
    onAbout,
}) {
    const { width } = useWindowDimensions();

    const cardWidth = useMemo(() => {
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
                bounces
                decelerationRate="fast"
                snapToInterval={snapInterval}
                snapToAlignment="start"
                disableIntervalMomentum
                contentContainerStyle={{
                    paddingLeft: 0,
                    paddingRight: peek,
                }}
                ItemSeparatorComponent={() => <View style={{ width: gap }} />}
                renderItem={({ item }) => (
                    <View style={{ width: cardWidth }}>
                        <UpcomingHolidayCard
                            holiday={item}
                            formatDate={formatDate}
                            hebrewDate={hebrewDate}
                            todayIso={todayIso}
                            cardWidth={cardWidth}
                            onAbout={onAbout}
                        />
                    </View>
                )}
            />
        </View>
    );
}
