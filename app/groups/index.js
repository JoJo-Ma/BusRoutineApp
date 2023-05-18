import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Divider, Surface } from "react-native-paper";
import { BusGroupsContext, BusGroupsDispatchContext } from "../../contexts/BusGroupsContext";
import { Link, useRouter, useNavigation } from "expo-router";
import GroupCard from "../../components/GroupCard"; 
import GlobalStyles from "../../styles/GlobalStyles";

export default function Groups() {
    const { busGroups } = useContext(BusGroupsContext);
    const dispatch = useContext(BusGroupsDispatchContext);
    const router = useRouter();
    const navigation = useNavigation();


    const addGroup = () => {
        dispatch({
            type: 'ADD_BUS_GROUP',
        });
    };

    return (
        <ScrollView style={GlobalStyles.container}>
            {
                busGroups && busGroups.length > 0 ? busGroups.map((group, index) => {
                    return (
                        <GroupCard group={group} />
                    )
                }) :
                    <Text style={GlobalStyles.emptyList}>No groups</Text>
            }
            <Button style={GlobalStyles.largeMargin} icon="plus" mode="contained-tonal" onPress={addGroup}>Add group</Button>
        </ScrollView>
    );
}

