// Offline parsha blurbs + Torah ranges (2–3 sentences each).

export const HEBCAL_PARSHA_NAMES = {
    // Genesis
    Bereshit: "bereshit",
    Noach: "noach",
    "Lech-Lecha": "lech_lecha",
    Vayera: "vayera",
    "Chayei Sara": "chayei_sara",
    Toldot: "toldot",
    Vayetzei: "vayetzei",
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
    Shmini: "shmini",
    Tazria: "tazria",
    Metzora: "metzora",
    "Achrei Mot": "achrei_mot",
    Kedoshim: "kedoshim",
    Emor: "emor",
    Behar: "behar",
    Bechukotai: "bechukotai",

    // Numbers
    Bamidbar: "bamidbar",
    Nasso: "nasso",
    "Beha'alotcha": "behaalotcha",
    "Sh'lach": "shlach",
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
    "Ki Teitzei": "ki_teitzei",
    "Ki Tavo": "ki_tavo",
    Nitzavim: "nitzavim",
    Vayeilech: "vayeilech",
    "Ha'Azinu": "haazinu",
    "Vezot Haberakhah": "vezot_haberachah",

    // Double parshiot (combined readings)
    "Vayakhel-Pekudei": ["vayakhel", "pekudei"],
    "Tazria-Metzora": ["tazria", "metzora"],
    "Achrei Mot-Kedoshim": ["achrei_mot", "kedoshim"],
    "Behar-Bechukotai": ["behar", "bechukotai"],
    "Chukat-Balak": ["chukat", "balak"],
    "Matot-Masei": ["matot", "masei"],
    "Nitzavim-Vayeilech": ["nitzavim", "vayeilech"],
};

export const PARSHIOT = {
    bereshit: {
        key: "bereshit",
        english: "Bereshit",
        hebrew: "בראשית",
        verses: "Genesis 1:1–6:8",
        blurb: "The Torah begins with creation: the world is formed in six days, and humanity is placed in the Garden of Eden. After the first sin leads to exile, violence spreads across the earth, setting the stage for the flood.",
    },
    noach: {
        key: "noach",
        english: "Noach",
        hebrew: "נח",
        verses: "Genesis 6:9–11:32",
        blurb: "Noah builds an ark and survives the flood that destroys the corrupt world. God makes a covenant with humanity symbolized by the rainbow, but the Tower of Babel leads to the scattering of nations and languages.",
    },
    lech_lecha: {
        key: "lech_lecha",
        english: "Lech-Lecha",
        hebrew: "לך לך",
        verses: "Genesis 12:1–17:27",
        blurb: "God calls Abram to leave his homeland for a promised land and descendants. The covenant is established, Abram and Sarai receive new names, and circumcision is introduced as a sign of the covenant.",
    },
    vayera: {
        key: "vayera",
        english: "Vayera",
        hebrew: "וירא",
        verses: "Genesis 18:1–22:24",
        blurb: "Abraham welcomes three visitors and pleads with God to spare Sodom, while Sarah miraculously gives birth to Isaac. The portion reaches its climax with the Binding of Isaac, a profound test of Abraham's faith.",
    },
    chayei_sara: {
        key: "chayei_sara",
        english: "Chayei Sara",
        hebrew: "חיי שרה",
        verses: "Genesis 23:1–25:18",
        blurb: "After Sarah's death, Abraham purchases the Cave of Machpelah as the family's burial place. Abraham's servant finds Rebecca as a wife for Isaac, continuing the covenant into the next generation.",
    },
    toldot: {
        key: "toldot",
        english: "Toldot",
        hebrew: "תולדות",
        verses: "Genesis 25:19–28:9",
        blurb: "Twin brothers Jacob and Esau struggle from birth, competing for birthright and blessing. Jacob deceives Isaac to receive the blessing meant for Esau, forcing him to flee from his brother's anger.",
    },
    vayetzei: {
        key: "vayetzei",
        english: "Vayetzei",
        hebrew: "ויצא",
        verses: "Genesis 28:10–32:3",
        blurb: "Jacob dreams of a ladder reaching to heaven and continues his journey in exile to Laban's house. He marries Leah and Rachel, works for many years, and eventually departs with his growing family to return home.",
    },
    vayishlach: {
        key: "vayishlach",
        english: "Vayishlach",
        hebrew: "וישלח",
        verses: "Genesis 32:4–36:43",
        blurb: "Jacob prepares anxiously to meet Esau and wrestles with a mysterious figure through the night, emerging with a new name: Israel. The brothers reunite peacefully, and Jacob's family continues despite tragedy and conflict.",
    },
    vayeshev: {
        key: "vayeshev",
        english: "Vayeshev",
        hebrew: "וישב",
        verses: "Genesis 37:1–40:23",
        blurb: "Joseph's dreams and his father's favoritism lead his brothers to sell him into slavery in Egypt. In Egypt, Joseph faces false accusation and imprisonment, where he begins interpreting dreams.",
    },
    miketz: {
        key: "miketz",
        english: "Miketz",
        hebrew: "מקץ",
        verses: "Genesis 41:1–44:17",
        blurb: "Joseph interprets Pharaoh's dreams about seven years of plenty followed by famine, and rises to become second in command of Egypt. When his brothers arrive seeking food, Joseph tests them without revealing his identity.",
    },
    vayigash: {
        key: "vayigash",
        english: "Vayigash",
        hebrew: "ויגש",
        verses: "Genesis 44:18–47:27",
        blurb: "Judah pleads passionately for Benjamin's release, and Joseph finally reveals himself to his brothers. The family is reunited and settles in Egypt, where Jacob blesses Pharaoh and the family begins a new chapter.",
    },
    vayechi: {
        key: "vayechi",
        english: "Vayechi",
        hebrew: "ויחי",
        verses: "Genesis 47:28–50:26",
        blurb: "Jacob blesses each of his sons, shaping the destiny of the twelve tribes of Israel. Joseph reassures his brothers of forgiveness, and the Book of Genesis closes with faith in God's promise of return to the land.",
    },

    shemot: {
        key: "shemot",
        english: "Shemot",
        hebrew: "שמות",
        verses: "Exodus 1:1–6:1",
        blurb: "The Israelites multiply in Egypt and are enslaved by a fearful Pharaoh. Moses is born, saved from death, and called by God at the burning bush to lead the people to freedom.",
    },
    vaera: {
        key: "vaera",
        english: "Vaera",
        hebrew: "וארא",
        verses: "Exodus 6:2–9:35",
        blurb: "God reveals the divine name and promises to redeem Israel from slavery. Moses and Aaron return to Pharaoh, and the first seven plagues strike Egypt, demonstrating God's power while Pharaoh's heart remains hardened.",
    },
    bo: {
        key: "bo",
        english: "Bo",
        hebrew: "בא",
        verses: "Exodus 10:1–13:16",
        blurb: "The final three plagues culminate in the death of Egypt's firstborn and Pharaoh's release of the Israelites. The first Passover is observed, establishing rituals of remembrance that will endure for generations.",
    },
    beshalach: {
        key: "beshalach",
        english: "Beshalach",
        hebrew: "בשלח",
        verses: "Exodus 13:17–17:16",
        blurb: "Israel crosses the Sea of Reeds as the waters part, and Moses and Miriam lead the people in song. In the wilderness, the people receive manna from heaven and learn to trust God day by day.",
    },
    yitro: {
        key: "yitro",
        english: "Yitro",
        hebrew: "יתרו",
        verses: "Exodus 18:1–20:23",
        blurb: "Moses' father-in-law Jethro advises him to establish a system of judges to help lead the people. At Mount Sinai, God speaks the Ten Commandments directly to all of Israel in a moment of revelation and awe.",
    },
    mishpatim: {
        key: "mishpatim",
        english: "Mishpatim",
        hebrew: "משפטים",
        verses: "Exodus 21:1–24:18",
        blurb: "A collection of civil and ethical laws governs daily life, covering topics from slavery to property to justice. The covenant is formalized in a ceremony, and Moses ascends the mountain to receive further instruction.",
    },
    terumah: {
        key: "terumah",
        english: "Terumah",
        hebrew: "תרומה",
        verses: "Exodus 25:1–27:19",
        blurb: "God commands the Israelites to bring offerings to build the Mishkan, a portable sanctuary for the Divine Presence. Detailed instructions describe the ark, menorah, altar, and other sacred furnishings.",
    },
    tetzaveh: {
        key: "tetzaveh",
        english: "Tetzaveh",
        hebrew: "תצוה",
        verses: "Exodus 27:20–30:10",
        blurb: "The priestly garments are described in detail, including the ephod, breastplate, and headpiece. Aaron and his sons are consecrated for service, and the eternal light is commanded to burn continually in the sanctuary.",
    },
    ki_tisa: {
        key: "ki_tisa",
        english: "Ki Tisa",
        hebrew: "כי תשא",
        verses: "Exodus 30:11–34:35",
        blurb: "While Moses is on the mountain, the people build a Golden Calf, breaking the covenant. Moses intercedes for the people, the tablets are shattered and remade, and God renews the covenant with Israel.",
    },
    vayakhel: {
        key: "vayakhel",
        english: "Vayakhel",
        hebrew: "ויקהל",
        verses: "Exodus 35:1–38:20",
        blurb: "Moses gathers the community and reminds them of Shabbat before beginning work on the Mishkan. The people bring abundant offerings, and skilled artisans begin crafting the sacred objects.",
    },
    pekudei: {
        key: "pekudei",
        english: "Pekudei",
        hebrew: "פקודי",
        verses: "Exodus 38:21–40:38",
        blurb: "A detailed accounting is given of all materials used in building the Mishkan. The Mishkan is completed, erected, and filled with God's glory, marking the culmination of the Exodus journey.",
    },

    vayikra: {
        key: "vayikra",
        english: "Vayikra",
        hebrew: "ויקרא",
        verses: "Leviticus 1:1–5:26",
        blurb: "God calls to Moses from the Mishkan and describes the system of sacrificial offerings. Different types of offerings express gratitude, seek atonement, and foster a relationship between the people and God.",
    },
    tzav: {
        key: "tzav",
        english: "Tzav",
        hebrew: "צו",
        verses: "Leviticus 6:1–8:36",
        blurb: "Detailed instructions are given to the priests about their duties in handling the various offerings. Aaron and his sons undergo a seven-day consecration ceremony to begin their service in the Mishkan.",
    },
    shmini: {
        key: "shmini",
        english: "Shmini",
        hebrew: "שמיני",
        verses: "Leviticus 9:1–11:47",
        blurb: "On the eighth day, Aaron and his sons begin their priestly service, but tragedy strikes when Nadav and Avihu die after offering unauthorized fire. The portion also introduces the laws of kosher animals, linking holiness to daily choices.",
    },
    tazria: {
        key: "tazria",
        english: "Tazria",
        hebrew: "תזריע",
        verses: "Leviticus 12:1–13:59",
        blurb: "Laws of ritual purity following childbirth are given, followed by detailed procedures for diagnosing tzara'at, a skin affliction. The priest's role is to examine and determine purity status, protecting the community's holiness.",
    },
    metzora: {
        key: "metzora",
        english: "Metzora",
        hebrew: "מצרע",
        verses: "Leviticus 14:1–15:33",
        blurb: "The purification process for someone healed of tzara'at involves ritual washing, offerings, and gradual reintegration into the community. Additional laws address bodily discharges and maintaining purity in the camp.",
    },
    achrei_mot: {
        key: "achrei_mot",
        english: "Achrei Mot",
        hebrew: "אחרי מות",
        verses: "Leviticus 16:1–18:30",
        blurb: "After the deaths of Aaron's sons, God establishes the Yom Kippur service, including the scapegoat ritual that carries away the people's sins. Laws of sexual ethics follow, establishing boundaries that protect holiness and family integrity.",
    },
    kedoshim: {
        key: "kedoshim",
        english: "Kedoshim",
        hebrew: "קדשים",
        verses: "Leviticus 19:1–20:27",
        blurb: "God commands Israel to be holy, expressed through ethical behavior: honoring parents, caring for the poor, honest business practices, and justice. The commandment to love your neighbor as yourself stands at the center of this holiness code.",
    },
    emor: {
        key: "emor",
        english: "Emor",
        hebrew: "אמור",
        verses: "Leviticus 21:1–24:23",
        blurb: "Special standards are set for the priests, who must maintain a higher level of holiness in their personal lives. The sacred calendar is outlined, including Shabbat and the festivals, structuring time around holiness and community.",
    },
    behar: {
        key: "behar",
        english: "Behar",
        hebrew: "בהר",
        verses: "Leviticus 25:1–26:2",
        blurb: "The Sabbatical and Jubilee years are introduced, requiring the land to rest every seven years and property to be returned every fifty years. These laws emphasize that the land ultimately belongs to God, held in trust by the people.",
    },
    bechukotai: {
        key: "bechukotai",
        english: "Bechukotai",
        hebrew: "בחקתי",
        verses: "Leviticus 26:3–27:34",
        blurb: "God presents blessings for following the covenant and severe consequences for abandoning it. The book of Leviticus concludes with laws about vows and dedications, linking devotion to concrete action.",
    },

    bamidbar: {
        key: "bamidbar",
        english: "Bamidbar",
        hebrew: "במדבר",
        verses: "Numbers 1:1–4:20",
        blurb: "Israel is counted by tribe and family, organizing the camp around the Mishkan in the wilderness. The Levites are assigned specific duties in caring for and transporting the sacred objects.",
    },
    nasso: {
        key: "nasso",
        english: "Nasso",
        hebrew: "נשא",
        verses: "Numbers 4:21–7:89",
        blurb: "The census continues with the Levite clans, and laws are given for the Nazirite vow and the priestly blessing. The tribal leaders bring offerings to dedicate the altar over twelve days.",
    },
    behaalotcha: {
        key: "behaalotcha",
        english: "Beha'alotcha",
        hebrew: "בהעלתך",
        verses: "Numbers 8:1–12:16",
        blurb: "Aaron lights the menorah, and the Israelites begin their journey through the wilderness guided by the cloud. Complaints arise about the manna, and Miriam and Aaron speak against Moses, resulting in Miriam's affliction with tzara'at.",
    },
    shlach: {
        key: "shlach",
        english: "Sh'lach",
        hebrew: "שלח לך",
        verses: "Numbers 13:1–15:41",
        blurb: "Moses sends twelve spies to scout the Promised Land, but ten return with a fearful report that demoralizes the people. As punishment, that generation is condemned to wander forty years in the wilderness, and laws of tzitzit are given as a reminder of God's commandments.",
    },
    korach: {
        key: "korach",
        english: "Korach",
        hebrew: "קרח",
        verses: "Numbers 16:1–18:32",
        blurb: "Korach leads a rebellion against Moses and Aaron, challenging their authority and the priestly system. The earth swallows the rebels, and Aaron's staff miraculously blossoms, confirming the divine choice of leadership.",
    },
    chukat: {
        key: "chukat",
        english: "Chukat",
        hebrew: "חקת",
        verses: "Numbers 19:1–22:1",
        blurb: "The mysterious ritual of the red heifer provides purification from contact with death. Miriam and Aaron die, Moses strikes the rock instead of speaking to it, and Israel defeats their enemies as they approach the Promised Land.",
    },
    balak: {
        key: "balak",
        english: "Balak",
        hebrew: "בלק",
        verses: "Numbers 22:2–25:9",
        blurb: "King Balak hires the prophet Balaam to curse Israel, but God turns every curse into a blessing. The portion ends with Israel's moral failure at Peor, resulting in a plague that is stopped by Pinchas's zealous action.",
    },
    pinchas: {
        key: "pinchas",
        english: "Pinchas",
        hebrew: "פינחס",
        verses: "Numbers 25:10–30:1",
        blurb: "Pinchas is rewarded with a covenant of peace for his zealous defense of God's honor. A new census prepares the next generation to enter the land, and the daughters of Zelophehad successfully petition for inheritance rights.",
    },
    matot: {
        key: "matot",
        english: "Matot",
        hebrew: "מטות",
        verses: "Numbers 30:2–32:42",
        blurb: "Laws governing vows emphasize the binding power of speech and personal responsibility. Israel wages war against Midian, and the tribes of Reuben and Gad negotiate to settle east of the Jordan River.",
    },
    masei: {
        key: "masei",
        english: "Masei",
        hebrew: "מסעי",
        verses: "Numbers 33:1–36:13",
        blurb: "The forty-two journeys of Israel through the wilderness are reviewed, mapping their path from Egypt to the border of Canaan. The boundaries of the land are defined, and cities of refuge are established for those who accidentally kill.",
    },

    devarim: {
        key: "devarim",
        english: "Devarim",
        hebrew: "דברים",
        verses: "Deuteronomy 1:1–3:22",
        blurb: "Moses begins his final speeches to Israel, reviewing their journey from Sinai and recalling the failed spy mission. He reminds the people of God's faithfulness and urges them to learn from past mistakes as they prepare to enter the land.",
    },
    vaetchanan: {
        key: "vaetchanan",
        english: "Vaetchanan",
        hebrew: "ואתחנן",
        verses: "Deuteronomy 3:23–7:11",
        blurb: "Moses pleads to enter the land but is denied, and instead charges Joshua to lead the people. He repeats the Ten Commandments and teaches the Shema, declaring God's unity and commanding love, memory, and faithful teaching to future generations.",
    },
    eikev: {
        key: "eikev",
        english: "Eikev",
        hebrew: "עקב",
        verses: "Deuteronomy 7:12–11:25",
        blurb: "Moses warns against forgetting God when prosperity comes in the land. He reminds Israel of their rebellions in the wilderness and emphasizes that obedience flows from gratitude, not from their own righteousness.",
    },
    reeh: {
        key: "reeh",
        english: "Re'eh",
        hebrew: "ראה",
        verses: "Deuteronomy 11:26–16:17",
        blurb: "Moses presents a choice between blessing and curse, tied to obedience and faithfulness. Laws follow concerning centralized worship, care for the poor, kosher food, and the observance of the three pilgrimage festivals.",
    },
    shoftim: {
        key: "shoftim",
        english: "Shoftim",
        hebrew: "שופטים",
        verses: "Deuteronomy 16:18–21:9",
        blurb: "A system of judges and courts is established to pursue justice faithfully. Laws address prophecy, warfare, and the responsibilities of kings, and the portion ends with procedures for unsolved murders to maintain communal accountability.",
    },
    ki_teitzei: {
        key: "ki_teitzei",
        english: "Ki Teitzei",
        hebrew: "כי תצא",
        verses: "Deuteronomy 21:10–25:19",
        blurb: "More laws than any other portion cover family life, property, business ethics, and compassion for the vulnerable. The portion concludes with the command to remember Amalek's unprovoked attack on the weak and weary.",
    },
    ki_tavo: {
        key: "ki_tavo",
        english: "Ki Tavo",
        hebrew: "כי תבוא",
        verses: "Deuteronomy 26:1–29:8",
        blurb: "The ritual of bringing first fruits includes a recitation of Israel's history from slavery to freedom. Moses then delivers blessings for obedience and curses for disobedience, emphasizing the consequences of covenantal choice.",
    },
    nitzavim: {
        key: "nitzavim",
        english: "Nitzavim",
        hebrew: "נצבים",
        verses: "Deuteronomy 29:9–30:20",
        blurb: "All of Israel stands together to renew the covenant before entering the land. Moses assures the people that repentance and return to God are always possible, and he urges them to choose life and blessing.",
    },
    vayeilech: {
        key: "vayeilech",
        english: "Vayeilech",
        hebrew: "וילך",
        verses: "Deuteronomy 31:1–30",
        blurb: "Moses announces that he will not cross into the land and commissions Joshua as his successor. The Torah is written down and entrusted to the Levites, with instructions for public reading every seven years.",
    },
    haazinu: {
        key: "haazinu",
        english: "Ha'Azinu",
        hebrew: "האזינו",
        verses: "Deuteronomy 32:1–52",
        blurb: "Moses delivers a poetic song that recounts Israel's history, God's faithfulness, and the people's repeated failures. The song serves as a witness and warning, calling future generations to remember and return.",
    },
    vezot_haberachah: {
        key: "vezot_haberachah",
        english: "Vezot Haberachah",
        hebrew: "וזאת הברכה",
        verses: "Deuteronomy 33:1–34:12",
        blurb: "Moses blesses each tribe individually, expressing hope for their future in the land. He then ascends Mount Nebo, views the Promised Land, and dies, leaving a legacy of unparalleled prophecy and leadership.",
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
        if (__DEV__) {
            console.log("Could not find key for:", cleanName);
        }
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
