var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  
  });

INTEGER = 'INTEGER'
PLUS = 'PLUS'
EOF = 'EOF'


class Token{
    constructor(type, value){
        this.type = type
        this.value = value 
    }
}


class Interpreter extends Object { 
    
    constructor(text){
        super(text)
        this.text = text
        this.pos = 0
        this.current_token = null
    }


    error() {
        throw 'Error parsing Input'
    }

    get_next_token() {

        let text_token = this.text
        if(this.pos > text_token.length - 1) {
            return new Token(EOF, null)
        }

        let current_char = text_token[this.pos]
        if(!isNaN(current_char)) {
            let token = new Token(INTEGER, parseInt(current_char))
            this.pos += 1
            return token
        }

        if(current_char === '+') {
            let token = new Token(PLUS, current_char)
            this.pos += 1
            return token      
        }

        this.error()
    }

    eat(token_type){
        if (this.current_token.type === token_type){
            this.current_token = this.get_next_token()
        }
        else {
            this.error()
        }
    }

    expr() {
        this.current_token = this.get_next_token()
        
        let left = this.current_token
        this.eat(INTEGER)

        let op = this.current_token
        this.eat(PLUS)

        let right = this.current_token
        this.eat(INTEGER)

        let result = left.value + right.value 
        return result
    }

};

a = 1
while (a<2) {
    try {
        a = 2
        rl.question("calc> ", function(text) {
            interpreter = new Interpreter(text)
            result = interpreter.expr()
            console.log(result)
            rl.close();
         });         
    }
    catch (error) {
        break
    }
}
