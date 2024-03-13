import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import Shabbat from './Shabbat';
import Holidays from './Holidays';

const Tab = createMaterialTopTabNavigator();

export default function TabBarTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarIndicatorStyle: styles.tabBarIndicator,
                tabBarActiveTintColor: '#82CBFF',
                tabBarInactiveTintColor: 'white',
                tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', textTransform: 'none' },
            }}
        >
            <Tab.Screen name="Shabbat" component={Shabbat} />
            <Tab.Screen name="Holidays" component={Holidays} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'black',
    },
    tabBarIndicator: {
        backgroundColor: '#82CBFF',
        height: 3,
    },
});
