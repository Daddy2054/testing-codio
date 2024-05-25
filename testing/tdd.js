// WRITE YOUR CODE HERE
function squareRoot(number) {
    if (number < 0) {
        throw ('Parameter must be a positive number');
    } else if (typeof number !== 'number') {
        throw ('Parameter must be a number');
    } else {
        // return square root
        return Math.sqrt(number);
        // return number * number;
    }
}

// FREEZE CODE BEGIN
module.exports = squareRoot;
// FREEZE CODE END
