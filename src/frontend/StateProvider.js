import React,{createContext, useContext, useReducer} from 'react'

export const StateContext = createContext();
//Uses a combination of useContext and useReducer to generate global state variables for the website.
export const StateProvider = ({reducer, initialState, children}) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)
export const useStateValue = () => useContext(StateContext)