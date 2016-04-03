// Generated by CoffeeScript 1.10.0
(function() {
  var compile;

  compile = function(input) {
    var atom, call, char, expr, exprR, factor, i, is_atom, list, listR, lookahead, match, next, puts, recover, stack, term, termR, tokens;
    tokens = [];
    is_atom = /[a-z0-9]/i;
    i = 0;
    while (i < input.length) {
      switch (char = input[i]) {
        case "+":
        case "-":
        case "*":
        case "/":
        case "(":
        case ")":
        case ",":
          tokens.push(char);
          i++;
          break;
        case " ":
          i++;
          break;
        default:
          if (is_atom.test(char)) {
            tokens.push((function() {
              var value;
              value = '';
              while (char && is_atom.test(char)) {
                value += char;
                char = input[++i];
              }
              return value;
            })());
          } else {
            throw "Unknown input char: " + char;
          }
      }
    }
    next = function() {
      return tokens.shift();
    };
    lookahead = next();
    match = function(terminal) {
      if (lookahead === terminal) {
        return lookahead = next();
      } else {
        throw "Syntax error: Expected token " + terminal + " got " + lookahead;
      }
    };
    recover = function(token) {
      tokens.unshift(lookahead);
      return lookahead = token;
    };
    expr = function() {
      term();
      return exprR();
    };
    exprR = function() {
      if (lookahead === "+") {
        match("+");
        term();
        puts("+");
        return exprR();
      } else if (lookahead === "-") {
        match("-");
        term();
        puts("-");
        return exprR();
      }
    };
    term = function() {
      factor();
      return termR();
    };
    termR = function() {
      if (lookahead === "*") {
        match("*");
        factor();
        puts("*");
        return termR();
      } else if (lookahead === "/") {
        match("/");
        factor();
        puts("/");
        return termR();
      }
    };
    factor = function() {
      if (lookahead === "(") {
        match("(");
        expr();
        return match(")");
      } else {
        if (!call()) {
          return atom();
        }
      }
    };
    call = function() {
      var token;
      token = lookahead;
      match(lookahead);
      if (lookahead === "(") {
        puts(false, "mark");
        match("(");
        list();
        match(")");
        puts(token, "call");
        return true;
      } else {
        recover(token);
        return false;
      }
    };
    list = function() {
      expr();
      return listR();
    };
    listR = function() {
      if (lookahead === ",") {
        match(",");
        expr();
        return listR();
      }
    };
    atom = function() {
      if (is_atom.test(lookahead)) {
        return match(puts(lookahead, "atom"));
      } else {
        throw "Syntax error: Unexpected token " + lookahead;
      }
    };
    stack = [];
    puts = function(token, type) {
      var arg, args, func, op, x, y;
      if (type == null) {
        type = "op";
      }
      if (type === "op") {
        op = token;
        y = stack.pop();
        x = stack.pop();
        stack.push("(" + op + " " + x + " " + y + ")");
      } else if (type === "call") {
        func = token;
        args = [];
        while (arg = stack.pop()) {
          if (!arg) {
            break;
          }
          args.unshift(arg);
        }
        stack.push("(" + func + " " + (args.join(' ')) + ")");
      } else {
        stack.push(token);
      }
      return token;
    };
    expr();
    return stack[0];
  };

  module.exports = compile;

}).call(this);
