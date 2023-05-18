// compare with Search.js:
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useLayoutEffect } from "react";
import { Button, TextInput, Divider, Surface } from 'react-native-paper';
import { BusGroupsContext, BusGroupsDispatchContext } from "../contexts/BusGroupsContext";
import { Link } from 'expo-router';
import RouteCard from "./RouteCard";
import GlobalStyles from "../styles/GlobalStyles";

export default function Group({ id }) {
    const [busGroup, setBusGroup] = useState(null);
    const { busGroups } = useContext(BusGroupsContext);
    const dispatch = useContext(BusGroupsDispatchContext);

    const updateName = (name) => {
        dispatch({
            type: 'SET_BUS_GROUP_NAME',
            payload: {
                id,
                name,
            },
        });
    };

    const addRoute = () => {
        dispatch({
            type: 'ADD_BUS_ROUTE',
            payload: {
                id,
            },
        });
    };

    useLayoutEffect(() => {
        console.log(busGroups);
        console.log(id);
        const busGroup = busGroups.find((busGroup) => busGroup.id === id);
        setBusGroup(busGroup);
        console.log(busGroup)
    }, [busGroups]);

    return (
        <View>
            {
                busGroup &&
                <View>
                    <TextInput
                        mode='outlined'
                        label='Group name'
                        placeholder="Name"
                        onChangeText={updateName}
                        value={busGroup.name}
                        style={GlobalStyles.largeMargin}
                    />
                    {
                        busGroup.data.length > 0 ?
                            busGroup.data.map((busRoute, index) => {
                                return (
                                    <View
                                        key={index}
                                    >
                                        <RouteCard busRoute={busRoute} groupId={id} />
                                    </View>
                                )

                            })
                        : 
                        <Text style={GlobalStyles.emptyList}>No routes</Text>
                }
                </View>

            }
            <Button style={GlobalStyles.largeMargin} icon="plus" mode="contained-tonal" onPress={addRoute}>Add route</Button>
        </View>
    );
}