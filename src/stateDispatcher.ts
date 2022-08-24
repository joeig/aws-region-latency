type AddDataDispatcher<T> = (data: T) => void;
type ResetDataDispatcher = () => void;

export interface StateDispatcher<T> {
    addData(data: T): void;
    getData(): T[];
    resetData(): void;
    onAddData(dispatcher: AddDataDispatcher<T>): void;
    onResetData(dispatcher: ResetDataDispatcher): void;
}

export const newStateDispatcher = <T>(): StateDispatcher<T> => {
    const state: T[] = [];
    const addDataDispatchers: AddDataDispatcher<T>[] = [];
    const resetDataDispatchers: ResetDataDispatcher[] = [];

    return {
        addData(data: T): void {
            state.push(data);
            addDataDispatchers.forEach((dispatcher) => {
                dispatcher(data);
            });
        },
        getData(): T[] {
            return state;
        },
        resetData(): void {
            resetDataDispatchers.forEach((dispatcher) => {
                dispatcher();
            });
        },
        onAddData(dispatcher: AddDataDispatcher<T>): void {
            addDataDispatchers.push(dispatcher);
        },
        onResetData(dispatcher: ResetDataDispatcher): void {
            resetDataDispatchers.push(dispatcher);
        }
    };
};
