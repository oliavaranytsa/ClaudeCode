import unittest
from calculator import add, subtract, multiply, divide


class TestCalculator(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
        self.assertEqual(add(-1, 1), 0)
        self.assertEqual(add(0, 0), 0)

    def test_subtract(self):
        self.assertEqual(subtract(10, 5), 5)
        self.assertEqual(subtract(0, 3), -3)
        self.assertEqual(subtract(-2, -2), 0)

    def test_multiply(self):
        self.assertEqual(multiply(3, 4), 12)
        self.assertEqual(multiply(-2, 5), -10)
        self.assertEqual(multiply(0, 100), 0)

    def test_divide(self):
        self.assertEqual(divide(10, 2), 5.0)
        self.assertEqual(divide(-9, 3), -3.0)
        self.assertEqual(divide(7, 2), 3.5)

    def test_divide_by_zero(self):
        with self.assertRaises(ValueError):
            divide(5, 0)


class TestDivide(unittest.TestCase):

    # Happy path
    def test_returns_float(self):
        self.assertIsInstance(divide(10, 2), float)

    def test_even_division(self):
        self.assertEqual(divide(10, 2), 5.0)

    def test_fractional_result(self):
        self.assertEqual(divide(7, 2), 3.5)

    def test_repeating_decimal(self):
        self.assertAlmostEqual(divide(1, 3), 1 / 3)

    # Signs
    def test_negative_dividend(self):
        self.assertEqual(divide(-10, 2), -5.0)

    def test_negative_divisor(self):
        self.assertEqual(divide(10, -2), -5.0)

    def test_both_negative(self):
        self.assertEqual(divide(-10, -2), 5.0)

    # Boundary / edge values
    def test_dividend_zero(self):
        self.assertEqual(divide(0, 5), 0.0)

    def test_divide_by_one(self):
        self.assertEqual(divide(42, 1), 42.0)

    def test_divide_by_itself(self):
        self.assertEqual(divide(7, 7), 1.0)

    def test_float_inputs(self):
        self.assertAlmostEqual(divide(0.1, 0.2), 0.5)

    def test_large_numbers(self):
        self.assertEqual(divide(1e18, 1e9), 1e9)

    def test_small_fractional_inputs(self):
        self.assertAlmostEqual(divide(1e-10, 1e-5), 1e-5)

    # Error states
    def test_divide_by_zero_int_raises_value_error(self):
        with self.assertRaises(ValueError):
            divide(10, 0)

    def test_divide_by_zero_float_raises_value_error(self):
        with self.assertRaises(ValueError):
            divide(10, 0.0)

    def test_divide_by_zero_negative_raises_value_error(self):
        with self.assertRaises(ValueError):
            divide(-5, 0)

    def test_divide_by_zero_error_message(self):
        with self.assertRaises(ValueError) as ctx:
            divide(10, 0)
        self.assertEqual(str(ctx.exception), "Cannot divide by zero")


if __name__ == "__main__":
    unittest.main()
