export const initialState = {
    basket: [],
    loggedin: null
}

const reducer = (state, action) => {
    console.log(action)
    switch(action.type){
        case 'ADD_TO_BASKET':
            return {
                ...state,
                basket: [...state.basket, action.item]
            }
        case 'SET_LOGIN':
            return{
                ...state,
                loggedinuser: action.user
            }

        case 'REMOVE_ALL':
            return{...state, basket: []}

        case 'REMOVE_FROM_CART':
            let newCart = [...state.basket]
            console.log(state.basket)
            const index = state.basket.findIndex((basketItem) => basketItem.id === action.id)
            if(index >= 0){
                newCart.splice(index, 1)
            } else{
                console.log("Error occured removing product.")
            }
            return {...state, basket: newCart}
    }
}

export default reducer