const { HebrewCalendar, CandleLightingEvent, ParshaEvent, HavdalahEvent, Location } = require("@hebcal/core");


async function getShabbat(req, res) {
    console.log("hello");
    try {
        const providedDate = new Date(req.params.date);

        const nearestSaturday = new Date(providedDate);
        nearestSaturday.setDate(providedDate.getDate() + (6 - providedDate.getDay() + 7) % 7);

        const startDate = new Date();
        const endDate = new Date(nearestSaturday);

        const locationData = req.query;

        const latitude = parseFloat(locationData.latitude);
        const longitude = parseFloat(locationData.longitude);
        const il = false;
        const tzid = locationData.timezone;
        const cityName = "Unknown";
        const countryCode = "US";
        const elevation = parseFloat(locationData.altitude);

        const location = new Location(latitude, longitude, il, tzid, cityName, countryCode, elevation);

        const options = {
            start: startDate,
            end: endDate,
            location: location,
            candlelighting: true,
            sedrot: true,
            omer: true,
            locale: "he",
        };

        const events = await HebrewCalendar.calendar(options);
        const shabbatInfo = getShabbatInfo(events);
        console.log("shabbatInfo", shabbatInfo);

        res.json(shabbatInfo);
    } catch (error) {
        console.error("Error fetching Shabbat info:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

function getShabbatInfo(events) {
    const shabbatInfo = {
        candleDesc: null,
        candleTime: null,
        candleMemo: null,
        candleDateTime: null,
        candleHDate: null,
        parshaDesc: null,
        parshaDate: null,
        havdalahDesc: null,
        havdalahTime: null,
        havdalahDateTime: null,
        havdalahHDate: null,
    };

    for (const event of events) {
        if (event instanceof CandleLightingEvent) {
            shabbatInfo.candleDesc = event.desc || null;
            shabbatInfo.candleTime = event.fmtTime || null;
            shabbatInfo.candleMemo = event.memo || null;
            shabbatInfo.candleDateTime = event.eventTime ? event.eventTime.toString() : null;
            shabbatInfo.candleHDate = event.date ? event.date.toString() : null;
        } else if (event instanceof ParshaEvent) {
            shabbatInfo.parshaDesc = event.desc || null;
            shabbatInfo.parshaDate = event.date ? event.date.toString() : null;
        } else if (event instanceof HavdalahEvent) {
            shabbatInfo.havdalahDesc = event.desc || null;
            shabbatInfo.havdalahTime = event.fmtTime || null;
            shabbatInfo.havdalahDateTime = event.eventTime ? event.eventTime.toString() : null;
            shabbatInfo.havdalahHDate = event.date ? event.date.toString() : null;
        }
    }

    return shabbatInfo;
}


module.exports = { getShabbat };
