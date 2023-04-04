import { IpRangesClient, Prefix } from './ipRangesClient';

export interface IpRangesManager {
    fetchRegions(): Promise<string[]>;
}

interface IpRangesManagerDependencies {
    ipRangesClient: IpRangesClient;
}

export const newIpRangesManager = ({ ipRangesClient }: Readonly<IpRangesManagerDependencies>): IpRangesManager => {
    const extractRegion = ({ region }: Readonly<Prefix>): string => region;
    const alphabetically = (valueA: string, valueB: string): number => valueA.localeCompare(valueB);
    const isUnique = (value: string, position: number, sortedValues: readonly string[]): boolean =>
        !position || value !== sortedValues[position - 1];
    const isNotEmpty = (value: string): boolean => value !== '';
    const isLowercase = (value: string): boolean => !/[A-Z]/.test(value);

    return {
        async fetchRegions(): Promise<string[]> {
            const { prefixes } = await ipRangesClient.fetch();
            return prefixes
                .map(extractRegion)
                .sort(alphabetically)
                .filter(isUnique)
                .filter(isNotEmpty)
                .filter(isLowercase);
        }
    };
};
