export const initialState = {
    basket: [],
    loggedin: null
}

const reducer = (state, action) => {
    switch(action.type){
        //Adds item to basket array
        case 'ADD_TO_BASKET':
            return {
                ...state,
                basket: [...state.basket, action.item]
            }
        //Sets the login state for the user
        case 'SET_LOGIN':
            return{
                ...state,
                loggedinuser: action.user
            }
        //Clears all items from the shopping basket by making a blank array.
        case 'REMOVE_ALL':
            return{...state, basket: []}
        //Attempts to remove a specific product from the shopping basket by finding item in array and removing it.
        case 'REMOVE_FROM_CART':
            let newCart = [...state.basket]
            const index = state.basket.findIndex((basketItem) => basketItem.id === action.id)
            if(index >= 0){
                newCart.splice(index, 1)
            } else{
                console.error("Unable to remove product.")
            }
            return {...state, basket: newCart}
    }
}

export default reducer