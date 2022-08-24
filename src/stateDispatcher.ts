type AddDataDispatcher<T> = (data: T) => void;
type ResetDataDispatcher = () => void;

export interface StateDispatcher<T> {
    addData(data: T): void;
    resetData(): void;
    onAddData(dispatcher: AddDataDispatcher<T>): void;
    onResetData(dispatcher: ResetDataDispatcher): void;
}

export const newStateDispatcher = <T>(): StateDispatcher<T> => {
    const addDataDispatchers: AddDataDispatcher<T>[] = [];
    const resetDataDispatchers: ResetDataDispatcher[] = [];

    return {
        addData(data: T): void {
            addDataDispatchers.forEach((dispatcher) => {
                dispatcher(data);
            });
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
