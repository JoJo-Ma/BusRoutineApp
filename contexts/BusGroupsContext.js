import { createContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BusGroupsContext = createContext(null);
export const BusGroupsDispatchContext = createContext(null);

export function BusGroupsContextProvider({ children }) {
    const [state, dispatch] = useReducer(busGroupsReducer, initialState);

    return (
        <BusGroupsContext.Provider value={state}>
            <BusGroupsDispatchContext.Provider value={dispatch}>
                {children}
            </BusGroupsDispatchContext.Provider>
        </BusGroupsContext.Provider>
    );
}

const uuid = () => Math.random().toString(36).substring(7);

function busGroupsReducer(state, action) {
    let busGroups;
    switch (action.type) {
        case 'SET_BUS_GROUPS':
            return {
                ...state,
                busGroups: [...action.payload.busGroups],
            };
        case 'SET_BUS_GROUP':
            return {
                ...state,
                busGroups: [...action.payload.busGroup],
            };
        case 'SET_BUS_GROUP_NAME':
            busGroups = state.busGroups.map((busGroup) => {
                if (busGroup.id === action.payload.id) {
                    return {
                        ...busGroup,
                        name: action.payload.name,
                        };
                    }
                    return busGroup;
                });
            return {
                ...state,
                busGroups,
            };
        // do the same for data:
        case 'SET_BUS_GROUP_DATA':
            busGroups = state.busGroups.map((busGroup) => {
                if (busGroup.id === action.payload.id) {
                    return {
                        ...busGroup,
                        data: action.payload.data,
                        };
                    }
                    return busGroup;
                });
            return {
                ...state,
                busGroups,
            };
        // do the same for busRoute inside data:
        case 'SET_BUS_GROUP_BUS_ROUTE':
            console.log(action.payload);
            busGroups = state.busGroups.map((busGroup) => {
                if (busGroup.id === action.payload.id) {
                    const data = busGroup.data.map((busRoute) => {
                        if (busRoute.id === action.payload.busRouteId) {
                            return {
                                ...busRoute,
                                set: true,
                                busRoute: action.payload.busRoute,
                        
                            };
                        }
                        return busRoute;
                    });
                    return {
                        ...busGroup,
                        data,
                    };
                }
                return busGroup;
            });
            saveBusGroups(busGroups);
            return {
                ...state,
                busGroups,
            };
        case 'DELETE_BUS_GROUP':
            busGroups = state.busGroups.filter((busGroup) => busGroup.id !== action.payload.id);
            console.log(busGroups);
            return {
                ...state,
                busGroups,
            };
        case 'ADD_BUS_GROUP':
            return {
                ...state,
                busGroups: [
                    ...state.busGroups,
                    {
                        id: uuid(),
                        name: 'New Bus Group',
                        data: [],
                    },
                ],
            };
        case 'ADD_BUS_ROUTE':
            busGroups = state.busGroups.map((busGroup) => {
                if (busGroup.id === action.payload.id) {
                    return {
                        ...busGroup,
                        data: [
                            ...busGroup.data,
                            {
                                id: uuid(),
                                set: false,
                            }
                        ],
                    };
                }
                return busGroup;
            });
            return {
                ...state,
                busGroups,
            };
        case 'DELETE_BUS_ROUTE':
            busGroups = state.busGroups.map((busGroup) => {
                if (busGroup.id === action.payload.id) {
                    return {
                        ...busGroup,
                        data: busGroup.data.filter((busRoute) => busRoute.id !== action.payload.busRouteId),
                    };
                }
                return busGroup;
            });
            return {
                ...state,
                busGroups,
            };
        default:
            return state;
    }
}

const initialState = {
    busGroups: [],
};

function saveBusGroups(busGroups) {
    try {
        AsyncStorage.setItem('busGroups', JSON.stringify(busGroups));
    } catch (e) {
        console.log(e);
    }
}