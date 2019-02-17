import React from "react";
import {ActivityIndicator, View} from "react-native";

export const Loading = () => (
    <View style={{flex: 1, padding: 20}}>
        <ActivityIndicator/>
    </View>
);