import { halfAdder, HalfAdderResult } from './halfAdder';

type TestCase = {
  a: 0 | 1;
  b: 0 | 1;
  expected: HalfAdderResult;
};

const testCases: TestCase[] = [
  { a: 0, b: 0, expected: { sum: 0, carry: 0 } },
  { a: 0, b: 1, expected: { sum: 1, carry: 0 } },
  { a: 1, b: 0, expected: { sum: 1, carry: 0 } },
  { a: 1, b: 1, expected: { sum: 0, carry: 1 } },
];

test('halfAdder produces correct sum and carry for all input combinations', () => {
  for (const { a, b, expected } of testCases) {
    const result = halfAdder(a, b as 0 | 1);
    expect(result).toEqual(expected);
  }
});