import React from "react";
import { View, Text } from "react-native";
import { useSearchParams, Link } from 'expo-router';
import Group from '../../components/Group';
import GlobalStyles from "../../styles/GlobalStyles";

const Placeholder = () => {

    const { group } = useSearchParams();
    
    return (
        <View style={GlobalStyles.container}>
            {
                group &&
                <Group id={group} />
            }
        </View>
    )
};

export default Placeholder;