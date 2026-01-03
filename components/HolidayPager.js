import React, { useMemo, useState } from "react";
import { View, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import PagerView from "react-native-pager-view";

export default function HolidayPager({
    data = [],
    dateDisplay,
    height = 300,
    peek = 0,
    CardComponent,
    showDots = false, // only show dots if true AND data.length > 1
    ...cardProps
}) {
    const { width } = useWindowDimensions();
    const [page, setPage] = useState(0);

    const cardWidth = useMemo(() => {
        // if peek=0, cardWidth = full width
        const w = width - peek * 2;
        return w > 0 ? w : width;
    }, [width, peek]);

    if (!data || data.length === 0) return null;

    const shouldShowDots = Boolean(showDots) && data.length > 1;

    return (
        <View style={[styles.wrapper, { height }]}>
            <PagerView
                style={styles.pager}
                initialPage={0}
                onPageSelected={(e) => setPage(e.nativeEvent.position)}
            >
                {data.map((holiday) => (
                    <View
                        key={holiday.id}
                        style={[
                            styles.page,
                            { paddingLeft: peek, paddingRight: 0 },
                        ]}
                    >
                        <CardComponent
                            holiday={holiday}
                            dateDisplay={dateDisplay}
                            cardWidth={cardWidth}
                            {...cardProps}
                        />
                    </View>
                ))}
            </PagerView>

            {shouldShowDots ? (
                <View style={styles.dotsRow}>
                    {data.map((_, i) => {
                        const active = i === page;
                        return (
                            <Pressable
                                // NOTE: press-to-jump requires a ref to PagerView; skipping for now
                                key={i}
                                style={[styles.dot, active && styles.dotActive]}
                                accessibilityRole="button"
                                accessibilityLabel={`Page ${i + 1}`}
                            />
                        );
                    })}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { width: "100%", paddingBottom: 16 },
    pager: { flex: 1 },

    // Left align instead of centered
    page: {
        justifyContent: "center",
        alignItems: "flex-start",
    },

    dotsRow: {
        position: "absolute",
        bottom: 6,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 99,
        backgroundColor: "rgba(255,255,255,0.35)",
    },
    dotActive: {
        backgroundColor: "rgba(255,255,255,0.9)",
        transform: [{ scale: 1.15 }],
    },
});
