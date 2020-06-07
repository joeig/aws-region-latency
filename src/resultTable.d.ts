export interface ResultTable {
    prepareTable(): void;
    addRegion(region: string, attempt: number): {
        setLatency(latency: number): void;
    };
}
export declare function getPortionByMilliseconds(fullWidthMilliseconds: number, ms: number): number;
export declare function resultTableFactory(resultsElement: HTMLElement, fullWidthMilliseconds?: number): ResultTable;
