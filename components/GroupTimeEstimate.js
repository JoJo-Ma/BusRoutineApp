import { useEffect, useState, useContext } from "react";
import { BusGroupsContext } from "../contexts/BusGroupsContext";
import { Button, TextInput, Divider, Surface } from 'react-native-paper';
import { View, Text } from "react-native";
import useBearerToken from "../hooks/useBearerToken";
import axios from "axios";
import GlobalStyles from "../styles/GlobalStyles";

const GroupTimeEstimate = ({ groupId }) => {

    const token = useBearerToken();
    const [busGroup, setBusGroup] = useState(null);
    const { busGroups } = useContext(BusGroupsContext);
    const [fetched, setFetched] = useState(false);
    
    const retrieveEstimateTime = (routeId) => {
        return new Promise(async (resolve, reject) => {
        const busGroupData = busGroup.data.find((busRoute) => busRoute.id === routeId);
        const selectedStop = busGroupData.busRoute;
        if (!token) {
            return;
        }
        const res = await axios.get(`https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/${selectedStop.city.value}/${selectedStop.RouteName.En}`,
        {
            params: {
                $format: 'JSON',
                $top: 30,
                $filter: `RouteID eq '${selectedStop.RouteId}' and StopId eq '${selectedStop.StopID}'`,
            },
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        resolve({
            ...busGroupData,
            estimatedTime: res.data[0].EstimateTime,
        });
    })
    }

    const retrieveAllEstimatedTimes = async () => {
        if (!token || !busGroup || busGroup.data?.length === 0) {
            return;
        }
        const estimatedTimePromise = [];
        for (let i = 0; i < busGroup.data.length; i++) {
            estimatedTimePromise.push(retrieveEstimateTime(busGroup.data[i].id));
        }
        const data = await Promise.all(estimatedTimePromise);
        setBusGroup({
            ...busGroup,
            data,
        }
        )

    }

    useEffect(() => {
        if (!busGroups) return;
        const busGroup = busGroups.find((busGroup) => busGroup.id === groupId);
        setBusGroup(busGroup);
    }, [busGroups]);

    useEffect(() => {
        console.log(busGroup);
        if (fetched) return;
        if (!busGroup || busGroup.data?.length === 0) return;
        retrieveAllEstimatedTimes();
        setFetched(true);
    }, [busGroup])

    return (
        <Surface
            style={[
                GlobalStyles.largePadding,
                GlobalStyles.smallMargin,
                GlobalStyles.borderRadius,
            ]}
        >
        {
            !busGroup ? <Text>Loading...</Text> : <Text>{busGroup.name}</Text>
        }
        <View
            style={GlobalStyles.flexJustifySpaceBetween}
        >
            <View>
                {
                    busGroup?.data?.filter(el => el.estimatedTime).sort((a,b) => {
                        return a.estimatedTime - b.estimatedTime;
                    }).map((busRoute, index) => (
                        <View key={index}>
                            <Text>{busRoute.busRoute.RouteName.Zh_tw} - {Math.floor(busRoute.estimatedTime / 60)} min</Text>
                        </View>
                    ))
                }
            </View>
            <Button icon="reload" onPress={() => retrieveAllEstimatedTimes()} />
        </View>

        </Surface>
    )
}

export default GroupTimeEstimate;