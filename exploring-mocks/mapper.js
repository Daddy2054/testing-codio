function mapper(arr, func) {
  arr.forEach(element => {
    func(element);
  });
}

module.exports = mapper;