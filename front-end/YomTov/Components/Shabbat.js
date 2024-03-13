import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function Shabbat() {

    return (
        <SafeAreaView style={styles.container}>
            <Text>Shabbat</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        backgroundColor: "black",
    },
});
