// Offline parsha blurbs + Torah ranges (2–3 sentences each).

export const HEBCAL_PARSHA_NAMES = {
    // Genesis
    Bereshit: "bereshit",
    Noach: "noach",
    "Lech-Lecha": "lech_lecha",
    Vayera: "vayera",
    "Chayei Sara": "chayei_sarah",
    Toldot: "toldot",
    Vayetzei: "vayetze",
    Vayishlach: "vayishlach",
    Vayeshev: "vayeshev",
    Miketz: "miketz",
    Vayigash: "vayigash",
    Vayechi: "vayechi",

    // Exodus
    Shemot: "shemot",
    Vaera: "vaera",
    Bo: "bo",
    Beshalach: "beshalach",
    Yitro: "yitro",
    Mishpatim: "mishpatim",
    Terumah: "terumah",
    Tetzaveh: "tetzaveh",
    "Ki Tisa": "ki_tisa",
    Vayakhel: "vayakhel",
    Pekudei: "pekudei",

    // Leviticus
    Vayikra: "vayikra",
    Tzav: "tzav",
    Shmini: "shemini",
    Tazria: "tazria",
    Metzora: "metzora",
    "Achrei Mot": "acharei_mot",
    Kedoshim: "kedoshim",
    Emor: "emor",
    Behar: "behar",
    Bechukotai: "bechukotai",

    // Numbers
    Bamidbar: "bamidbar",
    Nasso: "naso",
    "Beha'alotcha": "behaalotecha",
    "Sh'lach": "shelach_lecha",
    Korach: "korach",
    Chukat: "chukat",
    Balak: "balak",
    Pinchas: "pinchas",
    Matot: "matot",
    Masei: "masei",

    // Deuteronomy
    Devarim: "devarim",
    Vaetchanan: "vaetchanan",
    Eikev: "eikev",
    "Re'eh": "reeh",
    Shoftim: "shoftim",
    "Ki Teitzei": "ki_tetzei",
    "Ki Tavo": "ki_tavo",
    Nitzavim: "nitzavim",
    Vayeilech: "vayelech",
    "Ha'Azinu": "haazinu",
    "Vezot Haberakhah": "vezot_haberachah",

    // Double parshiot (combined readings)
    "Vayakhel-Pekudei": ["vayakhel", "pekudei"],
    "Tazria-Metzora": ["tazria", "metzora"],
    "Achrei Mot-Kedoshim": ["acharei_mot", "kedoshim"],
    "Behar-Bechukotai": ["behar", "bechukotai"],
    "Chukat-Balak": ["chukat", "balak"],
    "Matot-Masei": ["matot", "masei"],
    "Nitzavim-Vayeilech": ["nitzavim", "vayelech"],
};

export const PARSHIOT = {
    bereshit: {
        key: "bereshit",
        english: "Bereshit",
        hebrew: "בראשית",
        verses: "Genesis 1:1–6:8",
        blurb: "Creation unfolds in six days, culminating in Shabbat, and humanity is placed in Eden. After the first sin and exile, the world descends into violence, setting the stage for the flood.",
    },
    noach: {
        key: "noach",
        english: "Noach",
        hebrew: "נח",
        verses: "Genesis 6:9–11:32",
        blurb: "Noah builds the ark and survives the flood, after which God establishes a covenant symbolized by the rainbow. Humanity spreads out again, but the Tower of Babel ends in dispersion and many languages.",
    },
    lech_lecha: {
        key: "lech_lecha",
        english: "Lech-Lecha",
        hebrew: "לך לך",
        verses: "Genesis 12:1–17:27",
        blurb: "God calls Abram to leave his homeland and promises land and descendants. The parasha introduces the covenant, Abram and Sarai’s new names, and the sign of circumcision.",
    },
    vayera: {
        key: "vayera",
        english: "Vayera",
        hebrew: "וירא",
        verses: "Genesis 18:1–22:24",
        blurb: "Abraham welcomes guests and pleads for Sodom, while Sarah gives birth to Isaac. The portion culminates in the Akeidah, the binding of Isaac, a defining test of faith.",
    },
    chayei_sarah: {
        key: "chayei_sarah",
        english: "Chayei Sarah",
        hebrew: "חיי שרה",
        verses: "Genesis 23:1–25:18",
        blurb: "Sarah’s death leads Abraham to purchase the Cave of Machpelah as a burial place. Isaac marries Rebecca, and Abraham’s legacy continues through his family and promises.",
    },
    toldot: {
        key: "toldot",
        english: "Toldot",
        hebrew: "תולדות",
        verses: "Genesis 25:19–28:9",
        blurb: "Jacob and Esau struggle from birth, and family tensions grow around blessing and birthright. Jacob receives Isaac’s blessing and flees, while Esau’s resentment intensifies.",
    },
    vayetze: {
        key: "vayetze",
        english: "Vayetze",
        hebrew: "ויצא",
        verses: "Genesis 28:10–32:3",
        blurb: "Jacob dreams of a ladder reaching heaven and begins his long journey in exile. He builds a family with Leah and Rachel, works for Laban, and eventually returns toward home.",
    },
    vayishlach: {
        key: "vayishlach",
        english: "Vayishlach",
        hebrew: "וישלח",
        verses: "Genesis 32:4–36:43",
        blurb: "Jacob prepares to meet Esau, wrestles through the night, and emerges renamed Israel. The reunion is tense but transformative, and the family’s story moves forward through conflict and repair.",
    },
    vayeshev: {
        key: "vayeshev",
        english: "Vayeshev",
        hebrew: "וישב",
        verses: "Genesis 37:1–40:23",
        blurb: "Joseph’s dreams and favoritism spark betrayal, and he is sold into Egypt. In exile he faces false accusation, imprisonment, and the slow unfolding of providence.",
    },
    miketz: {
        key: "miketz",
        english: "Miketz",
        hebrew: "מקץ",
        verses: "Genesis 41:1–44:17",
        blurb: "Joseph interprets Pharaoh’s dreams and rises to power, preparing Egypt for famine. His brothers arrive for food, and Joseph tests them to see whether they have changed.",
    },
    vayigash: {
        key: "vayigash",
        english: "Vayigash",
        hebrew: "ויגש",
        verses: "Genesis 44:18–47:27",
        blurb: "Judah pleads for Benjamin, and Joseph reveals his identity to his brothers. The family reunites and settles in Egypt, where a new chapter begins.",
    },
    vayechi: {
        key: "vayechi",
        english: "Vayechi",
        hebrew: "ויחי",
        verses: "Genesis 47:28–50:26",
        blurb: "Jacob blesses his children and reflects on their futures, shaping the tribes of Israel. Joseph forgives his brothers and the Book of Genesis closes with faith in redemption.",
    },

    shemot: {
        key: "shemot",
        english: "Shemot",
        hebrew: "שמות",
        verses: "Exodus 1:1–6:1",
        blurb: "Israel is enslaved in Egypt, and Moses is born, rescued, and called at the burning bush. God commissions Moses to confront Pharaoh and begin the liberation.",
    },
    vaera: {
        key: "vaera",
        english: "Va’era",
        hebrew: "וארא",
        verses: "Exodus 6:2–9:35",
        blurb: "God reaffirms the covenant and promises redemption as Moses returns to Pharaoh. The first seven plagues strike Egypt, revealing divine power and Pharaoh’s stubbornness.",
    },
    bo: {
        key: "bo",
        english: "Bo",
        hebrew: "בא",
        verses: "Exodus 10:1–13:16",
        blurb: "The final plagues culminate in the Exodus and the first Passover. Israel leaves Egypt, and foundational rituals of memory and covenant are established.",
    },
    beshalach: {
        key: "beshalach",
        english: "Beshalach",
        hebrew: "בשלח",
        verses: "Exodus 13:17–17:16",
        blurb: "Israel crosses the Sea of Reeds and sings at the shore, then faces hunger and thirst in the wilderness. Manna appears, and the people begin learning trust and resilience.",
    },
    yitro: {
        key: "yitro",
        english: "Yitro",
        hebrew: "יתרו",
        verses: "Exodus 18:1–20:23",
        blurb: "Jethro advises Moses to share leadership, strengthening the community’s structure. At Sinai, Israel receives the Ten Commandments and encounters revelation.",
    },
    mishpatim: {
        key: "mishpatim",
        english: "Mishpatim",
        hebrew: "משפטים",
        verses: "Exodus 21:1–24:18",
        blurb: "A wide set of civil and ethical laws guides daily life and justice. The covenant is sealed with ceremony, and Moses ascends toward deeper revelation.",
    },
    terumah: {
        key: "terumah",
        english: "Terumah",
        hebrew: "תרומה",
        verses: "Exodus 25:1–27:19",
        blurb: "Israel is asked to contribute offerings to build the Mishkan, a dwelling for the Divine. Detailed instructions describe the ark, menorah, and sacred space.",
    },
    tetzaveh: {
        key: "tetzaveh",
        english: "Tetzaveh",
        hebrew: "תצוה",
        verses: "Exodus 27:20–30:10",
        blurb: "Priestly garments and consecration rituals are described, emphasizing service and holiness. The portion includes instructions for incense and ongoing light in the sanctuary.",
    },
    ki_tisa: {
        key: "ki_tisa",
        english: "Ki Tisa",
        hebrew: "כי תשא",
        verses: "Exodus 30:11–34:35",
        blurb: "The Golden Calf crisis shatters the covenant, and Moses intercedes after the tablets are broken. God renews the covenant and Moses returns radiant from encounter.",
    },
    vayakhel: {
        key: "vayakhel",
        english: "Vayakhel",
        hebrew: "ויקהל",
        verses: "Exodus 35:1–38:20",
        blurb: "Shabbat is emphasized as construction begins on the Mishkan. The community brings generous offerings and skilled artisans craft the sacred objects.",
    },
    pekudei: {
        key: "pekudei",
        english: "Pekudei",
        hebrew: "פקודי",
        verses: "Exodus 38:21–40:38",
        blurb: "An accounting of materials underscores integrity and communal responsibility. The Mishkan is completed, erected, and filled with the Divine Presence.",
    },

    vayikra: {
        key: "vayikra",
        english: "Vayikra",
        hebrew: "ויקרא",
        verses: "Leviticus 1:1–5:26",
        blurb: "The sacrificial system is introduced, outlining offerings that express gratitude, repair, and devotion. The focus is on drawing near through ritual and responsibility.",
    },
    tzav: {
        key: "tzav",
        english: "Tzav",
        hebrew: "צו",
        verses: "Leviticus 6:1–8:36",
        blurb: "Priestly duties for offerings are detailed, emphasizing continuity and care. Aaron and his sons begin their inauguration into sacred service.",
    },
    shemini: {
        key: "shemini",
        english: "Shemini",
        hebrew: "שמיני",
        verses: "Leviticus 9:1–11:47",
        blurb: "The Mishkan service begins, but tragedy strikes with Nadav and Avihu. The portion also teaches laws of kosher animals, linking holiness with daily choices.",
    },
    tazria: {
        key: "tazria",
        english: "Tazria",
        hebrew: "תזריע",
        verses: "Leviticus 12:1–13:59",
        blurb: "Laws of purity surrounding birth are introduced, followed by the diagnosis of tzara’at. The portion explores spiritual and communal dimensions of impurity and restoration.",
    },
    metzora: {
        key: "metzora",
        english: "Metzora",
        hebrew: "מצרע",
        verses: "Leviticus 14:1–15:33",
        blurb: "Rituals describe healing and reintegration for those afflicted with tzara’at. Additional laws address bodily flows, emphasizing sanctity in embodied life.",
    },
    acharei_mot: {
        key: "acharei_mot",
        english: "Acharei Mot",
        hebrew: "אחרי מות",
        verses: "Leviticus 16:1–18:30",
        blurb: "Yom Kippur service and atonement rituals are detailed, including the scapegoat. The portion also teaches boundaries that protect holiness and integrity.",
    },
    kedoshim: {
        key: "kedoshim",
        english: "Kedoshim",
        hebrew: "קדשים",
        verses: "Leviticus 19:1–20:27",
        blurb: "The call to be holy is expressed through ethics: justice, honesty, compassion, and restraint. “Love your neighbor as yourself” anchors a life of sanctity.",
    },
    emor: {
        key: "emor",
        english: "Emor",
        hebrew: "אמור",
        verses: "Leviticus 21:1–24:23",
        blurb: "Priestly standards and sacred times are described, including Shabbat and the festivals. The portion highlights sanctity in leadership, calendar, and community life.",
    },
    behar: {
        key: "behar",
        english: "Behar",
        hebrew: "בהר",
        verses: "Leviticus 25:1–26:2",
        blurb: "Shmita and Jubilee laws reset the economy through rest, release, and return. The portion emphasizes that land and wealth are ultimately held in trust.",
    },
    bechukotai: {
        key: "bechukotai",
        english: "Bechukotai",
        hebrew: "בחקתי",
        verses: "Leviticus 26:3–27:34",
        blurb: "Blessings and warnings describe the stakes of covenantal life and communal responsibility. The book closes with vows and dedications, tying devotion to action.",
    },

    bamidbar: {
        key: "bamidbar",
        english: "Bamidbar",
        hebrew: "במדבר",
        verses: "Numbers 1:1–4:20",
        blurb: "Israel is counted and arranged by tribes around the Mishkan, forming a sacred camp. The Levites receive specific roles, organizing service and movement.",
    },
    naso: {
        key: "naso",
        english: "Naso",
        hebrew: "נשא",
        verses: "Numbers 4:21–7:89",
        blurb: "Laws cover purity, restitution, and the Nazirite’s vow, alongside the priestly blessing. The portion includes offerings brought by tribal leaders to dedicate the altar.",
    },
    behaalotecha: {
        key: "behaalotecha",
        english: "Beha’alotecha",
        hebrew: "בהעלתך",
        verses: "Numbers 8:1–12:16",
        blurb: "The menorah is lit and Israel journeys onward, but complaints and strain test the community. Moses shares leadership, and Miriam faces consequences for speaking against him.",
    },
    shelach_lecha: {
        key: "shelach_lecha",
        english: "Shelach-Lecha",
        hebrew: "שלח לך",
        verses: "Numbers 13:1–15:41",
        blurb: "Spies scout the land, but fear and distrust lead to a national crisis and delayed entry. The portion includes mitzvot like challah and tzitzit, reinforcing identity and purpose.",
    },
    korach: {
        key: "korach",
        english: "Korach",
        hebrew: "קרח",
        verses: "Numbers 16:1–18:32",
        blurb: "A rebellion challenges Moses and Aaron, raising questions of authority and holiness. The conflict ends decisively, and priestly responsibilities are clarified.",
    },
    chukat: {
        key: "chukat",
        english: "Chukat",
        hebrew: "חקת",
        verses: "Numbers 19:1–22:1",
        blurb: "The red heifer rite illustrates the mysteries of purity and spiritual repair. The journey continues with loss, conflict, and breakthroughs on the way toward the land.",
    },
    balak: {
        key: "balak",
        english: "Balak",
        hebrew: "בלק",
        verses: "Numbers 22:2–25:9",
        blurb: "Balak hires Balaam to curse Israel, but blessings emerge instead, including a sweeping vision of Israel’s destiny. The portion ends with moral failure and its consequences.",
    },
    pinchas: {
        key: "pinchas",
        english: "Pinchas",
        hebrew: "פינחס",
        verses: "Numbers 25:10–30:1",
        blurb: "Pinchas is rewarded for zeal, and a new census prepares the next generation to enter the land. The portion includes inheritance laws and the cycle of communal offerings.",
    },
    matot: {
        key: "matot",
        english: "Matot",
        hebrew: "מטות",
        verses: "Numbers 30:2–32:42",
        blurb: "Vows and their binding power are discussed, highlighting responsibility in speech. Israel battles Midian, and tribes negotiate settlement east of the Jordan.",
    },
    masei: {
        key: "masei",
        english: "Masei",
        hebrew: "מסעי",
        verses: "Numbers 33:1–36:13",
        blurb: "Israel’s journeys are reviewed, mapping a path from slavery to the border of promise. Boundaries of the land and cities of refuge establish justice and order.",
    },

    devarim: {
        key: "devarim",
        english: "Devarim",
        hebrew: "דברים",
        verses: "Deuteronomy 1:1–3:22",
        blurb: "Moses begins his final address, reviewing the wilderness journey and earlier failures. The portion calls Israel to learn from the past as they prepare to enter the land.",
    },
    vaetchanan: {
        key: "vaetchanan",
        english: "Va’etchanan",
        hebrew: "ואתחנן",
        verses: "Deuteronomy 3:23–7:11",
        blurb: "Moses recounts the giving of the Ten Commandments and teaches the Shema, Israel’s core declaration of faith. Love, memory, and covenantal loyalty take center stage.",
    },
    eikev: {
        key: "eikev",
        english: "Eikev",
        hebrew: "עקב",
        verses: "Deuteronomy 7:12–11:25",
        blurb: "Moses emphasizes gratitude and humility, warning against forgetting God amid prosperity. The portion links blessing to responsibility and mindful living in the land.",
    },
    reeh: {
        key: "reeh",
        english: "Re’eh",
        hebrew: "ראה",
        verses: "Deuteronomy 11:26–16:17",
        blurb: "Israel is presented with a choice of blessing and curse, calling for loyalty and ethical worship. Laws cover a central sanctuary, care for the vulnerable, and the festival calendar.",
    },
    shoftim: {
        key: "shoftim",
        english: "Shoftim",
        hebrew: "שופטים",
        verses: "Deuteronomy 16:18–21:9",
        blurb: "Justice systems are established: judges, leaders, and safeguards against corruption. The portion addresses warfare ethics and communal responsibility for unsolved harm.",
    },
    ki_tetzei: {
        key: "ki_tetzei",
        english: "Ki Teitzei",
        hebrew: "כי תצא",
        verses: "Deuteronomy 21:10–25:19",
        blurb: "A dense collection of laws shapes everyday moral life, from family and property to fairness and compassion. The portion concludes with the charge to remember Amalek’s attack.",
    },
    ki_tavo: {
        key: "ki_tavo",
        english: "Ki Tavo",
        hebrew: "כי תבוא",
        verses: "Deuteronomy 26:1–29:8",
        blurb: "First fruits are brought with a declaration of gratitude and history. Blessings and warnings follow, calling Israel to covenantal faithfulness and communal accountability.",
    },
    nitzavim: {
        key: "nitzavim",
        english: "Nitzavim",
        hebrew: "נצבים",
        verses: "Deuteronomy 29:9–30:20",
        blurb: "All of Israel stands together to reaffirm the covenant. Moses teaches that return is always possible and urges the people to “choose life.”",
    },
    vayelech: {
        key: "vayelech",
        english: "Vayelech",
        hebrew: "וילך",
        verses: "Deuteronomy 31:1–30",
        blurb: "Moses prepares for his departure and strengthens Joshua and the people. The Torah is entrusted to the community with a rhythm of public reading and renewal.",
    },
    haazinu: {
        key: "haazinu",
        english: "Ha’Azinu",
        hebrew: "האזינו",
        verses: "Deuteronomy 32:1–52",
        blurb: "Moses delivers a poetic song that reviews Israel’s story, failures, and hope for restoration. It frames covenantal history as a call to memory, humility, and return.",
    },
    vezot_haberachah: {
        key: "vezot_haberachah",
        english: "Vezot Haberachah",
        hebrew: "וזאת הברכה",
        verses: "Deuteronomy 33:1–34:12",
        blurb: "Moses blesses the tribes one final time and ascends to view the land. The Torah ends with Moses’ death and the enduring legacy of his leadership and teaching.",
    },
};

/**
 * Look up parsha data by name (handles "Parashat X" format from Hebcal).
 * Returns null if not found.
 */
export function getParshaDataByName(hebcalName) {
    if (!hebcalName) return null;

    // Strip "Parashat " or "Parasha " prefix
    const cleanName = hebcalName
        .replace(/^Parashat\s+/i, "")
        .replace(/^Parasha\s+/i, "")
        .trim();

    const key = HEBCAL_PARSHA_NAMES[cleanName];
    if (!key) {
        console.log("Could not find key for:", cleanName);
        return null;
    }

    // Handle double parshiot
    if (Array.isArray(key)) {
        return key.map((k) => PARSHIOT[k]).filter(Boolean);
    }

    // Single parsha
    const parsha = PARSHIOT[key];
    return parsha ? [parsha] : null;
}
