cat > (src / archive / tip - jar / Settings - TipJar - Section.jsx) << "EOF";
/**
 * ARCHIVED TIP JAR CODE FROM SETTINGS SCREEN
 *
 * This file contains the complete tip jar implementation that was
 * removed from Settings.jsx on January 28, 2026.
 *
 * To restore:
 * 1. Add imports back to Settings.jsx
 * 2. Add state variables back
 * 3. Copy the Support card JSX section back
 */

// ============================================================
// IMPORTS (add these to Settings.jsx)
// ============================================================
import React, { useState, useCallback } from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTipsIap } from "../services/iap/useTipsIap";
import TipSelector from "../components/settings/TipSelector";

// ============================================================
// STATE & HOOKS (add these inside Settings component)
// ============================================================
const [tipAmount, setTipAmount] = useState(5);
const { loading: iapLoading, tip } = useTipsIap();
const onTipPress = useCallback(() => tip(tipAmount), [tip, tipAmount]);

// ============================================================
// JSX (add this in the ScrollView after Shabbat Options card)
// ============================================================
<SettingsCard title="Support">
    <Text style={ui.paragraph}>
        If you enjoy using this app, please consider leaving a tip!
    </Text>

    <TipSelector selectedAmount={tipAmount} onAmountChange={setTipAmount} />

    <TouchableOpacity
        style={[
            ui.button,
            ui.buttonOutline,
            { borderColor: "#82CBFF" },
            { marginBottom: 8 },
        ]}
        onPress={onTipPress}
        activeOpacity={0.85}
        disabled={iapLoading}
    >
        {iapLoading ? (
            <ActivityIndicator />
        ) : (
            <Text style={[ui.buttonText, { color: "#82CBFF" }]}>
                Tip ${tipAmount}
            </Text>
        )}
    </TouchableOpacity>
</SettingsCard>;

// ============================================================
// DEPENDENCIES
// ============================================================
/*
npm install react-native-iap

Required files (in src/archive/tip-jar/):
- components/TipSelector.jsx
- services/useTipsIap.js
- services/tips.js
*/

// ============================================================
// APP STORE CONNECT SETUP
// ============================================================
/*
Create consumable IAP products:
- tip_1 ($1)
- tip_2 ($2)
- tip_5 ($5)
- tip_10 ($10)
- tip_18 ($18)
*/
EOF;
