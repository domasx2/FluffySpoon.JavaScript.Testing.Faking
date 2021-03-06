export declare type Call = {
    callCount: number;
    arguments?: any[];
};
export declare function stringifyArguments(args: any[]): string;
export declare function areArgumentArraysEqual(a: any[], b: any[]): boolean;
export declare function stringifyCalls(calls: Call[]): string;
export declare function areArgumentsEqual(a: any, b: any): boolean;
