# Tip Jar Feature (Archived)

Temporarily disabled tip jar / in-app purchase functionality.

## Files
- `components/TipSelector.js` - Tip amount selector UI
- `services/useTipsIap.js` - IAP hook using react-native-iap

## Dependencies
- `react-native-iap` - Keep in package.json for future use

## To Re-enable
1. Move files back to their original locations
2. Uncomment tip jar section in `Settings.js`
3. Set up IAP products in App Store Connect
4. Test in TestFlight

## Original Location in Settings.js
The "Support" card section (around line 95-130)
