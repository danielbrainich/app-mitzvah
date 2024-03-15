const { HebrewCalendar, CandleLightingEvent, ParshaEvent, HavdalahEvent, Location } = require("@hebcal/core");


async function getShabbat(req, res) {
    console.log("hello");
    try {
        const startDate = new Date(req.params.date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);

        const locationData = req.query;

        const latitude = parseFloat(locationData.latitude);
        const longitude = parseFloat(locationData.longitude);
        const il = false;
        const tzid = locationData.timezone;
        const cityName = "Unknown";
        const countryCode = "US";
        const elevation = parseFloat(locationData.altitude);

        const location = new Location(latitude, longitude, il, tzid, cityName, countryCode, elevation);

        console.log("location", location);

        const options = {
            start: startDate,
            end: endDate,
            location: location,
            candlelighting: true,
            sedrot: true,
            omer: true,
            locale: "he",
        };

        console.log("options", options);

        const events = await HebrewCalendar.calendar(options);
        console.log("events", events)

        const shabbatInfo = getShabbatInfo(events);
        console.log("shabbatInfooo", shabbatInfo);

        res.json(shabbatInfo);
    } catch (error) {
        console.error("Error fetching Shabbat info:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

function getShabbatInfo(events) {
    const shabbatInfo = {
        candleTime: null,
        candleMemo: null,
        parashaEng: null,
        parashaHeb: null,
        parashaDate: null,
        parashaMemo: null,
        havdalahTime: null,
        havdalahMemo: null,
    };

    for (const event of events) {
        if (event instanceof CandleLightingEvent) {
            shabbatInfo.candleTime = event.fmtTime;
            shabbatInfo.candleMemo = event.memo;
            console.log("candleinfo",
            event.options, event.linkedEvent, event.date, event.eventTime, event.mask)
        } else if (event instanceof ParshaEvent) {
            shabbatInfo.parashaEng = event.desc;
            shabbatInfo.parashaHeb = event.desc;
            shabbatInfo.parashaDate = event.date.toString();
            shabbatInfo.parashaMemo = event.memo;
        } else if (event instanceof HavdalahEvent) {
            shabbatInfo.havdalahTime = event.fmtTime;
            shabbatInfo.havdalahMemo = event.memo;
        }
    }

    return shabbatInfo;
}

module.exports = { getShabbat };
