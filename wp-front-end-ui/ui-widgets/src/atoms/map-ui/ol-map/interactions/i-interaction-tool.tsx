export interface IInteractionTool {
    _olMapVM: any,

    initTool(): void,

    addInteractionOnMap(): void,

    removeInteractionFromMap(): void
}