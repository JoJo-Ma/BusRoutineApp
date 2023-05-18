// same imports as RouteCard.js:
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useLayoutEffect } from "react";
import { Button, TextInput, Divider, Surface } from 'react-native-paper';
import { BusGroupsContext, BusGroupsDispatchContext } from "../contexts/BusGroupsContext";
import { Link } from 'expo-router';
import { ModalComponent as Modal } from "./Modal";
import GlobalStyles from "../styles/GlobalStyles";

export default function GroupCard({ group }) {

    const dispatch = useContext(BusGroupsDispatchContext);
    const [modalVisible, setModalVisible] = useState(false);

    const deleteGroup = (id) => {
        dispatch({
            type: 'DELETE_BUS_GROUP',
            payload: {
                id,
            },
        });
        setModalVisible(false);
    };

    return (
        <View key={group.id}>
        
        <Surface
            style={[
                GlobalStyles.largePadding,
                GlobalStyles.smallMargin,
                GlobalStyles.borderRadius,
            ]}
        >
            <View
                style={[
                    GlobalStyles.flexJustifySpaceBetween,
                ]}
            >
                <Text>{group.name}</Text>
                <View
                    style={[
                        GlobalStyles.flex,
                    ]}
                >
                    <Link href={`/groups/${group.id}`}>
                        <Button icon="cog" />
                    </Link>
                    <Button icon="delete" onPress={() => setModalVisible(true)} />
                </View>
            </View>
        </Surface>
        <Modal
                visible={modalVisible}
                hideModal={() => setModalVisible(false)}
                action={() => deleteGroup(group.id)}
            />
    </View>
    )
}
