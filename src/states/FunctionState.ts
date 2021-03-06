import { ContextState, PropertyKey } from "./ContextState";
import { Context } from "src/Context";
import { stringifyArguments, stringifyCalls, areArgumentsEqual, areArgumentArraysEqual } from "../Utilities";
import { GetPropertyState } from "./GetPropertyState";
import { Argument, Arg } from "../Arguments";

const Nothing = Symbol();

export class FunctionState implements ContextState {
    private returns: any[]|Symbol;
    private mimicks: Function|null;

    private _callCount: number;
    private _arguments: any[];

    public get arguments() {
        return this._arguments;
    }

    public get callCount() {
        return this._callCount;
    }

    public get property() {
        return this._getPropertyState.property;
    }

    constructor(private _getPropertyState: GetPropertyState, ...args: any[]) {
        this.returns = Nothing;
        this.mimicks = null;

        this._arguments = args;
        this._callCount = 0;
    }

    apply(context: Context, args: any[], matchingFunctionStates: FunctionState[]) {
        let callCount = this._callCount;
        const hasExpectations = context.initialState.hasExpectations;
        if(!matchingFunctionStates) {
            matchingFunctionStates = this._getPropertyState
                .recordedFunctionStates
                .filter(x => areArgumentArraysEqual(x.arguments, args));
        }

        if(hasExpectations) {
            callCount = matchingFunctionStates
                .filter(x => x._arguments[0] !== Arg.all())
                .map(x => x.callCount)
                .reduce((a, b) => a + b, 0);
        }

        context.initialState.assertCallCountMatchesExpectations(
            this._getPropertyState.recordedFunctionStates,
            callCount,
            'method',
            this.property,
            args);

        if(!hasExpectations) {
            this._callCount++;

            for(let matchingFunctionState of matchingFunctionStates)
            for(let argument of matchingFunctionState.arguments) {
                if(!(argument instanceof Argument))
                    continue;

                const indexOffset = matchingFunctionState
                    .arguments
                    .indexOf(argument);
                const myArg = args[indexOffset];
                if(myArg instanceof Argument)
                    continue;

                argument.encounteredValues.push(myArg);
            }
        }

        if(this.mimicks)
            return this.mimicks.apply(this.mimicks, args);

        if(this.returns === Nothing)
            return context.proxy;

        var returnsArray = this.returns as any[];
        if(returnsArray.length === 1)
            return returnsArray[0];

        return returnsArray[this._callCount-1];
    }

    set(context: Context, property: PropertyKey, value: any) {
    }

    get(context: Context, property: PropertyKey) {
        if (property === 'then')
            return void 0;

        if(property === 'mimicks') {
            return (input: Function) => {
                this.mimicks = input;
                this._callCount--;

                context.state = context.initialState;
            }
        }

        if(property === 'returns') {
            if(this.returns !== Nothing)
                throw new Error('The return value for the function ' + this._getPropertyState.toString() + ' with ' + stringifyArguments(this._arguments) + ' has already been set to ' + this.returns);

            return (...returns: any[]) => {
                this.returns = returns;
                this._callCount--;

                if(this._callCount === 0) {
                    // var indexOfSelf = this
                    //     ._getPropertyState
                    //     .recordedFunctionStates
                    //     .indexOf(this);
                    // this._getPropertyState
                    //     .recordedFunctionStates
                    //     .splice(indexOfSelf, 1);
                }

                context.state = context.initialState;
            };
        }

        return context.proxy;
    }
}