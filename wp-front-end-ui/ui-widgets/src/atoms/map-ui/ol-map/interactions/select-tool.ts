import {IInteractionTool} from "./i-interaction-tool";
import Select from 'ol/interaction/Select';
// import {click, pointerMove, altKeyOnly} from 'ol/events/condition';


export default class SelectTool implements IInteractionTool {
    _olMapVM: any;
    select: Select;

    constructor(olMapVM: any) {
        this._olMapVM = olMapVM;

    }

    initTool(): void {
        this.select = new Select();
    }

    getTool(): Select {
        return this.select
    }

    addInteractionOnMap(): void {
        this._olMapVM.getMap().addInteraction(this.select);
        this.select.on('select', function (e: any) {
            document.getElementById('status').innerHTML = '&nbsp;' +
                e.target.getFeatures().getLength() +
                ' selected features (last operation selected ' + e.selected.length +
                ' and deselected ' + e.deselected.length + ' features)';
        });
    }


    removeInteractionFromMap(): void {
        this._olMapVM.getMap().removeInteraction(this.select);
    }

    selectFeature(feature: any): void {
        this.select.getFeatures().clear()
        this.select.getFeatures().push(feature)
    }
}