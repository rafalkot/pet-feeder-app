import React from 'react';
import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator} from 'react-navigation';

import LoginScreen from "../screens/LoginScreen";
import NewPetScreen from "../screens/NewPetScreen";
import PetsScreen from "../screens/PetsScreen";
import PetScreen from "../screens/PetScreen";
import {Icon} from "native-base";
import ScheduleScreen from "../screens/ScheduleScreen";
import TaskScreen from "../screens/TaskScreen";
import {t} from "../services/trans";

const PetTab = createStackNavigator({
    Pets: {screen: PetsScreen},
    NewPet: {screen: NewPetScreen},
    Task: {screen: TaskScreen},
    Pet: {screen: PetScreen},
});

const ScheduleTab = createStackNavigator({
    Schedule: {screen: ScheduleScreen},
});

const CalendarTab = createStackNavigator({
    Calendar: {screen: ScheduleScreen},
});

const Tabs = createBottomTabNavigator({
    ScheduleTab: {
        screen: ScheduleTab,
        navigationOptions: () => ({
            title: t('navigation.tabs.schedule'),
            tabBarIcon: <Icon name="ios-checkbox"/>
        })
    },
    PetTab: {
        screen: PetTab,
        navigationOptions: () => ({
            title: t('navigation.tabs.pets'),
            tabBarIcon: <Icon name="ios-paw"/>
        })
    },
    CalendarTab: {
        screen: CalendarTab,
        navigationOptions: () => ({
            title: t('navigation.tabs.calendar'),
            tabBarIcon: <Icon name="ios-calendar"/>
        })
    },
}, {
    initialRouteName: 'ScheduleTab',
    tabBarOptions: {
        labelStyle: {
        }
    },

});

const Main = createStackNavigator({
    Tabs,
}, {

    headerMode: 'none',
});

export default createSwitchNavigator({
    Login: {screen: LoginScreen},
    Main: Main,
}, {
    initialRouteName: 'Login',
    headerMode: 'none',
});