import React from "react";
import { View } from "react-native";
import { ui } from "../../constants/theme";
import TodayHolidayCarousel from "./TodayHolidayCarousel";
import TodayHolidayHero from "./TodayHolidayHero";
import NoHolidayMessage from "./NoHolidayMessage";

const TODAY_PAGER_HEIGHT = 420;

export default function TodaySection({ todayHolidays, onAbout }) {
    const hasNone = todayHolidays.length === 0;
    const hasOne = todayHolidays.length === 1;
    const hasMany = todayHolidays.length > 1;

    return (
        <View style={[ui.holidaysTodaySection, { flex: 1 }]}>
            {hasNone && <NoHolidayMessage />}

            {hasOne && (
                <TodayHolidayHero
                    holiday={todayHolidays[0]}
                    onAbout={onAbout}
                />
            )}

            {hasMany && (
                <View
                    style={[
                        ui.holidaysTodayPagerSlot,
                        { height: TODAY_PAGER_HEIGHT },
                    ]}
                >
                    <TodayHolidayCarousel
                        items={todayHolidays}
                        height={TODAY_PAGER_HEIGHT}
                        renderItem={({ item }) => (
                            <TodayHolidayHero
                                holiday={item}
                                onAbout={onAbout}
                            />
                        )}
                    />
                </View>
            )}
        </View>
    );
}
