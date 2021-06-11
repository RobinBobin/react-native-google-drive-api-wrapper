import { StaticUtils } from "simple-common-utils";

export default class ListQueryBuilder {
  constructor() {
    this.__query = [];
  }
  
  and() {
    return this.__push("and");
  }
  
  contains(key, value, quoteValueIfString = true) {
    return this.operator(key, "contains", value, false, quoteValueIfString);
  }
  
  e(key, value, quoteValueIfString = true) {
    return this.operator(key, "=", value, false, quoteValueIfString);
  }
  
  g(key, value, quoteValueIfString = true) {
    return this.operator(key, ">", value, false, quoteValueIfString);
  }
  
  in(value, key, quoteValueIfString = true) {
    return this.operator(value, "in", key, quoteValueIfString);
  }
  
  l(key, value, quoteValueIfString = true) {
    return this.operator(key, "<", value, false, quoteValueIfString);
  }
  
  operator(left, operator, right, quoteLeftIfString, quoteRightIfString) {
    this.__query.push(StaticUtils.safeQuoteIfString(left, quoteLeftIfString, "'"));
    this.__query.push(operator);
    this.__query.push(StaticUtils.safeQuoteIfString(right, quoteRightIfString, "'"));
    
    return this;
  }
  
  or() {
    return this.__push("or");
  }
  
  pop() {
    return this.__push(")");
  }
  
  push() {
    return this.__push("(");
  }
  
  toString() {
    return this.__query.join(" ");
  }
  
  __push(entity) {
    this.__query.push(entity);
    
    return this;
  }
};
