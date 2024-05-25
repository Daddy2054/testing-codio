const mapper = require('./mapper');

const mockFunc = jest.fn(x => 2 * x);

test('Test mapper', () => {
    mapper([5, 10, 15], mockFunc);
    
    expect(mockFunc.mock.calls).toHaveLength(3);

    expect(mockFunc.mock.calls[0][0]).toBe(5);
    expect(mockFunc.mock.results[0].value).toBe(10);

    expect(mockFunc.mock.calls[1][0]).toBe(10);
    expect(mockFunc.mock.results[1].value).toBe(20);

    expect(mockFunc.mock.calls[2][0]).toBe(15);
    expect(mockFunc.mock.results[2].value).toBe(30);
});