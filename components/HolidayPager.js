import React, { useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import PagerView from "react-native-pager-view";

export default function HolidayPager({
    data = [],
    dateDisplay,
    height = 200,
    peek = 0,
    CardComponent,
}) {
    const { width } = useWindowDimensions();

    // ✅ Hooks must run even when data is empty
    const cardWidth = useMemo(() => {
        const w = width - peek * 2;
        return w > 0 ? w : width;
    }, [width, peek]);

    if (!data || data.length === 0 || !CardComponent) return null;

    return (
        <View style={[styles.wrapper, { height }]}>
            <PagerView style={styles.pager} initialPage={0}>
                {data.map((holiday) => (
                    <View
                        key={holiday.id}
                        style={[styles.page, { paddingHorizontal: peek }]}
                    >
                        <CardComponent
                            holiday={holiday} // ✅ fixed
                            dateDisplay={dateDisplay}
                            cardWidth={cardWidth}
                        />
                    </View>
                ))}
            </PagerView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { width: "100%" },
    pager: { flex: 1 },
    page: {
        justifyContent: "center",
        alignItems: "center",
    },
});
