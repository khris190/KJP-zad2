import { ExpressionV2, type ExpressionInterface, Type } from "./ExpressionHandlerV2";


export interface ExpressionHandlerInterface {
    input: ExpressionInterface;
    prefix: ExpressionInterface;
    infix: ExpressionInterface;
    postfix: ExpressionInterface;
}

export class ExpressionHandler implements ExpressionHandlerInterface {
    input: ExpressionInterface;
    prefix: ExpressionInterface;
    infix: ExpressionInterface;
    postfix: ExpressionInterface;
    constructor(input: string) {
        this.input = new ExpressionV2(input);
        this.prefix = new ExpressionV2(input, Type.Prefix);
        this.infix = new ExpressionV2(input, Type.Infix);
        this.postfix = new ExpressionV2(input, Type.Postfix);
    }
}