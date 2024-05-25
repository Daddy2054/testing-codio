const sum = (a, b) => {
    if (typeof a !== "number" || typeof b !== "number") {
      return NaN;
    }
    return a + b;
  };
  
  describe("Sum function", () => {
    test("function is defined", () => {
      expect(sum).toBeDefined();
    });
  
    test("always return a number", () => {
      expect(typeof sum(1, 2)).toBe("number");
    });
  
    test("sum 1 + 2 = 3", () => {
      expect(sum(1, 2)).toBe(3);
    });
  
    test("[] + {}", () => {
      expect(sum([], {})).toBe(NaN);
    });
  
    test("{} + []", () => {
      expect(sum({}, [])).toBe(NaN);
    });
  });