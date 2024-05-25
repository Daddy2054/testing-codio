function fibonacci(numFib) {
  if (numFib <= 1) {
    return 1;
  }
  return fibonacci(numFib - 1) + fibonacci(numFib - 2);
}

module.exports = fibonacci;