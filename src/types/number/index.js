import
  { Result
  } from "../result"

/*
 * add(x: Number, y: Number) => Number
 *
 * Adds two numbers together, equivalent to: a + b
 *
 * Example:
 *
 *   add(2, 4) // => 6
 */

export const add = (x, y) => 
  x + y

/*
 * inc(x: Number) => Number
 *
 * Increments a number by one
 *
 * Example:
 *
 *   inc(2) // => 3
 */

export const inc = x => 
  add(x, 1)

/*
 * subtract(x: Number, y: Number) => Number
 *
 * Subtracts the first number from the second, equivalent to: a - b
 *
 * Example:
 *
 *   subtract(2, 4) // => 6
 */

export const subtract = (x, y) => 
  x - y

/*
 * dec(x: Number) => Number
 *
 * Decrements a number by one
 *
 * Example:
 *
 *   dec(2) // => 1
 */

export const dec = x => 
  subtract(x, 1)

/*
 * multiply(x: Number, y: Number) => Number
 *
 * Multiplies two numbers, equivalent to: a * b
 *
 * Example:
 *
 *   subtract(2, 4) // => 6
 */

export const multiply = (x, y) => 
  x * y

/*
 * divide(x: Number, y: Number) => Result(Number, String)
 *
 * Divides one number with another, equivalent to: a / b
 * Since division by zero is undefined, divide returns a Result
 *
 * Example:
 *
 *   divide(4, 2) // => Ok(2)
 *   divide(4, 0) // => Err("division by zero is undefined")
 */

export const divide = (x, y) => 
  y !== 0 ? Result.Ok(x / y) : Result.Err("division by zero is undefined")