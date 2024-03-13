import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Shabbat from './Shabbat';
import Holidays from './Holidays';
import TabBar from './TabBar';

const Tab = createMaterialTopTabNavigator();

export default function TabBarTabs() {
    return (
        <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
            <Tab.Screen name="Shabbat" component={Shabbat} />
            <Tab.Screen name="Holidays" component={Holidays} />
        </Tab.Navigator>
    );
}
