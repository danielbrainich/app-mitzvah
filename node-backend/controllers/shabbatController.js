const {
    HebrewCalendar,
    CandleLightingEvent,
    ParshaEvent,
    HavdalahEvent,
    Location,
} = require("@hebcal/core");

async function getShabbat(req, res) {
    console.log("hello");
    try {
        const providedDate = new Date(req.params.date);

        let friday;
        let saturday;
        if (providedDate.getDay() === 5) {
            friday = new Date(providedDate);
            saturday = new Date(providedDate);
            saturday.setDate(providedDate.getDate() + 1);
        } else if (providedDate.getDay() === 6) {
            friday = new Date(providedDate);
            friday.setDate(providedDate.getDate() - 1);
            saturday = new Date(providedDate);
        } else {
            friday = new Date(providedDate);
            saturday = new Date(providedDate);
            friday.setDate(
                providedDate.getDate() + ((5 - providedDate.getDay() + 7) % 7)
            );
            saturday.setDate(
                providedDate.getDate() + ((6 - providedDate.getDay() + 7) % 7)
            );
        }

        const startDate = new Date(friday);
        const endDate = new Date(saturday);
        const locationData = req.query;

        const latitude = parseFloat(locationData.latitude);
        const longitude = parseFloat(locationData.longitude);
        const il = false;
        const tzid = locationData.timezone;
        const cityName = "Unknown";
        const countryCode = "US";
        const elevation = parseFloat(locationData.altitude);

        const location = new Location(
            latitude,
            longitude,
            il,
            tzid,
            cityName,
            countryCode,
            elevation
        );

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
        console.log("events", events);
        const shabbatInfo = getShabbatInfo(events);
        console.log("shabgfIdnfo", shabbatInfo);

        res.json(shabbatInfo);
    } catch (error) {
        console.error("Error fetching Shabbat info:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
});

function getShabbatInfo(events) {
    const shabbatInfo = {
        candleDesc: null,
        candleTime: null,
        sundown: null,
        candleDate: null,
        candleHDate: null,

        parshaHebrew: null,
        parshaEnglish: null,
        parshaHDate: null,

        havdalahDesc: null,
        havdalahTime: null,
        havdalahDate: null,
        havdalahHDate: null,
    };

    for (const event of events) {
        if (event instanceof CandleLightingEvent) {
            shabbatInfo.candleDesc = event.renderBrief('he-x-NoNikud');
            shabbatInfo.candleTime = event.fmtTime || null;
            shabbatInfo.candleDate = event.eventTime ? dateFormatter.format(new Date(event.eventTime)) : null;
            shabbatInfo.candleHDate = event.date ? event.date.toString() : null;

            const candleDateTime = new Date(event.eventTime);
            candleDateTime.setMinutes(candleDateTime.getMinutes() + 18);
            shabbatInfo.sundown = timeFormatter.format(candleDateTime);

        } else if (event instanceof ParshaEvent) {
            shabbatInfo.parshaEnglish = event.render('en');
            shabbatInfo.parshaHebrew = event.renderBrief('he-x-NoNikud');
            shabbatInfo.parshaHDate = event.date ? event.date.toString() : null;
        } else if (event instanceof HavdalahEvent) {
            shabbatInfo.havdalahDesc = event.renderBrief('he-x-NoNikud');
            shabbatInfo.havdalahTime = event.fmtTime || null;
            shabbatInfo.havdalahDate = event.eventTime ? dateFormatter.format(new Date(event.eventTime)) : null;
            shabbatInfo.havdalahHDate = event.date ? event.date.toString() : null;
        }
    }

    return shabbatInfo;
}

module.exports = { getShabbat };
