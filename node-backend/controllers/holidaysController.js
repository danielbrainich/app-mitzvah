const { HebrewCalendar } = require('@hebcal/core');

async function getHolidays(req, res) {
    try {
        const providedDate = new Date(req.params.date);
        const startDate = new Date(providedDate.getTime() + (24 * 60 * 60 * 1000));
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
            locale: 'he',
        };

        const events = await HebrewCalendar.calendar(options);

        const uniqueHolidays = collectUniqueHolidays(events);

        const formattedEvents = uniqueHolidays.map((ev) => ({
            title: ev.getDesc(),
            hebrewTitle: ev.renderBrief('he-x-NoNikud'),
            date: ev.getDate().greg().toISOString().split("T")[0],
            hebrewDate: ev.getDate().toString(),
            categories: ev.getCategories(),
        }));

        res.json(formattedEvents);
    } catch (error) {
        console.error('Error fetching holidays:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function collectUniqueHolidays(events) {
    const seenHolidays = new Set();
    const collectedHolidays = [];

    for (const event of events) {
        const desc = event.getDesc();

        if (!seenHolidays.has(desc)) {
            seenHolidays.add(desc);
            collectedHolidays.push(event);
        }
    }
    return collectedHolidays;
}

module.exports = { getHolidays };
