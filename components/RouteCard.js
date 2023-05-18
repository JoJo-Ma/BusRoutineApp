// compare with Search.js:
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useContext} from "react";
import { BusGroupsContext, BusGroupsDispatchContext } from "../contexts/BusGroupsContext";
import { Button, TextInput, IconButton,  Surface } from 'react-native-paper';
import { ModalComponent as Modal } from "./Modal";
import { Link } from 'expo-router';
import GlobalStyles from "../styles/GlobalStyles";

export default function RouteCard({ busRoute, key, groupId }) {
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useContext(BusGroupsDispatchContext);

    const { busRoute: route } = busRoute;

    const deleteRoute = (busRouteId) => {
        dispatch({
            type: 'DELETE_BUS_ROUTE',
            payload: {
                id: groupId,
                busRouteId,
            },
        });
        setModalVisible(false);
    };

    return (
        <View>
            <Surface
                style={[GlobalStyles.flex, GlobalStyles.borderRadius, GlobalStyles.smallMargin, GlobalStyles.largePadding]}
                elevation={2}
            >
                <View style={GlobalStyles.flexJustifySpaceBetween}>
                    <Text>{busRoute.set ? `${route.RouteName.En} - ${route.StopName.En}` : 'Not set'}</Text>
                    <View style={GlobalStyles.flex}>
                        <Link href={`/route/${busRoute.id}`}>
                            <Button icon="cog" />
                        </Link>
                        <Button icon="delete" onPress={() => setModalVisible(true)} />
                    </View>
                </View>
            </Surface>
            <Modal
                visible={modalVisible}
                hideModal={() => setModalVisible(false)}
                action={() => deleteRoute(busRoute.id)}
            />
        </View>
    )
}