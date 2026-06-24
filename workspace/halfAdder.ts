type Bit = 0 | 1;

export type HalfAdderResult = {
    /** Sum bit (0 or 1) */
    sum: Bit;
    /** Carry bit (0 or 1) */
    carry: Bit;
};

/**
 * XOR implementation for bits.
 * Equivalent to the bitwise XOR operator but expressed using addition modulo 2.
 */
function xor(a: Bit, b: Bit): Bit {
    return (a ^ b) as Bit;
}

/**
 * AND implementation for bits.
 * Equivalent to the bitwise AND operator.
 */
function and(a: Bit, b: Bit): Bit {
    return (a & b) as Bit;
}

/**
 * Half adder – adds two single‑bit numbers and returns the sum and carry.
 *
 * @param a First bit (0 or 1).
 * @param b Second bit (0 or 1).
 * @returns An object containing `sum` and `carry` bits.
 */
export function halfAdder(a: Bit, b: Bit): HalfAdderResult {
    const sum = xor(a, b);
    const carry = and(a, b);
    return { sum, carry };
}

// Exported for convenience when bundlers generate CommonJS modules.
export default halfAdder;
