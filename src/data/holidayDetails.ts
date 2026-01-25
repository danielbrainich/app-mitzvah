export const HOLIDAY_DETAILS: Record<
    string,
    { title: string; description: string; aliases: string[] }
> = {
    "Rosh Chodesh Sh’vat": {
        title: "Rosh Chodesh Sh’vat",
        description:
            "Rosh Chodesh marks the new Hebrew month with special prayers (Hallel in many communities) and a festive tone. Sh’vat is associated with the renewal of trees and leads into Tu BiShvat.",
        aliases: [],
    },

    "Tu BiShvat": {
        title: "Tu BiShvat",
        description:
            "The “New Year for Trees,” originally used to calculate tithes on fruit. Today it’s often marked by eating fruits (especially those of Israel), planting, and reflecting on nature and stewardship.",
        aliases: [],
    },

    "Shabbat Shirah": {
        title: "Shabbat Shirah",
        description:
            "“Shabbat of Song,” named for the Song at the Sea (Shirat HaYam) read in Parashat Beshalach. Many communities add special melodies and focus on gratitude and redemption.",
        aliases: [],
    },

    "Rosh Chodesh Adar": {
        title: "Rosh Chodesh Adar",
        description:
            "Rosh Chodesh begins the month of Adar (or Adar I/II in leap years). Adar is famously linked with joy—“when Adar enters, we increase in happiness”—as Purim approaches.",
        aliases: ["Rosh Chodesh Adar I", "Rosh Chodesh Adar II"],
    },

    "Purim Katan": {
        title: "Purim Katan",
        description:
            "A “mini Purim” observed in Adar I during leap years. It’s a light, low-key day—no megillah reading—often marked by extra joy and a small celebratory meal.",
        aliases: [],
    },

    "Shushan Purim Katan": {
        title: "Shushan Purim Katan",
        description:
            "Like Purim Katan, but tied to the “walled city” schedule associated with Shushan Purim. It’s a minor observance that highlights how Purim dates differ by location and tradition.",
        aliases: [],
    },

    "Shabbat Shekalim": {
        title: "Shabbat Shekalim",
        description:
            "One of the four special Shabbatot before Pesach. The Torah reading recalls the half-shekel offering, traditionally collected in Adar for the Temple’s communal sacrifices.",
        aliases: [],
    },

    "Ta’anit Esther": {
        title: "Ta’anit Esther",
        description:
            "The Fast of Esther, observed the day before Purim (or moved earlier when needed). It recalls the communal fasting described in the Purim story and sets a reflective tone before the celebration.",
        aliases: [],
    },

    "Shabbat Zachor": {
        title: "Shabbat Zachor",
        description:
            "The Shabbat before Purim with a special Torah reading about remembering Amalek. It’s considered a major communal moment and is closely linked to the themes of Purim.",
        aliases: [],
    },

    Purim: {
        title: "Purim",
        description:
            "A joyful holiday celebrating rescue from Haman’s plot, told in the Megillah. Classic traditions include reading Esther, giving gifts of food (mishloach manot), charity (matanot la’evyonim), and a festive meal.",
        aliases: ["Erev Purim"],
    },

    "Shushan Purim": {
        title: "Shushan Purim",
        description:
            "Purim observed a day later in Jerusalem and other historically walled cities, reflecting the Megillah’s timeline. It’s a great reminder that Jewish time can depend on place as well as date.",
        aliases: [],
    },

    "Shabbat Parah": {
        title: "Shabbat Parah",
        description:
            "A special Shabbat with a Torah reading about the red heifer, symbolizing ritual purification. Traditionally it prepares the community spiritually for Pesach.",
        aliases: [],
    },

    "Shabbat HaChodesh": {
        title: "Shabbat HaChodesh",
        description:
            "The Shabbat before (or on) Rosh Chodesh Nisan, featuring a reading about the first mitzvah given to Israel: sanctifying the new month. It’s a clear “Pesach is coming” marker.",
        aliases: [],
    },

    "Rosh Chodesh Nisan": {
        title: "Rosh Chodesh Nisan",
        description:
            "Rosh Chodesh welcomes Nisan, the month of the Exodus and Pesach. Many communities emphasize renewal, beginnings, and the springtime shift in the Jewish calendar.",
        aliases: [],
    },

    "Yom HaAliyah": {
        title: "Yom HaAliyah",
        description:
            "A modern Israeli day recognizing aliyah—Jewish immigration to the Land of Israel—as a central part of Jewish history and identity. It highlights stories of return, refuge, and rebuilding.",
        aliases: [],
    },

    "Shabbat HaGadol": {
        title: "Shabbat HaGadol",
        description:
            "The “Great Shabbat” before Pesach. Many synagogues include an extended teaching or sermon focused on Pesach laws and themes like freedom and responsibility.",
        aliases: [],
    },

    "Ta’anit Bechorot": {
        title: "Ta’anit Bechorot",
        description:
            "The Fast of the Firstborn, observed before Pesach in remembrance of the firstborn spared in Egypt. Many firstborn participate in a siyum (completion of study) to end the fast.",
        aliases: [],
    },

    Pesach: {
        title: "Pesach",
        description:
            "Passover commemorates the Exodus from Egypt and the move from slavery to freedom. The centerpiece is the Seder, with matzah, story-telling, and symbols that turn memory into practice.",
        aliases: [
            "Erev Pesach",
            "Pesach I",
            "Pesach II",
            "Pesach III",
            "Pesach III (CH’’M)",
            "Pesach IV",
            "Pesach IV (CH’’M)",
            "Pesach V",
            "Pesach V (CH’’M)",
            "Pesach VI",
            "Pesach VI (CH’’M)",
            "Pesach VII",
            "Pesach VIII",
        ],
    },

    "Yom HaShoah": {
        title: "Yom HaShoah",
        description:
            "Holocaust Remembrance Day, dedicated to honoring the six million and preserving survivor testimony. Many communities hold memorial ceremonies, readings of names, and educational programs.",
        aliases: [],
    },

    "Rosh Chodesh Iyyar": {
        title: "Rosh Chodesh Iyyar",
        description:
            "Rosh Chodesh begins Iyyar, a month that bridges Pesach and Shavuot during the Omer count. It often carries themes of healing, growth, and steady spiritual progress.",
        aliases: [],
    },

    "Yom HaZikaron": {
        title: "Yom HaZikaron",
        description:
            "Israel’s memorial day for fallen soldiers and victims of terrorism. It’s observed with a solemn national tone, including moments of silence and ceremonies across the country.",
        aliases: [],
    },

    "Yom HaAtzma’ut": {
        title: "Yom HaAtzma’ut",
        description:
            "Israel’s Independence Day, marking the founding of the modern State of Israel in 1948. Many celebrate with music, gatherings, and a shift from remembrance to resilience and joy.",
        aliases: [],
    },

    "Pesach Sheni": {
        title: "Pesach Sheni",
        description:
            "The “Second Passover,” offering a make-up opportunity for those who couldn’t bring the Pesach offering at the proper time. It’s often viewed as a symbol of second chances.",
        aliases: [],
    },

    "Lag BaOmer": {
        title: "Lag BaOmer",
        description:
            "The 33rd day of the Omer count, a joyful break in a traditionally restrained period. Common customs include bonfires, weddings, haircuts, and celebrations linked to Rabbi Shimon bar Yochai.",
        aliases: [],
    },

    "Yom Yerushalayim": {
        title: "Yom Yerushalayim",
        description:
            "Jerusalem Day commemorates the reunification of Jerusalem in 1967. Observances range from prayer services and learning to city celebrations, depending on community.",
        aliases: [],
    },

    "Rosh Chodesh Sivan": {
        title: "Rosh Chodesh Sivan",
        description:
            "Rosh Chodesh opens Sivan, the month of Shavuot and receiving Torah. Many use it as a cue to prepare—through learning, intention, and community readiness.",
        aliases: [],
    },

    Shavuot: {
        title: "Shavuot",
        description:
            "Shavuot celebrates receiving the Torah at Sinai and also connects to the harvest season. Traditions include all-night learning (tikkun leil Shavuot), reading Ruth, and eating dairy foods.",
        aliases: ["Erev Shavuot", "Shavuot I", "Shavuot II"],
    },

    "Rosh Chodesh Tamuz": {
        title: "Rosh Chodesh Tamuz",
        description:
            "Rosh Chodesh begins Tammuz, a month that often ushers in the “Three Weeks,” a reflective period leading to Tish’a B’Av. Many communities shift tone toward introspection and repair.",
        aliases: [],
    },

    "Tzom Tammuz": {
        title: "Tzom Tammuz",
        description:
            "A fast day marking the breach of Jerusalem’s walls, beginning the Three Weeks leading to Tish’a B’Av. It’s a day for reflection on vulnerability, unity, and rebuilding.",
        aliases: [],
    },

    "Rosh Chodesh Av": {
        title: "Rosh Chodesh Av",
        description:
            "Rosh Chodesh begins Av, the month associated with mourning and Tish’a B’Av. Many communities gradually adopt more subdued customs as the month progresses.",
        aliases: [],
    },

    "Shabbat Chazon": {
        title: "Shabbat Chazon",
        description:
            "The Shabbat before Tish’a B’Av, named for Isaiah’s “Chazon” (vision) read as the Haftarah. It’s one of the most emotionally intense Shabbatot of the year.",
        aliases: [],
    },

    "Tish’a B’Av": {
        title: "Tish’a B’Av",
        description:
            "A major fast mourning the destruction of the First and Second Temples and other national tragedies. Customs include fasting, lamentations (Eicha), and a subdued, reflective daylong tone.",
        aliases: ["Erev Tish’a B’Av", "Tish’a B’Av (observed)"],
    },

    "Shabbat Nachamu": {
        title: "Shabbat Nachamu",
        description:
            "The Shabbat after Tish’a B’Av, named for the Haftarah’s opening word, “Nachamu” (“Comfort”). It begins seven weeks of hopeful readings leading into Rosh Hashanah.",
        aliases: [],
    },

    "Tu B’Av": {
        title: "Tu B’Av",
        description:
            "A minor holiday associated with love, reconciliation, and fresh starts. In modern Israel it’s sometimes treated as a Jewish “day of love,” and it historically marked joyful communal events.",
        aliases: [],
    },

    "Rosh Chodesh Elul": {
        title: "Rosh Chodesh Elul",
        description:
            "Rosh Chodesh begins Elul, the traditional runway into the High Holidays. Many communities add daily shofar blowing and extra reflection as a warm-up for repentance and renewal.",
        aliases: [],
    },

    "Rosh Hashana LaBehemot": {
        title: "Rosh Hashana LaBehemot",
        description:
            "A lesser-known “new year” once used to calculate tithes for animals. Today it’s mostly educational—an interesting window into how Jewish law organized agriculture and society.",
        aliases: [],
    },

    "Leil Selichot": {
        title: "Leil Selichot",
        description:
            "The night when many begin Selichot prayers before the High Holidays. It’s a powerful communal moment—late-night melodies, reflection, and a shift into the season of teshuvah.",
        aliases: [],
    },

    "Rosh Hashana": {
        title: "Rosh Hashana",
        description:
            "The Jewish New Year and start of the Days of Awe. It focuses on renewal, accountability, and hope—marked by shofar blasts, festive meals, and prayers about memory and change.",
        aliases: [
            "Erev Rosh Hashana",
            "Rosh Hashana 5785",
            "Rosh Hashana 5786",
            "Rosh Hashana 5787",
            "Rosh Hashana 5788",
            "Rosh Hashana 5789",
            "Rosh Hashana 5790",
            "Rosh Hashana 5791",
            "Rosh Hashana 5792",
            "Rosh Hashana 5793",
            "Rosh Hashana II",
        ],
    },

    "Shabbat Shuva": {
        title: "Shabbat Shuva",
        description:
            "The Shabbat between Rosh Hashanah and Yom Kippur, centered on repentance (“shuvah” = return). Many communities feature a major sermon and a heightened spiritual atmosphere.",
        aliases: [],
    },

    "Tzom Gedaliah": {
        title: "Tzom Gedaliah",
        description:
            "A fast day commemorating the assassination of Gedaliah, which ended Jewish autonomy after the First Temple’s destruction. It’s a reminder of how internal conflict can deepen national loss.",
        aliases: [],
    },

    "Yom Kippur": {
        title: "Yom Kippur",
        description:
            "The Day of Atonement, the most solemn day of the Jewish year. It centers on fasting, prayer, and reconciliation—aimed at clearing the slate through honesty, repair, and mercy.",
        aliases: ["Erev Yom Kippur"],
    },

    Sukkot: {
        title: "Sukkot",
        description:
            "A week of dwelling (or eating) in a sukkah to remember the wilderness journey and cultivate gratitude. It’s a holiday of joy, hospitality, and nature—often paired with lulav and etrog rituals.",
        aliases: [
            "Erev Sukkot",
            "Sukkot I",
            "Sukkot II",
            "Sukkot III",
            "Sukkot III (CH’’M)",
            "Sukkot IV",
            "Sukkot IV (CH’’M)",
            "Sukkot V",
            "Sukkot V (CH’’M)",
            "Sukkot VI",
            "Sukkot VI (CH’’M)",
            "Sukkot VII",
            "Sukkot VII (Hoshana Raba)",
        ],
    },

    "Shmini Atzeret": {
        title: "Shmini Atzeret",
        description:
            "A distinct holiday immediately after Sukkot, traditionally seen as a final “stay one more day” moment with God. In the Diaspora it’s separate from Simchat Torah; in Israel they’re combined.",
        aliases: [],
    },

    "Simchat Torah": {
        title: "Simchat Torah",
        description:
            "A celebration of completing and restarting the annual Torah reading cycle. Communities dance with Torah scrolls, sing, and lean into joyful, communal connection to learning.",
        aliases: [],
    },

    "Rosh Chodesh Cheshvan": {
        title: "Rosh Chodesh Cheshvan",
        description:
            "Rosh Chodesh begins Cheshvan, often called “Mar-Cheshvan” because it has no major festivals. After the High Holiday season, it’s a quieter month for routine, grounding, and steady growth.",
        aliases: [],
    },

    Sigd: {
        title: "Sigd",
        description:
            "An Ethiopian Jewish holiday of renewal and yearning for Jerusalem, observed 50 days after Yom Kippur. It features fasting, prayer, and celebration of tradition and community identity.",
        aliases: [],
    },

    "Rosh Chodesh Kislev": {
        title: "Rosh Chodesh Kislev",
        description:
            "Rosh Chodesh begins Kislev, the month that usually contains Chanukah. Many communities feel the seasonal shift here—more light-themes, anticipation, and winter rhythms.",
        aliases: [],
    },

    Chanukah: {
        title: "Chanukah",
        description:
            "The eight-day Festival of Lights, celebrating the rededication of the Temple and the Maccabean victory. Traditions include lighting the menorah, adding Hallel, and enjoying foods fried in oil.",
        aliases: [
            "Chanukah: 1 Candle",
            "Chanukah: 2 Candles",
            "Chanukah: 3 Candles",
            "Chanukah: 4 Candles",
            "Chanukah: 5 Candles",
            "Chanukah: 6 Candles",
            "Chanukah: 7 Candles",
            "Chanukah: 8 Candles",
            "Chanukah: 8th Day",
        ],
    },

    "Chag HaBanot": {
        title: "Chag HaBanot",
        description:
            "A North African Jewish celebration during Chanukah honoring daughters and women. It’s observed with sweets, blessings, and family gatherings, especially in Tunisian traditions.",
        aliases: [],
    },

    "Rosh Chodesh Tevet": {
        title: "Rosh Chodesh Tevet",
        description:
            "Rosh Chodesh begins Tevet, which often overlaps with the end of Chanukah. It’s a smaller marker in the calendar, but a nice moment to reset intentions for the month ahead.",
        aliases: [],
    },

    "Asara B’Tevet": {
        title: "Asara B’Tevet",
        description:
            "A fast day marking the start of the Babylonian siege of Jerusalem, which culminated in the Temple’s destruction. Many use it to reflect on resilience, vulnerability, and communal responsibility.",
        aliases: [],
    },

    "Purim Meshulash": {
        title: "Purim Meshulash",
        description:
            "“Triple Purim” happens in Jerusalem and walled cities when the Purim schedule collides with Shabbat. The mitzvot are spread across three days, creating a rare and fascinating calendar pattern.",
        aliases: [],
    },
};
