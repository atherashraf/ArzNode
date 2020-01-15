import AppStoreModel from "./app-store-model";


class PivotTableStoreModel extends AppStoreModel {
    constructor() {
        super();
        this.initState = {
            ...super.initState,
            data: []
        }
    }

    reducer(state = this.initState, action) {
        super.reducer(state, action)
        switch (action.type) {
            case "ADD_DATA":
                return Object.assign({}, state, {data: action.data});
            default:
                return state; //super.reducer(state, action);
        }
    }
}
export default PivotTableStoreModel