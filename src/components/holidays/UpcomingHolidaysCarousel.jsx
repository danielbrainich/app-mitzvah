import React, { useMemo, useCallback } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import UpcomingHolidayCard from "./UpcomingHolidayCard";
import { ui } from "../../constants/theme";

export default function UpcomingHolidaysCarousel({
    holidays = [],
    peek = 24,
    gap = 16,
    height = 200,
    onAbout,
}) {
    const { width } = useWindowDimensions();

    const cardWidth = useMemo(
        () => Math.max(0, width - peek * 2),
        [width, peek]
    );
    const snapInterval = useMemo(() => cardWidth + gap, [cardWidth, gap]);

    const Separator = useCallback(() => <View style={{ width: gap }} />, [gap]);

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
                contentContainerStyle={[
                    ui.holidaysUpcomingCarouselContent,
                    { paddingRight: peek },
                ]}
                ItemSeparatorComponent={Separator}
                renderItem={({ item }) => (
                    <View style={{ width: cardWidth }}>
                        <UpcomingHolidayCard holiday={item} onAbout={onAbout} />
                    </View>
                )}
            />
        </View>
    );
}
