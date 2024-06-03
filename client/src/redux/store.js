import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { rootReducer } from './rootReducer';

const finalReducer = combineReducers({
    cart: rootReducer
});

const initialState = {  
    cart: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    },
};

const middleware = [thunk];
const store = createStore(finalReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
