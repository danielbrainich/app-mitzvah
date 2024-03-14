const express = require("express");
const { HebrewCalendar, HDate, Location, Event } = require("@hebcal/core");

const app = express();
const port = 8000;

app.use(express.json());

app.get("/api/holidays/:date", (req, res) => {
    const startDate = new Date(req.params.date);
    let endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 15);

    const options = {
        start: startDate,
        end: endDate,
        isHebrewYear: false,
        candlelighting: false,
        noMinorFast: true,
        noSpecialShabbat: true,
        noModern: false,
        noRoshChodesh: true,
        sedrot: false,
        omer: false,
        shabbatMevarchim: false,
        molad: false,
        yomKippurKatan: false,
    };

    const events = HebrewCalendar.calendar(options);

    function collectUniqueHolidays(events) {
        const seenHolidays = new Set();
        const collectedHolidays = [];

        for (const event of events) {
            const desc = event.getDesc();

            if (seenHolidays.has(desc)) {
                break;
            }
            seenHolidays.add(desc);
            collectedHolidays.push(event);
        }

        return collectedHolidays;
    }

    const uniqueHolidays = collectUniqueHolidays(events);

    const formattedEvents = uniqueHolidays.map((ev) => ({
        title: ev.getDesc(),
        date: ev.getDate().greg().toISOString().split("T")[0],
        hebrewDate: ev.getDate().toString(),
    }));

    console.log(formattedEvents);
    res.json(formattedEvents);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
