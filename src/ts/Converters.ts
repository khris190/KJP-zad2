const fullRegex = /^[a-zA-Z+-/*\(\)]+$/
const nonInfixRegex = /^[a-zA-Z+-/*]+$/
const lettersRegex = /([a-zA-Z])/g
const operationsRegex = /([+-/*])/g

export default class Converters {


    public static preToPost(pre_exp: string): string {

        let s: Array<string> = [];

        // length of expression
        let length = pre_exp.length;

        // reading from right to left
        for (let i = length - 1; i >= 0; i--) {

            // check if symbol is operator
            if (pre_exp[i].match(operationsRegex)) {
                // pop two operands from stack
                let op1 = s[s.length - 1];
                s.pop();
                let op2 = s[s.length - 1];
                s.pop();

                // concat the operands and operator
                let temp = op1 + op2 + pre_exp[i];

                // Push String temp back to stack
                s.push(temp);
            }

            // if symbol is an operand
            else {
                // push the operand to the stack
                s.push(pre_exp[i] + "");
            }
        }

        // stack contains only the Postfix expression
        return s[s.length - 1];
    }
    public static postToPre(post_exp: string): string {
        let s: Array<string> = [];

        // length of expression
        let length = post_exp.length;

        // reading from right to left
        for (let i = 0; i < length; i++) {

            // check if symbol is operator
            if (post_exp[i].match(operationsRegex)) {

                // Pop two operands from stack
                let op1 = s[s.length - 1];
                s.pop();
                let op2 = s[s.length - 1];
                s.pop();

                // concat the operands and operator
                let temp = post_exp[i] + op2 + op1;

                // Push String temp back to stack
                s.push(temp);
            }

            // if symbol is an operand
            else {

                // Push the operand to the stack
                s.push(post_exp[i] + "");
            }
        }

        let ans = "";
        while (s.length > 0)
            ans += s.pop();
        return ans;
    }
    public static preToIn(pre_exp: string): string {
        let stack: Array<string> = [];

        // Length of expression
        let l = pre_exp.length;

        // Reading from right to left
        for (let i = l - 1; i >= 0; i--) {
            let c = pre_exp[i];

            if (c.match(operationsRegex)) {
                let op1 = stack[stack.length - 1];
                stack.pop()
                let op2 = stack[stack.length - 1];
                stack.pop()

                // Concat the operands and operator
                let temp = "(" + op1 + c + op2 + ")";
                stack.push(temp);
            }
            else {

                // To make character to string
                stack.push(c + "");
            }
        }
        return stack[stack.length - 1];
    }
    public static prec(c: string) {
        if (c == '^')
            return 3;
        else if (c == '/' || c == '*')
            return 2;
        else if (c == '+' || c == '-')
            return 1;
        else
            return -1;
    }
    public static inToPost(in_exp: string): string {

        let st = [];
        let result = "";

        for (const element of in_exp) {
            let c = element;
            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
                result += c;
            else if (c == '(')
                st.push('(');
            else if (c == ')') {
                while (st[st.length - 1] != '(') {
                    result += st[st.length - 1];
                    st.pop();
                }
                st.pop();
            }
            else {
                while (st.length != 0 && this.prec(element) <= this.prec(st[st.length - 1])) {
                    result += st[st.length - 1];
                    st.pop();
                }
                st.push(c);
            }
        }
        while (st.length != 0) {
            result += st[st.length - 1];
            st.pop();
        }
        return result;
    }
    public static inToPre(in_exp: string): string {
        return this.postToPre(this.inToPost(in_exp));
    }
    public static postToIn(post_exp: string): string {
        return this.preToIn(this.postToPre(post_exp));
    }
}