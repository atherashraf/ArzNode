import {createStore} from "redux";

const initState = {
    width: '99.8%',
    height: '248px'
}

const reducer = (state = this.initState, action) => {
    switch (action.type) {
        case "store":
            return this.store;
        default:
            return state; //super.reducer(state, action);
    }
}

export const gridStore = createStore(reducer);

