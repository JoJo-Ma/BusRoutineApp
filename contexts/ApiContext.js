import { createContext, useReducer } from 'react';

export const ApiContext = createContext(null);
export const ApiDispatchContext = createContext(null);

export function ApiContextProvider({ children }) {
    const [state, dispatch] = useReducer(apiReducer, initialState);

    return (
        <ApiContext.Provider value={state}>
            <ApiDispatchContext.Provider value={dispatch}>
                {children}
            </ApiDispatchContext.Provider>
        </ApiContext.Provider>
    );
}

function apiReducer(state, action) {
    switch (action.type) {
        case 'SET_BEARER_TOKEN':
            return {
                ...state,
                bearer_token: action.payload.bearer_token,
                expiration: action.payload.expiration,
            };
        default:
            return state;
    }
}

const initialState = {
    bearer_token: null,
    expiration: null,
};