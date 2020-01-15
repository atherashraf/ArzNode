

class Tool{
    _tool = null;
    _olMapVM = null;
    constructor(olMapVM){
        this._olMapVM = olMapVM
    }
    getOLMapVM(){
        return this._olMapVM;
    }
    initTool(){

    }
    getTool(){
        return this._tool;
    }
    getOLMap(){
        if(this._olMapVM){
            return this._olMapVM.getMap();
        }
        return null;
    }
    addInteraction(){
        this.getOLMap().addInteraction(this._tool)
    }
    removeInteraction(){
        this.getOLMap().removeInteraction(this._tool);
    }
    clearAll(){

    }
}
export default Tool;