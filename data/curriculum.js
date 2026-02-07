export const courses = [
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Master JavaScript from fundamentals to advanced concepts',
    topics: [
      {
        id: 'console-log',
        title: 'console.log',
        outcomes: [
          'console log basics',
          'printing strings using single and double quotes',
          'printing numbers',
          'printing multiple values separated by +',
          'math expressions'
        ],
        tasks: [
          {
            description: 'Print the text: Hello, World!',
            testCases: [
              {
                input: null,
                expectedOutput: 'Hello, World!'
              }
            ]
          },
          {
            description: 'Print the number 42',
            testCases: [
              {
                input: null,
                expectedOutput: '42'
              }
            ]
          },
          {
            description: 'Print the decimal number 3.14159',
            testCases: [
              {
                input: null,
                expectedOutput: '3.14159'
              }
            ]
          },
          {
            description: 'Print the negative number -50',
            testCases: [
              {
                input: null,
                expectedOutput: '-50'
              }
            ]
          },
          {
            description: 'Print "Result:" and 100 together, separated by a space',
            testCases: [
              {
                input: null,
                expectedOutput: 'Result: 100'
              }
            ]
          },
          {
            description: 'Print the result of 8 multiplied by 5',
            testCases: [
              {
                input: null,
                expectedOutput: '40'
              }
            ]
          }
        ]
      },
      {
        id: 'variables-and-constants',
        title: 'Variables and Constants',
        outcomes: [
          'what_are_variables_constants',
          'const_declaration',
          'let_declaration',
          'using_variables',
          'reassignment',
          'const_cannot_reassign',
          'naming_conventions'
        ],
        tasks: [
          {
            description: 'Store the number 100 in a constant and print it',
            testCases: [
              {
                input: null,
                expectedOutput: '100'
              }
            ]
          },
          {
            description: 'Store the text "JavaScript" in a constant and print it',
            testCases: [
              {
                input: null,
                expectedOutput: 'JavaScript'
              }
            ]
          },
          {
            description: 'Store 15 and 27 in two constants, then print their sum',
            testCases: [
              {
                input: null,
                expectedOutput: '42'
              }
            ]
          },
          {
            description: 'Create a variable with value 10, add 5 to it, then print the result',
            testCases: [
              {
                input: null,
                expectedOutput: '15'
              }
            ]
          },
          {
            description: 'Create a variable with value 2, double it 3 times, then print the final value',
            testCases: [
              {
                input: null,
                expectedOutput: '16'
              }
            ]
          },
          {
            description: 'Create a constant with value 100 and a variable starting at 0. Add the constant to the variable twice, then print the variable',
            testCases: [
              {
                input: null,
                expectedOutput: '200'
              }
            ]
          }
        ]
      },
      {
        id: 'numbers-arithmetic',
        title: 'Numbers and basic arithmetic',
        outcomes: [
          'number_types',
          'addition_subtraction',
          'multiplication_division',
          'modulo_operator',
          'operator_precedence',
          'using_parentheses',
          'multi_step_calculations'
        ],
        tasks: [
          {
            description: 'A rectangle has length 24 and width 15. Print its area on the first line and perimeter on the second line',
            testCases: [
              {
                input: null,
                expectedOutput: '360\n78'
              }
            ]
          },
          {
            description: 'Convert 185 minutes to hours and remaining minutes. Print hours on the first line, remaining minutes on the second line',
            testCases: [
              {
                input: null,
                expectedOutput: '3\n5'
              }
            ]
          },
          {
            description: 'Three test scores are 78, 85, and 92. Print their average',
            testCases: [
              {
                input: null,
                expectedOutput: '85'
              }
            ]
          },
          {
            description: 'An item costs 1250 with a 20% discount. Print the discount amount on the first line, final price on the second line',
            testCases: [
              {
                input: null,
                expectedOutput: '250\n1000'
              }
            ]
          },
          {
            description: 'Given the number 9472, print its last digit on the first line, and the number without the last digit on the second line',
            testCases: [
              {
                input: null,
                expectedOutput: '2\n947'
              }
            ]
          },
          {
            description: 'Convert 25 Celsius to Fahrenheit. Formula: (celsius × 9 / 5) + 32. Print the result',
            testCases: [
              {
                input: null,
                expectedOutput: '77'
              }
            ]
          },
          {
            description: 'Given two numbers 37 and 58, print their sum, difference, product, and quotient on separate lines (use larger minus smaller for difference, larger divided by smaller for quotient)',
            testCases: [
              {
                input: null,
                expectedOutput: '95\n21\n2146\n1.5675675675675675'
              }
            ]
          },
          {
            description: 'Convert 7384 seconds to hours, minutes, and remaining seconds. Print each on separate lines',
            testCases: [
              {
                input: null,
                expectedOutput: '2\n3\n4'
              }
            ]
          }
        ]
      },
      {
        id: 'strings-operations',
        title: 'Strings and string operations',
        outcomes: [
          'creating_strings',
          'string_length',
          'string_indexing',
          'last_character',
          'string_concatenation',
          'toUpperCase_toLowerCase',
          'combining_operations'
        ],
        tasks: [
          {
            description: 'The word is "JavaScript". Print its length, first character, and last character on separate lines',
            testCases: [
              {
                input: null,
                expectedOutput: '10\nJ\nt'
              }
            ]
          },
          {
            description: 'First name is "John", last name is "Smith". Print the full name with a space between them',
            testCases: [
              {
                input: null,
                expectedOutput: 'John Smith'
              }
            ]
          },
          {
            description: 'The word is "Programming". Print the first 3 characters on one line, last 3 characters on the next line',
            testCases: [
              {
                input: null,
                expectedOutput: 'Pro\ning'
              }
            ]
          },
          {
            description: 'The text is "hello world". Print it in uppercase on the first line, lowercase on the second line',
            testCases: [
              {
                input: null,
                expectedOutput: 'HELLO WORLD\nhello world'
              }
            ]
          },
          {
            description: 'First name is "Alice", last name is "Brown". Print their initials combined and in uppercase (first character of each name)',
            testCases: [
              {
                input: null,
                expectedOutput: 'AB'
              }
            ]
          },
          {
            description: 'The word is "ABCDE". Print each character on a separate line',
            testCases: [
              {
                input: null,
                expectedOutput: 'A\nB\nC\nD\nE'
              }
            ]
          },
          {
            description: 'The word is "racecar". Print the first, middle, and last characters separated by dashes on one line',
            testCases: [
              {
                input: null,
                expectedOutput: 'r-e-r'
              }
            ]
          },
          {
            description: 'Username is "johnDoe42". Print: its length, its first character in uppercase, and its last character (each on separate lines)',
            testCases: [
              {
                input: null,
                expectedOutput: '9\nJ\n2'
              }
            ]
          }
        ]
      },
      {
        id: 'undefined-null',
        title: 'Understanding undefined and null',
        outcomes: [
          'what_is_undefined',
          'what_is_null',
          'undefined_vs_null',
          'typeof_undefined_null'
        ],
        tasks: [
          {
            description: 'Declare a variable without assigning any value. Print the variable on the first line, its type (using typeof) on the second line',
            testCases: [
              {
                input: null,
                expectedOutput: 'undefined\nundefined'
              }
            ]
          },
          {
            description: 'Create a variable and assign null to it. Print the variable on the first line, its type (using typeof) on the second line',
            testCases: [
              {
                input: null,
                expectedOutput: 'null\nobject'
              }
            ]
          },
          {
            description: 'Create a variable with value 100. Print the value and its type. Then reassign it to null and print the value and its type again (4 lines total)',
            testCases: [
              {
                input: null,
                expectedOutput: '100\nnumber\nnull\nobject'
              }
            ]
          }
        ]
      },
      {
        id: 'date-time',
        title: 'Working with dates',
        outcomes: [
          'what_is_date_object',
          'creating_date_now',
          'creating_date_string',
          'creating_date_parts',
          'get_methods',
          'set_methods',
          'month_zero_indexed',
          'getDay_returns_weekday',
          'getTime_timestamp',
          'date_comparison',
          'date_arithmetic',
          'toISOString_toLocaleDateString'
        ],
        tasks: [
          {
            description: 'Create a function that takes year, month (1-12), day and returns formatted as "YYYY-MM-DD"',
            testCases: [
              {
                input: [
                  2024,
                  1,
                  15
                ],
                expectedOutput: '2024-01-15'
              },
              {
                input: [
                  2023,
                  12,
                  25
                ],
                expectedOutput: '2023-12-25'
              },
              {
                input: [
                  2000,
                  6,
                  1
                ],
                expectedOutput: '2000-06-01'
              },
              {
                input: [
                  1999,
                  10,
                  31
                ],
                expectedOutput: '1999-10-31'
              },
              {
                input: [
                  2024,
                  2,
                  29
                ],
                expectedOutput: '2024-02-29'
              }
            ]
          },
          {
            description: 'Create a function that takes a date string and returns the day of the week (Sunday, Monday, etc.)',
            testCases: [
              {
                input: [
                  '2024-01-01'
                ],
                expectedOutput: 'Monday'
              },
              {
                input: [
                  '2024-01-07'
                ],
                expectedOutput: 'Sunday'
              },
              {
                input: [
                  '2024-12-25'
                ],
                expectedOutput: 'Wednesday'
              },
              {
                input: [
                  '2000-01-01'
                ],
                expectedOutput: 'Saturday'
              },
              {
                input: [
                  '2024-07-04'
                ],
                expectedOutput: 'Thursday'
              }
            ]
          },
          {
            description: 'Create a function that calculates the number of days between two date strings',
            testCases: [
              {
                input: [
                  '2024-01-01',
                  '2024-01-10'
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  '2024-01-01',
                  '2024-01-01'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  '2024-01-01',
                  '2024-02-01'
                ],
                expectedOutput: '31'
              },
              {
                input: [
                  '2024-01-10',
                  '2024-01-01'
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  '2023-12-25',
                  '2024-01-01'
                ],
                expectedOutput: '7'
              }
            ]
          },
          {
            description: 'Create a function that adds a given number of days to a date string and returns the new date as "YYYY-MM-DD"',
            testCases: [
              {
                input: [
                  '2024-01-01',
                  10
                ],
                expectedOutput: '2024-01-11'
              },
              {
                input: [
                  '2024-01-31',
                  1
                ],
                expectedOutput: '2024-02-01'
              },
              {
                input: [
                  '2024-12-31',
                  1
                ],
                expectedOutput: '2025-01-01'
              },
              {
                input: [
                  '2024-02-28',
                  1
                ],
                expectedOutput: '2024-02-29'
              },
              {
                input: [
                  '2024-01-15',
                  0
                ],
                expectedOutput: '2024-01-15'
              }
            ]
          },
          {
            description: 'Create a function that checks if a given year is a leap year',
            testCases: [
              {
                input: [
                  2024
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  2023
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  2000
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  1900
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  2020
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that returns the number of days in a given month (1-12) and year',
            testCases: [
              {
                input: [
                  2024,
                  2
                ],
                expectedOutput: '29'
              },
              {
                input: [
                  2023,
                  2
                ],
                expectedOutput: '28'
              },
              {
                input: [
                  2024,
                  1
                ],
                expectedOutput: '31'
              },
              {
                input: [
                  2024,
                  4
                ],
                expectedOutput: '30'
              },
              {
                input: [
                  2024,
                  12
                ],
                expectedOutput: '31'
              }
            ]
          },
          {
            description: 'Create a function that takes two date strings and returns which one is earlier (return the earlier date string)',
            testCases: [
              {
                input: [
                  '2024-01-15',
                  '2024-01-10'
                ],
                expectedOutput: '2024-01-10'
              },
              {
                input: [
                  '2023-06-01',
                  '2024-01-01'
                ],
                expectedOutput: '2023-06-01'
              },
              {
                input: [
                  '2024-12-31',
                  '2024-01-01'
                ],
                expectedOutput: '2024-01-01'
              },
              {
                input: [
                  '2020-01-01',
                  '2020-01-01'
                ],
                expectedOutput: '2020-01-01'
              },
              {
                input: [
                  '1999-12-31',
                  '2000-01-01'
                ],
                expectedOutput: '1999-12-31'
              }
            ]
          },
          {
            description: 'Create a function that extracts year, month, and day from a date string and returns as "Day: X, Month: Y, Year: Z"',
            testCases: [
              {
                input: [
                  '2024-03-15'
                ],
                expectedOutput: 'Day: 15, Month: 3, Year: 2024'
              },
              {
                input: [
                  '2000-01-01'
                ],
                expectedOutput: 'Day: 1, Month: 1, Year: 2000'
              },
              {
                input: [
                  '1999-12-31'
                ],
                expectedOutput: 'Day: 31, Month: 12, Year: 1999'
              },
              {
                input: [
                  '2024-07-04'
                ],
                expectedOutput: 'Day: 4, Month: 7, Year: 2024'
              },
              {
                input: [
                  '2024-11-28'
                ],
                expectedOutput: 'Day: 28, Month: 11, Year: 2024'
              }
            ]
          }
        ]
      },
      {
        id: 'type-coercion',
        title: 'Type conversion in JavaScript',
        outcomes: [
          'what_is_coercion',
          'implicit_vs_explicit',
          'string_coercion',
          'number_coercion',
          'boolean_coercion',
          'truthy_falsy',
          'equality_coercion',
          'plus_operator_coercion',
          'other_operators_coercion',
          'comparison_coercion',
          'NaN_behavior',
          'avoid_implicit_coercion'
        ],
        tasks: [
          {
            description: 'Create a function that converts any value to a string using explicit conversion',
            testCases: [
              {
                input: [
                  123
                ],
                expectedOutput: '123'
              },
              {
                input: [
                  true
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  null
                ],
                expectedOutput: 'null'
              },
              {
                input: [
                  null
                ],
                expectedOutput: 'undefined'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '1,2,3'
              }
            ]
          },
          {
            description: 'Create a function that converts a string to a number, returning 0 if conversion fails',
            testCases: [
              {
                input: [
                  '123'
                ],
                expectedOutput: '123'
              },
              {
                input: [
                  '45.67'
                ],
                expectedOutput: '45.67'
              },
              {
                input: [
                  'abc'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  '  42  '
                ],
                expectedOutput: '42'
              }
            ]
          },
          {
            description: 'Create a function that returns whether a value is truthy or falsy (return "truthy" or "falsy")',
            testCases: [
              {
                input: [
                  0
                ],
                expectedOutput: 'falsy'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'falsy'
              },
              {
                input: [
                  null
                ],
                expectedOutput: 'falsy'
              },
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'truthy'
              },
              {
                input: [
                  1
                ],
                expectedOutput: 'truthy'
              }
            ]
          },
          {
            description: 'Create a function that compares two values using strict equality (===) and returns true/false',
            testCases: [
              {
                input: [
                  5,
                  '5'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  5,
                  5
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  null,
                  null
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  true,
                  1
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'hello',
                  'hello'
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that demonstrates + operator behavior: if either is string, concatenate; otherwise add',
            testCases: [
              {
                input: [
                  5,
                  '3'
                ],
                expectedOutput: '53'
              },
              {
                input: [
                  5,
                  3
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  'hello',
                  'world'
                ],
                expectedOutput: 'helloworld'
              },
              {
                input: [
                  '',
                  5
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  true,
                  1
                ],
                expectedOutput: '2'
              }
            ]
          },
          {
            description: 'Create a function that safely parses an integer from a string, returning null if invalid',
            testCases: [
              {
                input: [
                  '42'
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  '42px'
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  'abc'
                ],
                expectedOutput: 'null'
              },
              {
                input: [
                  '3.14'
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'null'
              }
            ]
          },
          {
            description: 'Create a function that counts how many truthy values are in an array',
            testCases: [
              {
                input: [
                  [
                    1,
                    0,
                    'hello',
                    '',
                    null,
                    true
                  ]
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  [
                    false,
                    0,
                    '',
                    null,
                    null
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    '',
                    0,
                    false,
                    'a'
                  ]
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create a function that converts a value to boolean and returns "yes" if true, "no" if false',
            testCases: [
              {
                input: [
                  1
                ],
                expectedOutput: 'yes'
              },
              {
                input: [
                  0
                ],
                expectedOutput: 'no'
              },
              {
                input: [
                  'text'
                ],
                expectedOutput: 'yes'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'no'
              },
              {
                input: [
                  null
                ],
                expectedOutput: 'no'
              }
            ]
          }
        ]
      },
      {
        id: 'math-object',
        title: 'Built-in math utilities',
        outcomes: [
          'what_is_math_object',
          'math_round',
          'math_floor_ceil',
          'math_trunc',
          'math_abs',
          'math_pow_sqrt',
          'math_min_max',
          'math_random',
          'random_range',
          'math_constants'
        ],
        tasks: [
          {
            description: 'The number is 7.6. Print the result of rounding it normally, rounding down, and rounding up (each on a separate line)',
            testCases: [
              {
                input: null,
                expectedOutput: '8\n7\n8'
              }
            ]
          },
          {
            description: 'The number is -15. Print its absolute value',
            testCases: [
              {
                input: null,
                expectedOutput: '15'
              }
            ]
          },
          {
            description: 'Calculate and print 2 raised to the power of 8',
            testCases: [
              {
                input: null,
                expectedOutput: '256'
              }
            ]
          },
          {
            description: 'The number is 144. Print its square root',
            testCases: [
              {
                input: null,
                expectedOutput: '12'
              }
            ]
          },
          {
            description: 'Given the numbers 45, 12, 78, 23, 56, print the minimum on the first line and maximum on the second line',
            testCases: [
              {
                input: null,
                expectedOutput: '12\n78'
              }
            ]
          },
          {
            description: 'The decimal number is 9.87. Print the result of truncating it (removing decimal without rounding)',
            testCases: [
              {
                input: null,
                expectedOutput: '9'
              }
            ]
          },
          {
            description: 'Calculate the area of a circle with radius 7. Use Math.PI. Print the result rounded to 2 decimal places (multiply by 100, round, divide by 100)',
            testCases: [
              {
                input: null,
                expectedOutput: '153.94'
              }
            ]
          },
          {
            description: 'Print the value of Math.PI rounded to 4 decimal places',
            testCases: [
              {
                input: null,
                expectedOutput: '3.1416'
              }
            ]
          }
        ]
      },
      {
        id: 'operators',
        title: 'Operators',
        outcomes: [
          'increment_decrement',
          'compound_assignment',
          'boolean_type',
          'negation',
          'relational_operators',
          'equality_operators',
          'comparisons_return_boolean',
          'and_operator',
          'or_operator',
          'combining_conditions'
        ],
        tasks: [
          {
            description: 'A game score starts at 0. Player earns 100, then earns 50 more, then loses 30, then doubles their score. Print the final score',
            testCases: [
              {
                input: null,
                expectedOutput: '240'
              }
            ]
          },
          {
            description: 'Check loan eligibility. Age is 28, income is 55000, credit score is 720. Requirements: age between 21-60, income >= 30000, credit >= 700. Print whether each requirement passes (3 lines), then whether ALL pass',
            testCases: [
              {
                input: null,
                expectedOutput: 'true\ntrue\ntrue\ntrue'
              }
            ]
          },
          {
            description: 'Movie ticket: customer age is 15. Child discount is age < 12, senior discount is age >= 65, regular price is neither. Print whether each applies (3 lines: child, senior, regular)',
            testCases: [
              {
                input: null,
                expectedOutput: 'false\nfalse\ntrue'
              }
            ]
          },
          {
            description: 'Analyze the number 156. Print whether it is positive, whether it is even, whether it is a three-digit number (100-999), and whether ALL three are true (4 lines)',
            testCases: [
              {
                input: null,
                expectedOutput: 'true\ntrue\ntrue\ntrue'
              }
            ]
          }
        ]
      },
      {
        id: 'if-statements',
        title: 'if statements',
        outcomes: [
          'if_syntax',
          'code_block',
          'condition_evaluation',
          'truthy_execution'
        ],
        tasks: [
          {
            description: 'The number is 42. If it equals 42, print "The answer"',
            testCases: [
              {
                input: null,
                expectedOutput: 'The answer'
              }
            ]
          },
          {
            description: 'The number is 15. If it is divisible by 5 (remainder is 0), print "Multiple of 5"',
            testCases: [
              {
                input: null,
                expectedOutput: 'Multiple of 5'
              }
            ]
          },
          {
            description: 'Age is 25 and hasID is true. If age >= 18 AND hasID is true, print "Entry allowed"',
            testCases: [
              {
                input: null,
                expectedOutput: 'Entry allowed'
              }
            ]
          }
        ]
      },
      {
        id: 'if-else',
        title: 'if-else statements',
        outcomes: [
          'else_block',
          'two_way_decision',
          'mutually_exclusive'
        ],
        tasks: [
          {
            description: 'The number is 17. Print "Even" if divisible by 2, otherwise print "Odd"',
            testCases: [
              {
                input: null,
                expectedOutput: 'Odd'
              }
            ]
          },
          {
            description: 'Score is 58. Print "Pass" if 60 or above, otherwise print "Fail"',
            testCases: [
              {
                input: null,
                expectedOutput: 'Fail'
              }
            ]
          },
          {
            description: 'Balance is 500, withdrawal is 300. If balance covers the withdrawal, print remaining balance. Otherwise print "Insufficient funds"',
            testCases: [
              {
                input: null,
                expectedOutput: '200'
              }
            ]
          }
        ]
      },
      {
        id: 'else-if-chains',
        title: 'else-if chains',
        outcomes: [
          'else_if_syntax',
          'multiple_conditions',
          'final_else',
          'order_matters'
        ],
        tasks: [
          {
            description: 'Score is 73. Print the grade: A (90+), B (80-89), C (70-79), D (60-69), F (below 60)',
            testCases: [
              {
                input: null,
                expectedOutput: 'C'
              }
            ]
          },
          {
            description: 'Age is 45. Print the category: Child (0-12), Teen (13-19), Adult (20-59), Senior (60+)',
            testCases: [
              {
                input: null,
                expectedOutput: 'Adult'
              }
            ]
          },
          {
            description: 'Temperature is 28°C. Print: Freezing (below 0), Cold (0-14), Warm (15-29), Hot (30+)',
            testCases: [
              {
                input: null,
                expectedOutput: 'Warm'
              }
            ]
          },
          {
            description: 'Hour is 14 (24-hour format). Print greeting: Good morning (5-11), Good afternoon (12-17), Good evening (18-21), Good night (others)',
            testCases: [
              {
                input: null,
                expectedOutput: 'Good afternoon'
              }
            ]
          }
        ]
      },
      {
        id: 'nested-conditions',
        title: 'Nested conditions',
        outcomes: [
          'nested_if',
          'inner_outer_flow',
          'complex_logic'
        ],
        tasks: [
          {
            description: 'Login check: userExists is true, passwordCorrect is true. First check if user exists, then check password. Print "Login successful", "Wrong password", or "User not found"',
            testCases: [
              {
                input: null,
                expectedOutput: 'Login successful'
              }
            ]
          },
          {
            description: 'Driving check: age is 25, hasLicense is true. First check if age >= 18, then check license. Print "Can drive", "Need license", or "Too young"',
            testCases: [
              {
                input: null,
                expectedOutput: 'Can drive'
              }
            ]
          },
          {
            description: 'Number is -15. First check if positive or negative, then check even or odd. Print the combined result (e.g., "Positive Even", "Negative Odd")',
            testCases: [
              {
                input: null,
                expectedOutput: 'Negative Odd'
              }
            ]
          }
        ]
      },
      {
        id: 'while-loops',
        title: 'while loops',
        outcomes: [
          'while_syntax',
          'loop_condition',
          'counter_pattern',
          'loop_termination',
          'infinite_loop_risk'
        ],
        tasks: [
          {
            description: 'Print numbers from 1 to 10, each on a new line',
            testCases: [
              {
                input: null,
                expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10'
              }
            ]
          },
          {
            description: 'Start with 5. Keep doubling and printing until the value exceeds 100',
            testCases: [
              {
                input: null,
                expectedOutput: '5\n10\n20\n40\n80\n160'
              }
            ]
          },
          {
            description: 'Calculate and print the sum of all numbers from 1 to 50',
            testCases: [
              {
                input: null,
                expectedOutput: '1275'
              }
            ]
          },
          {
            description: 'Print the multiplication results of 7 (7×1 through 7×10), each result on a new line',
            testCases: [
              {
                input: null,
                expectedOutput: '7\n14\n21\n28\n35\n42\n49\n56\n63\n70'
              }
            ]
          }
        ]
      },
      {
        id: 'for-loops',
        title: 'for loops',
        outcomes: [
          'for_syntax',
          'initialization',
          'condition_check',
          'update_expression',
          'for_vs_while'
        ],
        tasks: [
          {
            description: 'Print all even numbers from 2 to 20, each on a new line',
            testCases: [
              {
                input: null,
                expectedOutput: '2\n4\n6\n8\n10\n12\n14\n16\n18\n20'
              }
            ]
          },
          {
            description: 'Calculate and print 6 factorial (6! = 6 × 5 × 4 × 3 × 2 × 1)',
            testCases: [
              {
                input: null,
                expectedOutput: '720'
              }
            ]
          },
          {
            description: 'Print a countdown from 20 to 1, each number on a new line',
            testCases: [
              {
                input: null,
                expectedOutput: '20\n19\n18\n17\n16\n15\n14\n13\n12\n11\n10\n9\n8\n7\n6\n5\n4\n3\n2\n1'
              }
            ]
          },
          {
            description: 'Calculate and print the sum of all odd numbers from 1 to 100',
            testCases: [
              {
                input: null,
                expectedOutput: '2500'
              }
            ]
          }
        ]
      },
      {
        id: 'loop-control',
        title: 'Loop control (break, continue)',
        outcomes: [
          'break_statement',
          'continue_statement',
          'early_termination',
          'skip_iterations'
        ],
        tasks: [
          {
            description: 'Find the first number between 50 and 100 that is divisible by 7. Print it and stop searching',
            testCases: [
              {
                input: null,
                expectedOutput: '56'
              }
            ]
          },
          {
            description: 'Print numbers from 1 to 30, but skip all multiples of 4',
            testCases: [
              {
                input: null,
                expectedOutput: '1\n2\n3\n5\n6\n7\n9\n10\n11\n13\n14\n15\n17\n18\n19\n21\n22\n23\n25\n26\n27\n29\n30'
              }
            ]
          },
          {
            description: 'Add numbers starting from 1 until the sum exceeds 200. Print the final sum, then print how many numbers were added',
            testCases: [
              {
                input: null,
                expectedOutput: '210\n20'
              }
            ]
          }
        ]
      },
      {
        id: 'nested-loops',
        title: 'Nested loops',
        outcomes: [
          'nested_loop_syntax',
          'inner_outer_execution',
          'total_iterations',
          'pattern_printing'
        ],
        tasks: [
          {
            description: 'Print a right triangle of asterisks with 5 rows. Row 1 has 1 star, row 2 has 2 stars, and so on',
            testCases: [
              {
                input: null,
                expectedOutput: '*\n**\n***\n****\n*****'
              }
            ]
          },
          {
            description: 'Print a grid with 4 rows and 6 columns. Each cell shows row × column, columns separated by spaces',
            testCases: [
              {
                input: null,
                expectedOutput: '1 2 3 4 5 6\n2 4 6 8 10 12\n3 6 9 12 15 18\n4 8 12 16 20 24'
              }
            ]
          },
          {
            description: 'Print all coordinate pairs where row goes 1 to 3 and column goes 1 to 4. Format: "row,column" each on a new line',
            testCases: [
              {
                input: null,
                expectedOutput: '1,1\n1,2\n1,3\n1,4\n2,1\n2,2\n2,3\n2,4\n3,1\n3,2\n3,3\n3,4'
              }
            ]
          }
        ]
      },
      {
        id: 'arrays',
        title: 'Arrays',
        outcomes: [
          'creating_arrays',
          'array_indexing',
          'array_length',
          'last_element_access',
          'modifying_elements',
          'iterating_with_loops',
          'accumulator_pattern',
          'search_pattern'
        ],
        tasks: [
          {
            description: 'Numbers are [10, 25, 8, 17, 42, 3]. Print the first element, last element, and total count on separate lines',
            testCases: [
              {
                input: null,
                expectedOutput: '10\n3\n6'
              }
            ]
          },
          {
            description: 'Numbers are [4, 9, 2, 7, 5, 1, 8, 3]. Calculate and print the sum of all elements',
            testCases: [
              {
                input: null,
                expectedOutput: '39'
              }
            ]
          },
          {
            description: 'Numbers are [23, 67, 12, 89, 45, 34, 91, 56]. Find and print the largest number',
            testCases: [
              {
                input: null,
                expectedOutput: '91'
              }
            ]
          },
          {
            description: 'Numbers are [3, 8, 12, 5, 17, 9, 14, 6, 11]. Count and print how many numbers are greater than 10',
            testCases: [
              {
                input: null,
                expectedOutput: '4'
              }
            ]
          },
          {
            description: 'Numbers are [7, 3, 9, 1, 5, 8, 2, 6, 4]. Find the smallest number and its position (index). Print the number first, then its index',
            testCases: [
              {
                input: null,
                expectedOutput: '1\n3'
              }
            ]
          },
          {
            description: 'Numbers are [15, 22, 8, 36, 14, 42, 19]. Calculate and print the average (sum divided by count)',
            testCases: [
              {
                input: null,
                expectedOutput: '22.285714285714285'
              }
            ]
          },
          {
            description: 'Numbers are [5, 12, 8, 19, 3, 15, 7, 22, 11]. Find the first number greater than 10 and print it. If none found, print -1',
            testCases: [
              {
                input: null,
                expectedOutput: '12'
              }
            ]
          },
          {
            description: 'Numbers are [4, 7, 2, 9, 1, 8, 5]. Print all elements in reverse order (last to first), each on a new line',
            testCases: [
              {
                input: null,
                expectedOutput: '5\n8\n1\n9\n2\n7\n4'
              }
            ]
          },
          {
            description: 'Numbers are [3, 7, 2, 8, 5, 9, 1, 6, 4]. Find both the largest and smallest numbers. Print the largest first, then the smallest, then their difference',
            testCases: [
              {
                input: null,
                expectedOutput: '9\n1\n8'
              }
            ]
          },
          {
            description: 'Numbers are [12, 5, 8, 19, 3, 15, 7, 22, 11, 6]. Count how many are even and how many are odd. Print even count first, then odd count',
            testCases: [
              {
                input: null,
                expectedOutput: '5\n5'
              }
            ]
          }
        ]
      },
      {
        id: 'functions',
        title: 'Functions',
        outcomes: [
          'function_declaration',
          'function_calling',
          'parameters',
          'arguments',
          'return_statement',
          'return_vs_print',
          'multiple_parameters',
          'function_naming',
          'reusability',
          'single_responsibility'
        ],
        tasks: [
          {
            description: 'Create a function that takes two numbers and returns their sum',
            testCases: [
              {
                input: [
                  5,
                  3
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  10,
                  20
                ],
                expectedOutput: '30'
              },
              {
                input: [
                  -5,
                  15
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  0,
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -5,
                  -3
                ],
                expectedOutput: '-8'
              },
              {
                input: [
                  5,
                  0
                ],
                expectedOutput: '5'
              }
            ]
          },
          {
            description: 'Create a function that takes a number and returns true if it is even, false otherwise',
            testCases: [
              {
                input: [
                  4
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  7
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  0
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  -6
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  -7
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  1
                ],
                expectedOutput: 'false'
              }
            ]
          },
          {
            description: 'Create a function that takes a number and returns its absolute value (positive version)',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  -8
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -100
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  -1
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create a function that takes three numbers and returns the largest one',
            testCases: [
              {
                input: [
                  5,
                  9,
                  3
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  9,
                  5,
                  3
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  3,
                  5,
                  9
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  10,
                  10,
                  5
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  -1,
                  -5,
                  -2
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  7,
                  7,
                  7
                ],
                expectedOutput: '7'
              },
              {
                input: [
                  0,
                  -5,
                  5
                ],
                expectedOutput: '5'
              }
            ]
          },
          {
            description: 'Create a function that takes a string and returns its length',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  'JavaScript'
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  'hello world'
                ],
                expectedOutput: '11'
              }
            ]
          },
          {
            description: 'Create a function that takes a number (1-7) and returns the day name (1=Monday, 7=Sunday). Return "Invalid" for other numbers',
            testCases: [
              {
                input: [
                  1
                ],
                expectedOutput: 'Monday'
              },
              {
                input: [
                  2
                ],
                expectedOutput: 'Tuesday'
              },
              {
                input: [
                  3
                ],
                expectedOutput: 'Wednesday'
              },
              {
                input: [
                  5
                ],
                expectedOutput: 'Friday'
              },
              {
                input: [
                  7
                ],
                expectedOutput: 'Sunday'
              },
              {
                input: [
                  0
                ],
                expectedOutput: 'Invalid'
              },
              {
                input: [
                  8
                ],
                expectedOutput: 'Invalid'
              },
              {
                input: [
                  -1
                ],
                expectedOutput: 'Invalid'
              }
            ]
          },
          {
            description: 'Create a function that takes a temperature in Celsius and returns it converted to Fahrenheit (formula: C × 9/5 + 32)',
            testCases: [
              {
                input: [
                  0
                ],
                expectedOutput: '32'
              },
              {
                input: [
                  100
                ],
                expectedOutput: '212'
              },
              {
                input: [
                  25
                ],
                expectedOutput: '77'
              },
              {
                input: [
                  -40
                ],
                expectedOutput: '-40'
              },
              {
                input: [
                  -10
                ],
                expectedOutput: '14'
              },
              {
                input: [
                  50
                ],
                expectedOutput: '122'
              }
            ]
          },
          {
            description: 'Create a function that takes two numbers and returns true if the first is divisible by the second, false otherwise',
            testCases: [
              {
                input: [
                  10,
                  5
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  10,
                  3
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  15,
                  5
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  7,
                  2
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  5,
                  5
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  7,
                  1
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  0,
                  5
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that takes a number and returns "positive", "negative", or "zero"',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: 'positive'
              },
              {
                input: [
                  -3
                ],
                expectedOutput: 'negative'
              },
              {
                input: [
                  0
                ],
                expectedOutput: 'zero'
              },
              {
                input: [
                  100
                ],
                expectedOutput: 'positive'
              },
              {
                input: [
                  -100
                ],
                expectedOutput: 'negative'
              },
              {
                input: [
                  1
                ],
                expectedOutput: 'positive'
              },
              {
                input: [
                  -1
                ],
                expectedOutput: 'negative'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns their sum',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5
                  ]
                ],
                expectedOutput: '15'
              },
              {
                input: [
                  [
                    10,
                    20,
                    30
                  ]
                ],
                expectedOutput: '60'
              },
              {
                input: [
                  [
                    -5,
                    5,
                    -10,
                    10
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    100
                  ]
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  [
                    -1,
                    -2,
                    -3
                  ]
                ],
                expectedOutput: '-6'
              },
              {
                input: [
                  [
                    0,
                    5,
                    0,
                    3
                  ]
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns the largest number',
            testCases: [
              {
                input: [
                  [
                    3,
                    7,
                    2,
                    9,
                    5
                  ]
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  [
                    -1,
                    -5,
                    -2
                  ]
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  [
                    42
                  ]
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  [
                    5,
                    5,
                    5,
                    5
                  ]
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  [
                    9,
                    3,
                    5,
                    2
                  ]
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  [
                    3,
                    5,
                    2,
                    9
                  ]
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  [
                    0,
                    -5,
                    -3
                  ]
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and a target number. Return true if the target exists in the array, false otherwise',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5
                  ],
                  3
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5
                  ],
                  6
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [
                    10,
                    20,
                    30
                  ],
                  20
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [],
                  5
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  1
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  3
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    0,
                    1,
                    2
                  ],
                  0
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    -1,
                    0,
                    1
                  ],
                  -1
                ],
                expectedOutput: 'true'
              }
            ]
          }
        ]
      },
      {
        id: 'recursion',
        title: 'Functions calling themselves',
        outcomes: [
          'what_is_recursion',
          'base_case',
          'recursive_case',
          'call_stack',
          'return_value_propagation',
          'breaking_down_problems',
          'recursion_vs_iteration',
          'stack_overflow',
          'tail_recursion'
        ],
        tasks: [
          {
            description: 'Create a function that returns the sum of numbers from 1 to n using recursion',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '15'
              },
              {
                input: [
                  1
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  10
                ],
                expectedOutput: '55'
              },
              {
                input: [
                  100
                ],
                expectedOutput: '5050'
              }
            ]
          },
          {
            description: 'Create a function that returns the factorial of n using recursion (0! = 1)',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '120'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  1
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  7
                ],
                expectedOutput: '5040'
              },
              {
                input: [
                  3
                ],
                expectedOutput: '6'
              }
            ]
          },
          {
            description: 'Create a function that returns the nth Fibonacci number using recursion (F(0)=0, F(1)=1)',
            testCases: [
              {
                input: [
                  6
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  1
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  10
                ],
                expectedOutput: '55'
              },
              {
                input: [
                  2
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create a function that returns the sum of all elements in an array using recursion',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    5
                  ]
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  [
                    -1,
                    0,
                    1
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    10,
                    20,
                    30
                  ]
                ],
                expectedOutput: '60'
              }
            ]
          },
          {
            description: 'Create a function that counts how many times a value appears in an array using recursion',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    1,
                    3,
                    1
                  ],
                  1
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  5
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [],
                  1
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    7,
                    7,
                    7
                  ],
                  7
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  [
                    1
                  ],
                  1
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create a function that reverses a string using recursion',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'olleh'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'a'
              },
              {
                input: [
                  'ab'
                ],
                expectedOutput: 'ba'
              },
              {
                input: [
                  '12345'
                ],
                expectedOutput: '54321'
              }
            ]
          },
          {
            description: 'Create a function that checks if a string is a palindrome using recursion',
            testCases: [
              {
                input: [
                  'racecar'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'abba'
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that returns the maximum value in an array using recursion',
            testCases: [
              {
                input: [
                  [
                    3,
                    1,
                    4,
                    1,
                    5
                  ]
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  [
                    1
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    -5,
                    -2,
                    -8
                  ]
                ],
                expectedOutput: '-2'
              },
              {
                input: [
                  [
                    10,
                    10,
                    10
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    1,
                    100,
                    50
                  ]
                ],
                expectedOutput: '100'
              }
            ]
          },
          {
            description: 'Create a function that raises a number to a power using recursion (handle power of 0)',
            testCases: [
              {
                input: [
                  2,
                  3
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  5,
                  0
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  3,
                  4
                ],
                expectedOutput: '81'
              },
              {
                input: [
                  10,
                  2
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  2,
                  10
                ],
                expectedOutput: '1024'
              }
            ]
          },
          {
            description: 'Create a function that flattens a nested array one level deep using recursion',
            testCases: [
              {
                input: [
                  [
                    [
                      1,
                      2
                    ],
                    [
                      3,
                      4
                    ]
                  ]
                ],
                expectedOutput: '1,2,3,4'
              },
              {
                input: [
                  [
                    1,
                    [
                      2,
                      3
                    ],
                    4
                  ]
                ],
                expectedOutput: '1,2,3,4'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    [
                      1
                    ]
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '1,2,3'
              }
            ]
          }
        ]
      },
      {
        id: 'foreach',
        title: 'forEach for iteration',
        outcomes: [
          'foreach_syntax',
          'callback_parameters',
          'no_return_value',
          'side_effects'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array and prints each element on a new line using forEach',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '1\n2\n3'
              },
              {
                input: [
                  [
                    'a',
                    'b',
                    'c'
                  ]
                ],
                expectedOutput: 'a\nb\nc'
              },
              {
                input: [
                  [
                    10
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array and prints each element with its index in format "index: element" using forEach',
            testCases: [
              {
                input: [
                  [
                    'a',
                    'b',
                    'c'
                  ]
                ],
                expectedOutput: '0: a\n1: b\n2: c'
              },
              {
                input: [
                  [
                    10,
                    20
                  ]
                ],
                expectedOutput: '0: 10\n1: 20'
              },
              {
                input: [
                  [
                    'only'
                  ]
                ],
                expectedOutput: '0: only'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns the sum using forEach (use an external variable to accumulate)',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5
                  ]
                ],
                expectedOutput: '15'
              },
              {
                input: [
                  [
                    10,
                    -5,
                    3
                  ]
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  [
                    100
                  ]
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns a count of how many are greater than 10 using forEach',
            testCases: [
              {
                input: [
                  [
                    5,
                    15,
                    8,
                    20,
                    3,
                    12
                  ]
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    100,
                    200,
                    300
                  ]
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              }
            ]
          }
        ]
      },
      {
        id: 'map',
        title: 'map for transformation',
        outcomes: [
          'map_syntax',
          'transformation',
          'same_length',
          'original_unchanged'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array of numbers and returns a new array with each number doubled',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '2,4,6,8'
              },
              {
                input: [
                  [
                    5,
                    10,
                    15
                  ]
                ],
                expectedOutput: '10,20,30'
              },
              {
                input: [
                  [
                    -2,
                    0,
                    2
                  ]
                ],
                expectedOutput: '-4,0,4'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns a new array with each number squared',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '1,4,9,16'
              },
              {
                input: [
                  [
                    5,
                    10
                  ]
                ],
                expectedOutput: '25,100'
              },
              {
                input: [
                  [
                    -3,
                    0,
                    3
                  ]
                ],
                expectedOutput: '9,0,9'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of strings and returns a new array with all strings in uppercase',
            testCases: [
              {
                input: [
                  [
                    'hello',
                    'world'
                  ]
                ],
                expectedOutput: 'HELLO,WORLD'
              },
              {
                input: [
                  [
                    'JavaScript',
                    'is',
                    'fun'
                  ]
                ],
                expectedOutput: 'JAVASCRIPT,IS,FUN'
              },
              {
                input: [
                  [
                    'ABC'
                  ]
                ],
                expectedOutput: 'ABC'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of strings and returns a new array containing the length of each string',
            testCases: [
              {
                input: [
                  [
                    'hello',
                    'world',
                    'hi'
                  ]
                ],
                expectedOutput: '5,5,2'
              },
              {
                input: [
                  [
                    'a',
                    'ab',
                    'abc'
                  ]
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  [
                    '',
                    'test'
                  ]
                ],
                expectedOutput: '0,4'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns a new array where each number is converted to "even" or "odd"',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: 'odd,even,odd,even'
              },
              {
                input: [
                  [
                    10,
                    15,
                    20
                  ]
                ],
                expectedOutput: 'even,odd,even'
              },
              {
                input: [
                  [
                    0
                  ]
                ],
                expectedOutput: 'even'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          }
        ]
      },
      {
        id: 'filter',
        title: 'filter for selection',
        outcomes: [
          'filter_syntax',
          'boolean_callback',
          'subset',
          'filter_original_unchanged'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array of numbers and returns only the even numbers',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                  ]
                ],
                expectedOutput: '2,4,6'
              },
              {
                input: [
                  [
                    10,
                    15,
                    20,
                    25
                  ]
                ],
                expectedOutput: '10,20'
              },
              {
                input: [
                  [
                    1,
                    3,
                    5
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and a threshold, returns numbers greater than the threshold',
            testCases: [
              {
                input: [
                  [
                    1,
                    5,
                    10,
                    15,
                    20
                  ],
                  10
                ],
                expectedOutput: '15,20'
              },
              {
                input: [
                  [
                    3,
                    7,
                    2,
                    9
                  ],
                  5
                ],
                expectedOutput: '7,9'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  10
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [],
                  5
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of strings and returns only strings longer than 3 characters',
            testCases: [
              {
                input: [
                  [
                    'hi',
                    'hello',
                    'hey',
                    'world'
                  ]
                ],
                expectedOutput: 'hello,world'
              },
              {
                input: [
                  [
                    'a',
                    'ab',
                    'abc',
                    'abcd'
                  ]
                ],
                expectedOutput: 'abcd'
              },
              {
                input: [
                  [
                    'no',
                    'ok'
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns only positive numbers',
            testCases: [
              {
                input: [
                  [
                    -3,
                    -1,
                    0,
                    1,
                    3
                  ]
                ],
                expectedOutput: '1,3'
              },
              {
                input: [
                  [
                    5,
                    -2,
                    8,
                    -4
                  ]
                ],
                expectedOutput: '5,8'
              },
              {
                input: [
                  [
                    -1,
                    -2,
                    -3
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    0
                  ]
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns numbers that are divisible by both 2 and 3',
            testCases: [
              {
                input: [
                  [
                    1,
                    6,
                    8,
                    12,
                    15,
                    18
                  ]
                ],
                expectedOutput: '6,12,18'
              },
              {
                input: [
                  [
                    2,
                    3,
                    4,
                    5
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    6,
                    12,
                    18,
                    24
                  ]
                ],
                expectedOutput: '6,12,18,24'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          }
        ]
      },
      {
        id: 'find-findindex',
        title: 'find and findIndex',
        outcomes: [
          'find_syntax',
          'findIndex_syntax',
          'returns_undefined',
          'returns_negative_one',
          'stops_early'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array of numbers and returns the first even number, or undefined if none exists',
            testCases: [
              {
                input: [
                  [
                    1,
                    3,
                    4,
                    6,
                    8
                  ]
                ],
                expectedOutput: '4'
              },
              {
                input: [
                  [
                    2,
                    4,
                    6
                  ]
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [
                    1,
                    3,
                    5,
                    7
                  ]
                ],
                expectedOutput: 'undefined'
              },
              {
                input: [
                  []
                ],
                expectedOutput: 'undefined'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns the index of the first negative number, or -1 if none exists',
            testCases: [
              {
                input: [
                  [
                    5,
                    3,
                    -2,
                    8,
                    -4
                  ]
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [
                    -1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '-1'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and a target, returns the first number greater than target or undefined',
            testCases: [
              {
                input: [
                  [
                    1,
                    5,
                    10,
                    15
                  ],
                  8
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    2,
                    4,
                    6
                  ],
                  10
                ],
                expectedOutput: 'undefined'
              },
              {
                input: [
                  [
                    100,
                    200
                  ],
                  50
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  [],
                  5
                ],
                expectedOutput: 'undefined'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of strings and returns the index of the first string starting with "a" (case-insensitive), or -1',
            testCases: [
              {
                input: [
                  [
                    'banana',
                    'Apple',
                    'cherry'
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    'apple',
                    'apricot'
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    'banana',
                    'cherry'
                  ]
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '-1'
              }
            ]
          }
        ]
      },
      {
        id: 'some-every',
        title: 'some and every',
        outcomes: [
          'some_syntax',
          'every_syntax',
          'short_circuit',
          'empty_array_behavior'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array of numbers and returns true if any number is negative',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    -3,
                    4
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [
                    -1
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  []
                ],
                expectedOutput: 'false'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns true if all numbers are positive',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    1,
                    2,
                    -3,
                    4
                  ]
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [
                    0,
                    1,
                    2
                  ]
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  []
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns true if any number is divisible by 5',
            testCases: [
              {
                input: [
                  [
                    3,
                    7,
                    10,
                    12
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [
                    5
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  []
                ],
                expectedOutput: 'false'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of strings and returns true if all strings have length greater than 2',
            testCases: [
              {
                input: [
                  [
                    'hello',
                    'world',
                    'hey'
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    'hi',
                    'hello'
                  ]
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [
                    'abc'
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  []
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns true if all numbers are even',
            testCases: [
              {
                input: [
                  [
                    2,
                    4,
                    6,
                    8
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    2,
                    4,
                    5,
                    8
                  ]
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [
                    0
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  []
                ],
                expectedOutput: 'true'
              }
            ]
          }
        ]
      },
      {
        id: 'reduce',
        title: 'reduce for accumulation',
        outcomes: [
          'reduce_syntax',
          'accumulator',
          'current_value',
          'initial_value',
          'versatility'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array of numbers and returns their sum using reduce',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5
                  ]
                ],
                expectedOutput: '15'
              },
              {
                input: [
                  [
                    10,
                    20,
                    30
                  ]
                ],
                expectedOutput: '60'
              },
              {
                input: [
                  [
                    -5,
                    5
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns their product using reduce',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '24'
              },
              {
                input: [
                  [
                    5,
                    5,
                    5
                  ]
                ],
                expectedOutput: '125'
              },
              {
                input: [
                  [
                    10
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns the maximum using reduce',
            testCases: [
              {
                input: [
                  [
                    3,
                    7,
                    2,
                    9,
                    5
                  ]
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  [
                    -1,
                    -5,
                    -2
                  ]
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  [
                    42
                  ]
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  [
                    5,
                    5,
                    5
                  ]
                ],
                expectedOutput: '5'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns count of even numbers using reduce',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                  ]
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  [
                    1,
                    3,
                    5
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    2,
                    4,
                    6
                  ]
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of strings and returns them joined with " - " separator using reduce',
            testCases: [
              {
                input: [
                  [
                    'a',
                    'b',
                    'c'
                  ]
                ],
                expectedOutput: 'a - b - c'
              },
              {
                input: [
                  [
                    'hello',
                    'world'
                  ]
                ],
                expectedOutput: 'hello - world'
              },
              {
                input: [
                  [
                    'single'
                  ]
                ],
                expectedOutput: 'single'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns an object with "sum" and "count" properties using reduce',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '{"sum":10,"count":4}'
              },
              {
                input: [
                  [
                    10,
                    20
                  ]
                ],
                expectedOutput: '{"sum":30,"count":2}'
              },
              {
                input: [
                  [
                    5
                  ]
                ],
                expectedOutput: '{"sum":5,"count":1}'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '{"sum":0,"count":0}'
              }
            ]
          }
        ]
      },
      {
        id: 'string-manipulations',
        title: 'Common string manipulations',
        outcomes: [
          'trim_method',
          'replace_method',
          'replaceAll_method',
          'repeat_method',
          'padStart_padEnd'
        ],
        tasks: [
          {
            description: 'Create a function that takes a string and returns it with leading and trailing whitespace removed',
            testCases: [
              {
                input: [
                  '  hello  '
                ],
                expectedOutput: 'hello'
              },
              {
                input: [
                  '   spaces   '
                ],
                expectedOutput: 'spaces'
              },
              {
                input: [
                  'no-spaces'
                ],
                expectedOutput: 'no-spaces'
              },
              {
                input: [
                  '  '
                ],
                expectedOutput: ''
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes a string and replaces all spaces with dashes',
            testCases: [
              {
                input: [
                  'hello world'
                ],
                expectedOutput: 'hello-world'
              },
              {
                input: [
                  'one two three'
                ],
                expectedOutput: 'one-two-three'
              },
              {
                input: [
                  'no spaces'
                ],
                expectedOutput: 'no-spaces'
              },
              {
                input: [
                  'nospace'
                ],
                expectedOutput: 'nospace'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes a string and a number n, returns the string repeated n times',
            testCases: [
              {
                input: [
                  'ab',
                  3
                ],
                expectedOutput: 'ababab'
              },
              {
                input: [
                  '*',
                  5
                ],
                expectedOutput: '*****'
              },
              {
                input: [
                  'hello',
                  1
                ],
                expectedOutput: 'hello'
              },
              {
                input: [
                  'x',
                  0
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes a number and pads it with leading zeros to make it 5 digits',
            testCases: [
              {
                input: [
                  42
                ],
                expectedOutput: '00042'
              },
              {
                input: [
                  123
                ],
                expectedOutput: '00123'
              },
              {
                input: [
                  12345
                ],
                expectedOutput: '12345'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '00000'
              },
              {
                input: [
                  999999
                ],
                expectedOutput: '999999'
              }
            ]
          },
          {
            description: 'Create a function that takes a string and returns it with first letter of each word capitalized',
            testCases: [
              {
                input: [
                  'hello world'
                ],
                expectedOutput: 'Hello World'
              },
              {
                input: [
                  'javascript is fun'
                ],
                expectedOutput: 'Javascript Is Fun'
              },
              {
                input: [
                  'ALREADY CAPS'
                ],
                expectedOutput: 'Already Caps'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'A'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          }
        ]
      },
      {
        id: 'split-join',
        title: 'split and join',
        outcomes: [
          'split_syntax',
          'join_syntax',
          'empty_separator',
          'round_trip',
          'no_separator_join'
        ],
        tasks: [
          {
            description: 'Create a function that takes a sentence and returns an array of words',
            testCases: [
              {
                input: [
                  'hello world'
                ],
                expectedOutput: 'hello,world'
              },
              {
                input: [
                  'one two three four'
                ],
                expectedOutput: 'one,two,three,four'
              },
              {
                input: [
                  'single'
                ],
                expectedOutput: 'single'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an array of words and returns them as a sentence (space-separated)',
            testCases: [
              {
                input: [
                  [
                    'hello',
                    'world'
                  ]
                ],
                expectedOutput: 'hello world'
              },
              {
                input: [
                  [
                    'JavaScript',
                    'is',
                    'awesome'
                  ]
                ],
                expectedOutput: 'JavaScript is awesome'
              },
              {
                input: [
                  [
                    'single'
                  ]
                ],
                expectedOutput: 'single'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes a string and returns it reversed',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'olleh'
              },
              {
                input: [
                  'JavaScript'
                ],
                expectedOutput: 'tpircSavaJ'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'a'
              },
              {
                input: [
                  'ab'
                ],
                expectedOutput: 'ba'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes a sentence and returns the number of words',
            testCases: [
              {
                input: [
                  'hello world'
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  'one two three four five'
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  'single'
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes a CSV string (comma-separated) and returns the values joined by " | "',
            testCases: [
              {
                input: [
                  'a,b,c'
                ],
                expectedOutput: 'a | b | c'
              },
              {
                input: [
                  'one,two'
                ],
                expectedOutput: 'one | two'
              },
              {
                input: [
                  'single'
                ],
                expectedOutput: 'single'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          }
        ]
      },
      {
        id: 'substring-slice',
        title: 'substring and slice',
        outcomes: [
          'slice_syntax',
          'substring_syntax',
          'negative_indices',
          'end_exclusive',
          'omit_end'
        ],
        tasks: [
          {
            description: 'Create a function that takes a string and returns the first 3 characters',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'hel'
              },
              {
                input: [
                  'JavaScript'
                ],
                expectedOutput: 'Jav'
              },
              {
                input: [
                  'ab'
                ],
                expectedOutput: 'ab'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'a'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes a string and returns the last 3 characters',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'llo'
              },
              {
                input: [
                  'JavaScript'
                ],
                expectedOutput: 'ipt'
              },
              {
                input: [
                  'ab'
                ],
                expectedOutput: 'ab'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'a'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes a string and returns it without the first and last characters',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'ell'
              },
              {
                input: [
                  'JavaScript'
                ],
                expectedOutput: 'avaScrip'
              },
              {
                input: [
                  'ab'
                ],
                expectedOutput: ''
              },
              {
                input: [
                  'abc'
                ],
                expectedOutput: 'b'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes a string and start/end indices, returns the substring between them',
            testCases: [
              {
                input: [
                  'hello world',
                  0,
                  5
                ],
                expectedOutput: 'hello'
              },
              {
                input: [
                  'hello world',
                  6,
                  11
                ],
                expectedOutput: 'world'
              },
              {
                input: [
                  'JavaScript',
                  4,
                  10
                ],
                expectedOutput: 'Script'
              },
              {
                input: [
                  'test',
                  1,
                  3
                ],
                expectedOutput: 'es'
              }
            ]
          },
          {
            description: 'Create a function that takes a string and returns the middle character(s) - one char if odd length, two if even',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'l'
              },
              {
                input: [
                  'test'
                ],
                expectedOutput: 'es'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'a'
              },
              {
                input: [
                  'ab'
                ],
                expectedOutput: 'ab'
              },
              {
                input: [
                  'abc'
                ],
                expectedOutput: 'b'
              }
            ]
          }
        ]
      },
      {
        id: 'string-searching',
        title: 'String searching and matching',
        outcomes: [
          'indexOf_method',
          'lastIndexOf_method',
          'includes_method',
          'startsWith_method',
          'endsWith_method'
        ],
        tasks: [
          {
            description: 'Create a function that takes a string and a search term, returns true if the string contains the term',
            testCases: [
              {
                input: [
                  'hello world',
                  'world'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'hello world',
                  'planet'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'JavaScript',
                  'Script'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  '',
                  'test'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'test',
                  ''
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that takes a string and a search term, returns the index of first occurrence or -1',
            testCases: [
              {
                input: [
                  'hello world',
                  'o'
                ],
                expectedOutput: '4'
              },
              {
                input: [
                  'hello world',
                  'world'
                ],
                expectedOutput: '6'
              },
              {
                input: [
                  'hello world',
                  'x'
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  'banana',
                  'a'
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  '',
                  'test'
                ],
                expectedOutput: '-1'
              }
            ]
          },
          {
            description: 'Create a function that takes a filename and returns true if it ends with ".js"',
            testCases: [
              {
                input: [
                  'app.js'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'index.html'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'script.min.js'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'js'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'false'
              }
            ]
          },
          {
            description: 'Create a function that takes a URL and returns true if it starts with "https://"',
            testCases: [
              {
                input: [
                  'https://example.com'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'http://example.com'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'https://'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'ftp://files.com'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'false'
              }
            ]
          },
          {
            description: 'Create a function that takes a string and a character, returns how many times the character appears',
            testCases: [
              {
                input: [
                  'hello',
                  'l'
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  'mississippi',
                  's'
                ],
                expectedOutput: '4'
              },
              {
                input: [
                  'test',
                  'x'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  'aaa',
                  'a'
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  '',
                  'a'
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes a string and a search term, returns the index of the last occurrence or -1',
            testCases: [
              {
                input: [
                  'hello world',
                  'o'
                ],
                expectedOutput: '7'
              },
              {
                input: [
                  'banana',
                  'a'
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  'hello',
                  'l'
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  'test',
                  'x'
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  '',
                  'a'
                ],
                expectedOutput: '-1'
              }
            ]
          }
        ]
      },
      {
        id: 'regex',
        title: 'Pattern matching',
        outcomes: [
          'what_is_regex',
          'regex_literal',
          'regex_constructor',
          'test_method',
          'match_method',
          'replace_with_regex',
          'character_classes',
          'special_characters',
          'quantifiers',
          'anchors',
          'global_flag',
          'case_insensitive_flag',
          'capture_groups',
          'exec_method'
        ],
        tasks: [
          {
            description: 'Create a function that checks if a string contains only digits using regex',
            testCases: [
              {
                input: [
                  '12345'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  '123abc'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  '0'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  '12 34'
                ],
                expectedOutput: 'false'
              }
            ]
          },
          {
            description: 'Create a function that counts how many times a pattern appears in a string (case insensitive)',
            testCases: [
              {
                input: [
                  'Hello hello HELLO',
                  'hello'
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  'abcabc',
                  'abc'
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  'test',
                  'xyz'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  '',
                  'a'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  'AaAaA',
                  'a'
                ],
                expectedOutput: '5'
              }
            ]
          },
          {
            description: 'Create a function that replaces all whitespace characters with a single dash',
            testCases: [
              {
                input: [
                  'hello world'
                ],
                expectedOutput: 'hello-world'
              },
              {
                input: [
                  'a  b  c'
                ],
                expectedOutput: 'a-b-c'
              },
              {
                input: [
                  'no spaces'
                ],
                expectedOutput: 'no-spaces'
              },
              {
                input: [
                  '   '
                ],
                expectedOutput: '-'
              },
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'hello'
              }
            ]
          },
          {
            description: 'Create a function that extracts all numbers from a string and returns them as an array',
            testCases: [
              {
                input: [
                  'abc123def456'
                ],
                expectedOutput: '123,456'
              },
              {
                input: [
                  'no numbers'
                ],
                expectedOutput: ''
              },
              {
                input: [
                  '12 34 56'
                ],
                expectedOutput: '12,34,56'
              },
              {
                input: [
                  'a1b2c3'
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  '100'
                ],
                expectedOutput: '100'
              }
            ]
          },
          {
            description: 'Create a function that validates if a string is a valid email format (simple: word@word.word)',
            testCases: [
              {
                input: [
                  'test@example.com'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'invalid'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'no@dot'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'a@b.c'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  '@test.com'
                ],
                expectedOutput: 'false'
              }
            ]
          },
          {
            description: 'Create a function that checks if a string starts with a capital letter',
            testCases: [
              {
                input: [
                  'Hello'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  '123abc'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'A'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'false'
              }
            ]
          },
          {
            description: 'Create a function that replaces all vowels with asterisks',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'h*ll*'
              },
              {
                input: [
                  'AEIOU'
                ],
                expectedOutput: '*****'
              },
              {
                input: [
                  'xyz'
                ],
                expectedOutput: 'xyz'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              },
              {
                input: [
                  'aEiOu'
                ],
                expectedOutput: '*****'
              }
            ]
          },
          {
            description: 'Create a function that extracts words that start with a capital letter from a string',
            testCases: [
              {
                input: [
                  'Hello World from JavaScript'
                ],
                expectedOutput: 'Hello,World,JavaScript'
              },
              {
                input: [
                  'no capitals here'
                ],
                expectedOutput: ''
              },
              {
                input: [
                  'One Two Three'
                ],
                expectedOutput: 'One,Two,Three'
              },
              {
                input: [
                  'ABC'
                ],
                expectedOutput: 'ABC'
              },
              {
                input: [
                  'aA bB cC'
                ],
                expectedOutput: ''
              }
            ]
          }
        ]
      },
      {
        id: 'objects',
        title: 'Objects',
        outcomes: [
          'object_literal_syntax',
          'property_access_dot',
          'property_access_bracket',
          'dynamic_keys',
          'adding_properties',
          'modifying_properties',
          'deleting_properties',
          'nested_objects',
          'object_methods',
          'this_keyword',
          'object_keys_values',
          'for_in_loop',
          'checking_properties'
        ],
        tasks: [
          {
            description: 'Create a function that takes a person object with name and age properties, returns a greeting like "Hello, I am {name} and I am {age} years old"',
            testCases: [
              {
                input: [
                  {
                    name: 'Alice',
                    age: 25
                  }
                ],
                expectedOutput: 'Hello, I am Alice and I am 25 years old'
              },
              {
                input: [
                  {
                    name: 'Bob',
                    age: 30
                  }
                ],
                expectedOutput: 'Hello, I am Bob and I am 30 years old'
              },
              {
                input: [
                  {
                    name: 'Charlie',
                    age: 0
                  }
                ],
                expectedOutput: 'Hello, I am Charlie and I am 0 years old'
              }
            ]
          },
          {
            description: 'Create a function that takes an object and a key name (string), returns the value at that key using bracket notation',
            testCases: [
              {
                input: [
                  {
                    name: 'Alice',
                    age: 25
                  },
                  'name'
                ],
                expectedOutput: 'Alice'
              },
              {
                input: [
                  {
                    x: 10,
                    y: 20
                  },
                  'y'
                ],
                expectedOutput: '20'
              },
              {
                input: [
                  {
                    a: 1
                  },
                  'b'
                ],
                expectedOutput: 'undefined'
              },
              {
                input: [
                  {},
                  'any'
                ],
                expectedOutput: 'undefined'
              }
            ]
          },
          {
            description: 'Create a function that takes an object and returns the number of properties it has',
            testCases: [
              {
                input: [
                  {
                    a: 1,
                    b: 2,
                    c: 3
                  }
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  {
                    name: 'test'
                  }
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  {}
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  {
                    x: 1,
                    y: 2,
                    z: 3,
                    w: 4
                  }
                ],
                expectedOutput: '4'
              }
            ]
          },
          {
            description: 'Create a function that takes an object and returns an array of its keys (as comma-separated string)',
            testCases: [
              {
                input: [
                  {
                    a: 1,
                    b: 2,
                    c: 3
                  }
                ],
                expectedOutput: 'a,b,c'
              },
              {
                input: [
                  {
                    name: 'Alice',
                    age: 25
                  }
                ],
                expectedOutput: 'name,age'
              },
              {
                input: [
                  {
                    single: 1
                  }
                ],
                expectedOutput: 'single'
              },
              {
                input: [
                  {}
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an object and returns an array of its values (as comma-separated string)',
            testCases: [
              {
                input: [
                  {
                    a: 1,
                    b: 2,
                    c: 3
                  }
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  {
                    name: 'Alice',
                    age: 25
                  }
                ],
                expectedOutput: 'Alice,25'
              },
              {
                input: [
                  {
                    single: 100
                  }
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  {}
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that takes an object and a key, returns true if the key exists in the object, false otherwise',
            testCases: [
              {
                input: [
                  {
                    name: 'Alice',
                    age: 25
                  },
                  'name'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  {
                    name: 'Alice',
                    age: 25
                  },
                  'email'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  {},
                  'any'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  {},
                  'a'
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that takes an object with numeric values and returns the sum of all values',
            testCases: [
              {
                input: [
                  {
                    a: 10,
                    b: 20,
                    c: 30
                  }
                ],
                expectedOutput: '60'
              },
              {
                input: [
                  {
                    x: 5
                  }
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  {
                    p: -10,
                    q: 10
                  }
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  {}
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes a nested object like { person: { name: "Alice", address: { city: "NYC" } } } and a path like "person.address.city", returns the value at that path',
            testCases: [
              {
                input: [
                  {
                    person: {
                      name: 'Alice'
                    }
                  },
                  'person.name'
                ],
                expectedOutput: 'Alice'
              },
              {
                input: [
                  {
                    a: {
                      b: {
                        c: 42
                      }
                    }
                  },
                  'a.b.c'
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  {
                    x: 10
                  },
                  'x'
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  {
                    a: {
                      b: 1
                    }
                  },
                  'a.c'
                ],
                expectedOutput: 'undefined'
              }
            ]
          },
          {
            description: 'Create a function that takes an object with numeric values and returns a new object with all values doubled',
            testCases: [
              {
                input: [
                  {
                    a: 1,
                    b: 2,
                    c: 3
                  }
                ],
                expectedOutput: '{"a":2,"b":4,"c":6}'
              },
              {
                input: [
                  {
                    x: 10,
                    y: 5
                  }
                ],
                expectedOutput: '{"x":20,"y":10}'
              },
              {
                input: [
                  {
                    single: 50
                  }
                ],
                expectedOutput: '{"single":100}'
              },
              {
                input: [
                  {}
                ],
                expectedOutput: '{}'
              }
            ]
          },
          {
            description: 'Create a function that takes an object and a minimum value, returns a new object containing only properties where value >= minimum',
            testCases: [
              {
                input: [
                  {
                    a: 10,
                    b: 5,
                    c: 15,
                    d: 3
                  },
                  10
                ],
                expectedOutput: '{"a":10,"c":15}'
              },
              {
                input: [
                  {
                    x: 100,
                    y: 50
                  },
                  60
                ],
                expectedOutput: '{"x":100}'
              },
              {
                input: [
                  {
                    a: 1,
                    b: 2
                  },
                  10
                ],
                expectedOutput: '{}'
              },
              {
                input: [
                  {},
                  5
                ],
                expectedOutput: '{}'
              }
            ]
          },
          {
            description: 'Create a function that takes two objects and returns a merged object (second object properties override first)',
            testCases: [
              {
                input: [
                  {
                    a: 1,
                    b: 2
                  },
                  {
                    b: 3,
                    c: 4
                  }
                ],
                expectedOutput: '{"a":1,"b":3,"c":4}'
              },
              {
                input: [
                  {
                    x: 10
                  },
                  {
                    y: 20
                  }
                ],
                expectedOutput: '{"x":10,"y":20}'
              },
              {
                input: [
                  {},
                  {
                    a: 1
                  }
                ],
                expectedOutput: '{"a":1}'
              },
              {
                input: [
                  {
                    a: 1
                  },
                  {}
                ],
                expectedOutput: '{"a":1}'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of objects with "name" and "score" properties, returns the name of the person with the highest score',
            testCases: [
              {
                input: [
                  [
                    {
                      name: 'Alice',
                      score: 85
                    },
                    {
                      name: 'Bob',
                      score: 92
                    },
                    {
                      name: 'Charlie',
                      score: 78
                    }
                  ]
                ],
                expectedOutput: 'Bob'
              },
              {
                input: [
                  [
                    {
                      name: 'Single',
                      score: 100
                    }
                  ]
                ],
                expectedOutput: 'Single'
              },
              {
                input: [
                  [
                    {
                      name: 'A',
                      score: 50
                    },
                    {
                      name: 'B',
                      score: 50
                    }
                  ]
                ],
                expectedOutput: 'A'
              },
              {
                input: [
                  [
                    {
                      name: 'Low',
                      score: 10
                    },
                    {
                      name: 'High',
                      score: 99
                    }
                  ]
                ],
                expectedOutput: 'High'
              }
            ]
          }
        ]
      },
      {
        id: 'json',
        title: 'Data serialization',
        outcomes: [
          'what_is_json',
          'json_syntax',
          'json_stringify',
          'json_parse',
          'stringify_spacing',
          'stringify_replacer',
          'parse_reviver',
          'json_limitations',
          'deep_clone_with_json',
          'json_vs_object_literal'
        ],
        tasks: [
          {
            description: 'Create a function that converts an object to a JSON string',
            testCases: [
              {
                input: [
                  {
                    name: 'Alice',
                    age: 25
                  }
                ],
                expectedOutput: '{"name":"Alice","age":25}'
              },
              {
                input: [
                  {
                    x: 1,
                    y: 2
                  }
                ],
                expectedOutput: '{"x":1,"y":2}'
              },
              {
                input: [
                  {}
                ],
                expectedOutput: '{}'
              },
              {
                input: [
                  {
                    active: true
                  }
                ],
                expectedOutput: '{"active":true}'
              },
              {
                input: [
                  {
                    items: [
                      1,
                      2,
                      3
                    ]
                  }
                ],
                expectedOutput: '{"items":[1,2,3]}'
              }
            ]
          },
          {
            description: 'Create a function that parses a JSON string and returns the value of a specific key',
            testCases: [
              {
                input: [
                  '{"name":"Bob","age":30}',
                  'name'
                ],
                expectedOutput: 'Bob'
              },
              {
                input: [
                  '{"x":100,"y":200}',
                  'y'
                ],
                expectedOutput: '200'
              },
              {
                input: [
                  '{"active":true}',
                  'active'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  '{"data":null}',
                  'data'
                ],
                expectedOutput: 'null'
              },
              {
                input: [
                  '{"missing":"value"}',
                  'other'
                ],
                expectedOutput: 'undefined'
              }
            ]
          },
          {
            description: 'Create a function that pretty prints an object as JSON with 2-space indentation (return the string)',
            testCases: [
              {
                input: [
                  {
                    a: 1
                  }
                ],
                expectedOutput: '{\n  "a": 1\n}'
              },
              {
                input: [
                  {
                    x: 1,
                    y: 2
                  }
                ],
                expectedOutput: '{\n  "x": 1,\n  "y": 2\n}'
              },
              {
                input: [
                  {}
                ],
                expectedOutput: '{}'
              },
              {
                input: [
                  {
                    name: 'test'
                  }
                ],
                expectedOutput: '{\n  "name": "test"\n}'
              },
              {
                input: [
                  {
                    arr: [
                      1
                    ]
                  }
                ],
                expectedOutput: '{\n  "arr": [\n    1\n  ]\n}'
              }
            ]
          },
          {
            description: 'Create a function that deep clones an object using JSON methods',
            testCases: [
              {
                input: [
                  {
                    a: 1,
                    b: {
                      c: 2
                    }
                  }
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  {
                    arr: [
                      1,
                      2,
                      3
                    ]
                  }
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  {
                    x: {
                      y: {
                        z: 1
                      }
                    }
                  }
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  {}
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  {
                    data: [
                      1,
                      {
                        nested: true
                      }
                    ]
                  }
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that converts a JSON string to an object and returns the count of keys',
            testCases: [
              {
                input: [
                  '{"a":1,"b":2,"c":3}'
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  '{}'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  '{"single":1}'
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  '{"x":1,"y":2}'
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  '{"a":1,"b":2,"c":3,"d":4,"e":5}'
                ],
                expectedOutput: '5'
              }
            ]
          },
          {
            description: 'Create a function that checks if a string is valid JSON (returns true/false)',
            testCases: [
              {
                input: [
                  '{"valid":true}'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'not json'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  '{"incomplete":'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  '[]'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'null'
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that merges two JSON strings into one object and returns as JSON string',
            testCases: [
              {
                input: [
                  '{"a":1}',
                  '{"b":2}'
                ],
                expectedOutput: '{"a":1,"b":2}'
              },
              {
                input: [
                  '{}',
                  '{"x":1}'
                ],
                expectedOutput: '{"x":1}'
              },
              {
                input: [
                  '{"a":1}',
                  '{"a":2}'
                ],
                expectedOutput: '{"a":2}'
              },
              {
                input: [
                  '{}',
                  '{}'
                ],
                expectedOutput: '{}'
              },
              {
                input: [
                  '{"x":1,"y":2}',
                  '{"z":3}'
                ],
                expectedOutput: '{"x":1,"y":2,"z":3}'
              }
            ]
          },
          {
            description: 'Create a function that extracts all string values from a JSON object into an array',
            testCases: [
              {
                input: [
                  '{"name":"Alice","city":"NYC","age":25}'
                ],
                expectedOutput: 'Alice,NYC'
              },
              {
                input: [
                  '{"a":"x","b":"y","c":"z"}'
                ],
                expectedOutput: 'x,y,z'
              },
              {
                input: [
                  '{"num":123}'
                ],
                expectedOutput: ''
              },
              {
                input: [
                  '{}'
                ],
                expectedOutput: ''
              },
              {
                input: [
                  '{"mixed":"text","number":42,"bool":true}'
                ],
                expectedOutput: 'text'
              }
            ]
          }
        ]
      },
      {
        id: 'map-set',
        title: 'Specialized collections',
        outcomes: [
          'what_is_map',
          'map_creation',
          'map_set_get',
          'map_has_delete',
          'map_size_clear',
          'map_iteration',
          'what_is_set',
          'set_creation',
          'set_add_has_delete',
          'set_size_clear',
          'set_iteration',
          'array_to_set_unique',
          'map_vs_object',
          'set_vs_array'
        ],
        tasks: [
          {
            description: 'Create a function that counts how many times each element appears in an array using a Map',
            testCases: [
              {
                input: [
                  [
                    'a',
                    'b',
                    'a',
                    'c',
                    'b',
                    'a'
                  ]
                ],
                expectedOutput: 'a:3,b:2,c:1'
              },
              {
                input: [
                  [
                    'x'
                  ]
                ],
                expectedOutput: 'x:1'
              },
              {
                input: [
                  [
                    1,
                    1,
                    1
                  ]
                ],
                expectedOutput: '1:3'
              },
              {
                input: [
                  [
                    'a',
                    'b',
                    'c'
                  ]
                ],
                expectedOutput: 'a:1,b:1,c:1'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that removes all duplicate values from an array using a Set',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    2,
                    3,
                    3,
                    3
                  ]
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  [
                    1,
                    1,
                    1
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    'a',
                    'b',
                    'a'
                  ]
                ],
                expectedOutput: 'a,b'
              }
            ]
          },
          {
            description: 'Create a function that checks if two arrays have any common elements using a Set',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  [
                    3,
                    4,
                    5
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    1,
                    2
                  ],
                  [
                    3,
                    4
                  ]
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [],
                  [
                    1,
                    2
                  ]
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  [
                    1
                  ],
                  [
                    1
                  ]
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  [
                    'a',
                    'b'
                  ],
                  [
                    'b',
                    'c'
                  ]
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that finds the intersection of two arrays (elements in both) using Sets',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ],
                  [
                    3,
                    4,
                    5,
                    6
                  ]
                ],
                expectedOutput: '3,4'
              },
              {
                input: [
                  [
                    1,
                    2
                  ],
                  [
                    3,
                    4
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    1,
                    1,
                    2
                  ],
                  [
                    2,
                    2,
                    3
                  ]
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [],
                  [
                    1,
                    2
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    5
                  ],
                  [
                    5
                  ]
                ],
                expectedOutput: '5'
              }
            ]
          },
          {
            description: 'Create a function that finds the union of two arrays (all unique elements from both) using Sets',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  [
                    3,
                    4,
                    5
                  ]
                ],
                expectedOutput: '1,2,3,4,5'
              },
              {
                input: [
                  [
                    1,
                    1
                  ],
                  [
                    2,
                    2
                  ]
                ],
                expectedOutput: '1,2'
              },
              {
                input: [
                  [],
                  [
                    1,
                    2
                  ]
                ],
                expectedOutput: '1,2'
              },
              {
                input: [
                  [
                    1,
                    2
                  ],
                  []
                ],
                expectedOutput: '1,2'
              },
              {
                input: [
                  [
                    'a'
                  ],
                  [
                    'b'
                  ]
                ],
                expectedOutput: 'a,b'
              }
            ]
          },
          {
            description: 'Create a function that groups an array of objects by a property value using a Map',
            testCases: [
              {
                input: [
                  [
                    {
                      type: 'a',
                      val: 1
                    },
                    {
                      type: 'b',
                      val: 2
                    },
                    {
                      type: 'a',
                      val: 3
                    }
                  ],
                  'type'
                ],
                expectedOutput: 'a:2,b:1'
              },
              {
                input: [
                  [
                    {
                      cat: 'x',
                      n: 1
                    }
                  ],
                  'cat'
                ],
                expectedOutput: 'x:1'
              },
              {
                input: [
                  [],
                  'type'
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    {
                      g: 1
                    },
                    {
                      g: 1
                    },
                    {
                      g: 2
                    }
                  ],
                  'g'
                ],
                expectedOutput: '1:2,2:1'
              },
              {
                input: [
                  [
                    {
                      k: 'a'
                    },
                    {
                      k: 'a'
                    },
                    {
                      k: 'a'
                    }
                  ],
                  'k'
                ],
                expectedOutput: 'a:3'
              }
            ]
          },
          {
            description: 'Create a function that returns the first duplicate value in an array using a Set, or null if none',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    2,
                    4
                  ]
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: 'null'
              },
              {
                input: [
                  [
                    5,
                    5
                  ]
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  []
                ],
                expectedOutput: 'null'
              },
              {
                input: [
                  [
                    'a',
                    'b',
                    'c',
                    'a'
                  ]
                ],
                expectedOutput: 'a'
              }
            ]
          },
          {
            description: 'Create a function that converts a Map to an array of [key, value] pairs sorted by key',
            testCases: [
              {
                input: [
                  [
                    [
                      'c',
                      3
                    ],
                    [
                      'a',
                      1
                    ],
                    [
                      'b',
                      2
                    ]
                  ]
                ],
                expectedOutput: 'a:1,b:2,c:3'
              },
              {
                input: [
                  [
                    [
                      'z',
                      1
                    ]
                  ]
                ],
                expectedOutput: 'z:1'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    [
                      'b',
                      2
                    ],
                    [
                      'a',
                      1
                    ]
                  ]
                ],
                expectedOutput: 'a:1,b:2'
              },
              {
                input: [
                  [
                    [
                      'x',
                      10
                    ],
                    [
                      'y',
                      20
                    ],
                    [
                      'w',
                      5
                    ]
                  ]
                ],
                expectedOutput: 'w:5,x:10,y:20'
              }
            ]
          }
        ]
      },
      {
        id: 'destructuring',
        title: 'Destructuring',
        outcomes: [
          'array_destructuring_syntax',
          'skip_elements',
          'rest_in_arrays',
          'default_values_array',
          'object_destructuring_syntax',
          'rename_variables',
          'default_values_object',
          'nested_destructuring',
          'function_parameters',
          'swap_variables'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array and returns the first two elements as a string "first, second" using array destructuring',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '1, 2'
              },
              {
                input: [
                  [
                    'a',
                    'b',
                    'c'
                  ]
                ],
                expectedOutput: 'a, b'
              },
              {
                input: [
                  [
                    10,
                    20
                  ]
                ],
                expectedOutput: '10, 20'
              },
              {
                input: [
                  [
                    'only',
                    'two'
                  ]
                ],
                expectedOutput: 'only, two'
              }
            ]
          },
          {
            description: 'Create a function that takes an array and returns the first and third elements as "first, third" (skip the second) using destructuring',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '1, 3'
              },
              {
                input: [
                  [
                    'a',
                    'b',
                    'c',
                    'd'
                  ]
                ],
                expectedOutput: 'a, c'
              },
              {
                input: [
                  [
                    10,
                    20,
                    30
                  ]
                ],
                expectedOutput: '10, 30'
              },
              {
                input: [
                  [
                    'x',
                    'skip',
                    'z'
                  ]
                ],
                expectedOutput: 'x, z'
              }
            ]
          },
          {
            description: 'Create a function that takes an array and returns the first element and the count of remaining elements as "first: X, remaining: Y"',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5
                  ]
                ],
                expectedOutput: 'first: 1, remaining: 4'
              },
              {
                input: [
                  [
                    'a',
                    'b',
                    'c'
                  ]
                ],
                expectedOutput: 'first: a, remaining: 2'
              },
              {
                input: [
                  [
                    10
                  ]
                ],
                expectedOutput: 'first: 10, remaining: 0'
              },
              {
                input: [
                  [
                    1,
                    2
                  ]
                ],
                expectedOutput: 'first: 1, remaining: 1'
              }
            ]
          },
          {
            description: 'Create a function that takes a person object with name and age, returns "Name: {name}, Age: {age}" using object destructuring',
            testCases: [
              {
                input: [
                  {
                    name: 'Alice',
                    age: 25
                  }
                ],
                expectedOutput: 'Name: Alice, Age: 25'
              },
              {
                input: [
                  {
                    name: 'Bob',
                    age: 30
                  }
                ],
                expectedOutput: 'Name: Bob, Age: 30'
              },
              {
                input: [
                  {
                    name: 'Charlie',
                    age: 0
                  }
                ],
                expectedOutput: 'Name: Charlie, Age: 0'
              }
            ]
          },
          {
            description: 'Create a function that takes an object with property "name" and returns it renamed as "userName" in the format "User: {userName}"',
            testCases: [
              {
                input: [
                  {
                    name: 'Alice'
                  }
                ],
                expectedOutput: 'User: Alice'
              },
              {
                input: [
                  {
                    name: 'Bob'
                  }
                ],
                expectedOutput: 'User: Bob'
              },
              {
                input: [
                  {
                    name: 'Admin'
                  }
                ],
                expectedOutput: 'User: Admin'
              }
            ]
          },
          {
            description: 'Create a function that takes an object and returns "Name: {name}, Country: {country}" where country defaults to "Unknown" if not provided',
            testCases: [
              {
                input: [
                  {
                    name: 'Alice',
                    country: 'USA'
                  }
                ],
                expectedOutput: 'Name: Alice, Country: USA'
              },
              {
                input: [
                  {
                    name: 'Bob'
                  }
                ],
                expectedOutput: 'Name: Bob, Country: Unknown'
              },
              {
                input: [
                  {
                    name: 'Charlie',
                    country: 'UK'
                  }
                ],
                expectedOutput: 'Name: Charlie, Country: UK'
              },
              {
                input: [
                  {
                    name: 'David'
                  }
                ],
                expectedOutput: 'Name: David, Country: Unknown'
              }
            ]
          },
          {
            description: 'Create a function that takes a nested object { user: { name, address: { city } } } and returns "Name: {name}, City: {city}" using nested destructuring',
            testCases: [
              {
                input: [
                  {
                    user: {
                      name: 'Alice',
                      address: {
                        city: 'NYC'
                      }
                    }
                  }
                ],
                expectedOutput: 'Name: Alice, City: NYC'
              },
              {
                input: [
                  {
                    user: {
                      name: 'Bob',
                      address: {
                        city: 'LA'
                      }
                    }
                  }
                ],
                expectedOutput: 'Name: Bob, City: LA'
              },
              {
                input: [
                  {
                    user: {
                      name: 'Charlie',
                      address: {
                        city: 'Chicago'
                      }
                    }
                  }
                ],
                expectedOutput: 'Name: Charlie, City: Chicago'
              }
            ]
          },
          {
            description: 'Create a function that takes an object { x, y } as parameter (destructure in params) and returns the sum x + y',
            testCases: [
              {
                input: [
                  {
                    x: 5,
                    y: 3
                  }
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  {
                    x: 10,
                    y: 20
                  }
                ],
                expectedOutput: '30'
              },
              {
                input: [
                  {
                    x: -5,
                    y: 5
                  }
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  {
                    x: 0,
                    y: 0
                  }
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes an array [a, b] and returns them swapped as a string "b, a" using destructuring swap',
            testCases: [
              {
                input: [
                  [
                    1,
                    2
                  ]
                ],
                expectedOutput: '2, 1'
              },
              {
                input: [
                  [
                    'a',
                    'b'
                  ]
                ],
                expectedOutput: 'b, a'
              },
              {
                input: [
                  [
                    10,
                    20
                  ]
                ],
                expectedOutput: '20, 10'
              },
              {
                input: [
                  [
                    'first',
                    'second'
                  ]
                ],
                expectedOutput: 'second, first'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of coordinate objects [{x, y}, {x, y}] and returns the sum of all x values and sum of all y values as "sumX: X, sumY: Y"',
            testCases: [
              {
                input: [
                  [
                    {
                      x: 1,
                      y: 2
                    },
                    {
                      x: 3,
                      y: 4
                    }
                  ]
                ],
                expectedOutput: 'sumX: 4, sumY: 6'
              },
              {
                input: [
                  [
                    {
                      x: 10,
                      y: 20
                    },
                    {
                      x: 30,
                      y: 40
                    }
                  ]
                ],
                expectedOutput: 'sumX: 40, sumY: 60'
              },
              {
                input: [
                  [
                    {
                      x: 0,
                      y: 0
                    },
                    {
                      x: 5,
                      y: 5
                    }
                  ]
                ],
                expectedOutput: 'sumX: 5, sumY: 5'
              },
              {
                input: [
                  [
                    {
                      x: -1,
                      y: 1
                    },
                    {
                      x: 1,
                      y: -1
                    }
                  ]
                ],
                expectedOutput: 'sumX: 0, sumY: 0'
              }
            ]
          },
          {
            description: 'Create a function that takes an array with first element as name (string) and rest as scores (numbers), returns "Name: {name}, Average: {avg}"',
            testCases: [
              {
                input: [
                  [
                    'Alice',
                    80,
                    90,
                    100
                  ]
                ],
                expectedOutput: 'Name: Alice, Average: 90'
              },
              {
                input: [
                  [
                    'Bob',
                    70,
                    80
                  ]
                ],
                expectedOutput: 'Name: Bob, Average: 75'
              },
              {
                input: [
                  [
                    'Charlie',
                    100
                  ]
                ],
                expectedOutput: 'Name: Charlie, Average: 100'
              },
              {
                input: [
                  [
                    'David',
                    60,
                    70,
                    80,
                    90
                  ]
                ],
                expectedOutput: 'Name: David, Average: 75'
              }
            ]
          }
        ]
      },
      {
        id: 'arrow-functions',
        title: 'Arrow Functions',
        outcomes: [
          'arrow_syntax_full',
          'arrow_syntax_concise',
          'single_param_no_parens',
          'no_params_empty_parens',
          'implicit_return',
          'explicit_return',
          'returning_objects',
          'arrow_with_array_methods',
          'lexical_this',
          'when_not_to_use'
        ],
        tasks: [
          {
            description: 'Create an arrow function that takes a number and returns it doubled',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -3
                ],
                expectedOutput: '-6'
              },
              {
                input: [
                  100
                ],
                expectedOutput: '200'
              }
            ]
          },
          {
            description: 'Create an arrow function that takes two numbers and returns their sum',
            testCases: [
              {
                input: [
                  3,
                  5
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  10,
                  20
                ],
                expectedOutput: '30'
              },
              {
                input: [
                  -5,
                  5
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  0,
                  0
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create an arrow function with no parameters that returns the string "Hello, World!"',
            testCases: [
              {
                input: [],
                expectedOutput: 'Hello, World!'
              }
            ]
          },
          {
            description: 'Create an arrow function that takes a number and returns an object with properties "original" and "squared"',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '{"original":5,"squared":25}'
              },
              {
                input: [
                  3
                ],
                expectedOutput: '{"original":3,"squared":9}'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '{"original":0,"squared":0}'
              },
              {
                input: [
                  -4
                ],
                expectedOutput: '{"original":-4,"squared":16}'
              }
            ]
          },
          {
            description: 'Create an arrow function that takes a string and returns it in uppercase',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'HELLO'
              },
              {
                input: [
                  'JavaScript'
                ],
                expectedOutput: 'JAVASCRIPT'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'A'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create an arrow function that takes an array of numbers and returns a new array with each number tripled (use map)',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '3,6,9'
              },
              {
                input: [
                  [
                    5,
                    10
                  ]
                ],
                expectedOutput: '15,30'
              },
              {
                input: [
                  [
                    0,
                    -1,
                    1
                  ]
                ],
                expectedOutput: '0,-3,3'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create an arrow function that takes an array of numbers and returns only numbers greater than 5 (use filter)',
            testCases: [
              {
                input: [
                  [
                    1,
                    6,
                    3,
                    8,
                    2,
                    10
                  ]
                ],
                expectedOutput: '6,8,10'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    10,
                    20,
                    30
                  ]
                ],
                expectedOutput: '10,20,30'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create an arrow function that takes an array of numbers and returns their product (use reduce)',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '24'
              },
              {
                input: [
                  [
                    5,
                    5
                  ]
                ],
                expectedOutput: '25'
              },
              {
                input: [
                  [
                    10
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create an arrow function that takes an array of numbers, filters out negatives, and returns the sum of remaining (chain filter + reduce)',
            testCases: [
              {
                input: [
                  [
                    -1,
                    2,
                    -3,
                    4,
                    5
                  ]
                ],
                expectedOutput: '11'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '6'
              },
              {
                input: [
                  [
                    -1,
                    -2,
                    -3
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create an arrow function that takes an array of strings and returns the total length of all strings combined',
            testCases: [
              {
                input: [
                  [
                    'hello',
                    'world'
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    'a',
                    'ab',
                    'abc'
                  ]
                ],
                expectedOutput: '6'
              },
              {
                input: [
                  [
                    'test'
                  ]
                ],
                expectedOutput: '4'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    '',
                    'hi',
                    ''
                  ]
                ],
                expectedOutput: '2'
              }
            ]
          },
          {
            description: 'Create an arrow function that takes an array of numbers and returns a new array containing only unique values (hint: use filter with indexOf)',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    2,
                    3,
                    3,
                    3
                  ]
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  [
                    5,
                    5,
                    5
                  ]
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          }
        ]
      },
      {
        id: 'closures',
        title: 'Functions remembering their scope',
        outcomes: [
          'what_is_closure',
          'lexical_scope',
          'closure_creation',
          'data_privacy',
          'function_factories',
          'maintaining_state',
          'counter_pattern',
          'closure_in_loops',
          'practical_uses'
        ],
        tasks: [
          {
            description: 'Create a function that returns another function. The inner function should add a fixed number (from outer scope) to its argument',
            testCases: [
              {
                input: [
                  5,
                  3
                ],
                expectedOutput: '8'
              },
              {
                input: [
                  10,
                  7
                ],
                expectedOutput: '17'
              },
              {
                input: [
                  0,
                  5
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  -5,
                  10
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  100,
                  1
                ],
                expectedOutput: '101'
              }
            ]
          },
          {
            description: 'Create a counter function that returns an object with increment, decrement, and getValue methods sharing a private count variable',
            testCases: [
              {
                input: [
                  'increment',
                  'increment',
                  'getValue'
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  'increment',
                  'decrement',
                  'getValue'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  'decrement',
                  'decrement',
                  'getValue'
                ],
                expectedOutput: '-2'
              },
              {
                input: [
                  'getValue'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  'increment',
                  'increment',
                  'increment',
                  'getValue'
                ],
                expectedOutput: '3'
              }
            ]
          },
          {
            description: 'Create a function that takes a multiplier and returns a function that multiplies any number by that multiplier',
            testCases: [
              {
                input: [
                  2,
                  5
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  3,
                  4
                ],
                expectedOutput: '12'
              },
              {
                input: [
                  0,
                  100
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  10,
                  10
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  -2,
                  5
                ],
                expectedOutput: '-10'
              }
            ]
          },
          {
            description: 'Create a function that creates a greeting function with a fixed greeting prefix (e.g., "Hello" or "Hi")',
            testCases: [
              {
                input: [
                  'Hello',
                  'World'
                ],
                expectedOutput: 'Hello, World!'
              },
              {
                input: [
                  'Hi',
                  'Alice'
                ],
                expectedOutput: 'Hi, Alice!'
              },
              {
                input: [
                  'Welcome',
                  'User'
                ],
                expectedOutput: 'Welcome, User!'
              },
              {
                input: [
                  'Hey',
                  'Bob'
                ],
                expectedOutput: 'Hey, Bob!'
              },
              {
                input: [
                  'Greetings',
                  'Friend'
                ],
                expectedOutput: 'Greetings, Friend!'
              }
            ]
          },
          {
            description: 'Create a function that returns a function to check if a number is within a fixed range (min and max from outer scope)',
            testCases: [
              {
                input: [
                  1,
                  10,
                  5
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  1,
                  10,
                  15
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  0,
                  100,
                  0
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  0,
                  100,
                  100
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  -10,
                  10,
                  0
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a function that maintains a running total. Each call adds to the total and returns the new sum',
            testCases: [
              {
                input: [
                  [
                    5,
                    3,
                    2
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    10
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    1,
                    1,
                    1,
                    1
                  ]
                ],
                expectedOutput: '4'
              },
              {
                input: [
                  [
                    -5,
                    10
                  ]
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  [
                    0,
                    0,
                    0
                  ]
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that generates unique IDs. Each call returns the next number in sequence starting from 1',
            testCases: [
              {
                input: [
                  3
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  1
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  5
                ],
                expectedOutput: '1,2,3,4,5'
              },
              {
                input: [
                  2
                ],
                expectedOutput: '1,2'
              },
              {
                input: [
                  4
                ],
                expectedOutput: '1,2,3,4'
              }
            ]
          },
          {
            description: 'Create a once function that ensures a given function can only be executed once, returning the cached result on subsequent calls',
            testCases: [
              {
                input: [
                  5,
                  3
                ],
                expectedOutput: '8,8,8'
              },
              {
                input: [
                  10,
                  20
                ],
                expectedOutput: '30,30,30'
              },
              {
                input: [
                  0,
                  0
                ],
                expectedOutput: '0,0,0'
              },
              {
                input: [
                  -5,
                  5
                ],
                expectedOutput: '0,0,0'
              },
              {
                input: [
                  100,
                  1
                ],
                expectedOutput: '101,101,101'
              }
            ]
          }
        ]
      },
      {
        id: 'array-advanced-patterns',
        title: 'Method chaining and nested arrays',
        outcomes: [
          'method_chaining',
          'reading_chains',
          'formatting_chains',
          'create_2d_arrays',
          'nested_array_access',
          'iterate_nested',
          'flat_method',
          'flat_depth',
          'flatMap_method',
          'combining_methods',
          'choosing_methods'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array of numbers and returns the sum of all even numbers doubled',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4
                  ]
                ],
                expectedOutput: '12'
              },
              {
                input: [
                  [
                    1,
                    3,
                    5
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    2
                  ]
                ],
                expectedOutput: '4'
              },
              {
                input: [
                  [
                    -2,
                    -4,
                    0
                  ]
                ],
                expectedOutput: '-12'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns the product of all positive numbers incremented by 1',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '24'
              },
              {
                input: [
                  [
                    -1,
                    -2,
                    -3
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    5
                  ]
                ],
                expectedOutput: '6'
              },
              {
                input: [
                  [
                    0,
                    1,
                    2
                  ]
                ],
                expectedOutput: '6'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of strings and returns a single string of all words longer than 3 characters, uppercased and joined by hyphens',
            testCases: [
              {
                input: [
                  [
                    'the',
                    'quick',
                    'fox'
                  ]
                ],
                expectedOutput: 'QUICK'
              },
              {
                input: [
                  [
                    'hi',
                    'to',
                    'go'
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    'hello',
                    'world'
                  ]
                ],
                expectedOutput: 'HELLO-WORLD'
              },
              {
                input: [
                  [
                    'Test'
                  ]
                ],
                expectedOutput: 'TEST'
              }
            ]
          },
          {
            description: 'Create a function that takes a 2D array (matrix) and row and column indices, and returns the element at that position',
            testCases: [
              {
                input: [
                  [
                    [
                      1,
                      2,
                      3
                    ],
                    [
                      4,
                      5,
                      6
                    ]
                  ],
                  1,
                  2
                ],
                expectedOutput: '6'
              },
              {
                input: [
                  [
                    [
                      1,
                      2
                    ],
                    [
                      3,
                      4
                    ]
                  ],
                  0,
                  0
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    [
                      'a',
                      'b'
                    ],
                    [
                      'c',
                      'd'
                    ]
                  ],
                  1,
                  1
                ],
                expectedOutput: 'd'
              },
              {
                input: [
                  [
                    [
                      42
                    ]
                  ],
                  0,
                  0
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  [
                    [
                      1,
                      2,
                      3,
                      4,
                      5
                    ]
                  ],
                  0,
                  4
                ],
                expectedOutput: '5'
              }
            ]
          },
          {
            description: 'Create a function that takes a 2D array of numbers and returns the sum of all elements',
            testCases: [
              {
                input: [
                  [
                    [
                      1,
                      2
                    ],
                    [
                      3,
                      4
                    ]
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    [
                      5
                    ]
                  ]
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  [
                    []
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    [
                      1,
                      -1
                    ],
                    [
                      2,
                      -2
                    ]
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    [
                      -5,
                      -3
                    ],
                    [
                      -2
                    ]
                  ]
                ],
                expectedOutput: '-10'
              }
            ]
          },
          {
            description: 'Create a function that takes a nested array and returns a flattened array (one level deep)',
            testCases: [
              {
                input: [
                  [
                    [
                      1,
                      2
                    ],
                    [
                      3,
                      4
                    ]
                  ]
                ],
                expectedOutput: '1,2,3,4'
              },
              {
                input: [
                  [
                    [
                      1
                    ]
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    [],
                    [
                      1
                    ],
                    []
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    [
                      1,
                      [
                        2,
                        3
                      ]
                    ],
                    [
                      4
                    ]
                  ]
                ],
                expectedOutput: '1,2,3,4'
              },
              {
                input: [
                  [
                    [
                      'a'
                    ],
                    [
                      'b'
                    ]
                  ]
                ],
                expectedOutput: 'a,b'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of arrays of numbers and returns a flat array with each number squared',
            testCases: [
              {
                input: [
                  [
                    [
                      1,
                      2
                    ],
                    [
                      3
                    ]
                  ]
                ],
                expectedOutput: '1,4,9'
              },
              {
                input: [
                  [
                    []
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    [
                      -2
                    ],
                    [
                      3
                    ]
                  ]
                ],
                expectedOutput: '4,9'
              },
              {
                input: [
                  [
                    [
                      0,
                      1
                    ]
                  ]
                ],
                expectedOutput: '0,1'
              },
              {
                input: [
                  [
                    [
                      5
                    ]
                  ]
                ],
                expectedOutput: '25'
              }
            ]
          },
          {
            description: 'Create a function that takes a 2D array of numbers and returns the index of the row with the maximum sum',
            testCases: [
              {
                input: [
                  [
                    [
                      1,
                      2
                    ],
                    [
                      5,
                      6
                    ],
                    [
                      3,
                      4
                    ]
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    [
                      10,
                      20
                    ],
                    [
                      5,
                      5
                    ]
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    [
                      1
                    ],
                    [
                      2
                    ],
                    [
                      3
                    ]
                  ]
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [
                    [
                      -1,
                      -2
                    ],
                    [
                      -3,
                      -4
                    ]
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    [
                      100
                    ]
                  ]
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of objects with name and score properties, and returns the average score of entries with scores above 50',
            testCases: [
              {
                input: [
                  [
                    {
                      name: 'A',
                      score: 60
                    },
                    {
                      name: 'B',
                      score: 80
                    }
                  ]
                ],
                expectedOutput: '70'
              },
              {
                input: [
                  [
                    {
                      name: 'A',
                      score: 30
                    },
                    {
                      name: 'B',
                      score: 40
                    }
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    {
                      name: 'Solo',
                      score: 100
                    }
                  ]
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  [
                    {
                      name: 'A',
                      score: 51
                    },
                    {
                      name: 'B',
                      score: 49
                    }
                  ]
                ],
                expectedOutput: '51'
              }
            ]
          },
          {
            description: 'Create a function that takes a 2D array (square matrix) and returns its transpose (rows become columns)',
            testCases: [
              {
                input: [
                  [
                    [
                      1,
                      2
                    ],
                    [
                      3,
                      4
                    ]
                  ]
                ],
                expectedOutput: '1,3|2,4'
              },
              {
                input: [
                  [
                    [
                      1,
                      2,
                      3
                    ],
                    [
                      4,
                      5,
                      6
                    ],
                    [
                      7,
                      8,
                      9
                    ]
                  ]
                ],
                expectedOutput: '1,4,7|2,5,8|3,6,9'
              },
              {
                input: [
                  [
                    [
                      1
                    ]
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    [
                      0,
                      1
                    ],
                    [
                      1,
                      0
                    ]
                  ]
                ],
                expectedOutput: '0,1|1,0'
              },
              {
                input: [
                  [
                    [
                      'a',
                      'b'
                    ],
                    [
                      'c',
                      'd'
                    ]
                  ]
                ],
                expectedOutput: 'a,c|b,d'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of words and returns the total character count of words that start with a vowel',
            testCases: [
              {
                input: [
                  [
                    'apple',
                    'banana',
                    'orange'
                  ]
                ],
                expectedOutput: '11'
              },
              {
                input: [
                  [
                    'cat',
                    'dog',
                    'fish'
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    'a',
                    'e',
                    'i'
                  ]
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  [
                    'Apple',
                    'UMBRELLA'
                  ]
                ],
                expectedOutput: '13'
              }
            ]
          }
        ]
      },
      {
        id: 'spread-rest',
        title: 'Spread and rest operators',
        outcomes: [
          'spread_syntax',
          'spread_copy_array',
          'spread_merge_arrays',
          'spread_add_elements',
          'spread_function_args',
          'spread_copy_object',
          'spread_merge_objects',
          'spread_override_props',
          'rest_syntax',
          'rest_creates_array',
          'rest_must_be_last',
          'spread_vs_rest'
        ],
        tasks: [
          {
            description: 'Create a function that takes an array and returns a new array with all elements plus a new element added at the end (without modifying the original)',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  4
                ],
                expectedOutput: '1,2,3,4'
              },
              {
                input: [
                  [],
                  'first'
                ],
                expectedOutput: 'first'
              },
              {
                input: [
                  [
                    5
                  ],
                  10
                ],
                expectedOutput: '5,10'
              },
              {
                input: [
                  [
                    'a',
                    'b'
                  ],
                  null
                ],
                expectedOutput: 'a,b,'
              },
              {
                input: [
                  [
                    true,
                    false
                  ],
                  0
                ],
                expectedOutput: 'true,false,0'
              }
            ]
          },
          {
            description: 'Create a function that takes two arrays and returns a new array with all elements from both arrays combined',
            testCases: [
              {
                input: [
                  [
                    1,
                    2
                  ],
                  [
                    3,
                    4
                  ]
                ],
                expectedOutput: '1,2,3,4'
              },
              {
                input: [
                  [],
                  [
                    1,
                    2
                  ]
                ],
                expectedOutput: '1,2'
              },
              {
                input: [
                  [
                    1,
                    2
                  ],
                  []
                ],
                expectedOutput: '1,2'
              },
              {
                input: [
                  [],
                  []
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    -1,
                    0
                  ],
                  [
                    1
                  ]
                ],
                expectedOutput: '-1,0,1'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns the maximum value using Math.max with spread',
            testCases: [
              {
                input: [
                  [
                    1,
                    5,
                    3,
                    9,
                    2
                  ]
                ],
                expectedOutput: '9'
              },
              {
                input: [
                  [
                    -5,
                    -2,
                    -10
                  ]
                ],
                expectedOutput: '-2'
              },
              {
                input: [
                  [
                    42
                  ]
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  [
                    0,
                    -1,
                    1
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    7,
                    7,
                    7
                  ]
                ],
                expectedOutput: '7'
              }
            ]
          },
          {
            description: 'Create a function that takes an object and a key-value pair, and returns a new object with the property added or updated (without modifying the original)',
            testCases: [
              {
                input: [
                  {
                    name: 'John'
                  },
                  'age',
                  25
                ],
                expectedOutput: '{"name":"John","age":25}'
              },
              {
                input: [
                  {
                    x: 10
                  },
                  'x',
                  20
                ],
                expectedOutput: '{"x":20}'
              },
              {
                input: [
                  {},
                  'key',
                  'value'
                ],
                expectedOutput: '{"key":"value"}'
              },
              {
                input: [
                  {
                    a: 1
                  },
                  'b',
                  null
                ],
                expectedOutput: '{"a":1,"b":null}'
              },
              {
                input: [
                  {
                    a: 1
                  },
                  'b',
                  0
                ],
                expectedOutput: '{"a":1,"b":0}'
              }
            ]
          },
          {
            description: 'Create a function that takes two objects and returns a new object with all properties from both (second object properties override first if keys match)',
            testCases: [
              {
                input: [
                  {
                    a: 1
                  },
                  {
                    b: 2
                  }
                ],
                expectedOutput: '{"a":1,"b":2}'
              },
              {
                input: [
                  {
                    a: 1,
                    b: 2
                  },
                  {
                    b: 99
                  }
                ],
                expectedOutput: '{"a":1,"b":99}'
              },
              {
                input: [
                  {},
                  {
                    a: 1
                  }
                ],
                expectedOutput: '{"a":1}'
              },
              {
                input: [
                  {
                    a: 1
                  },
                  {}
                ],
                expectedOutput: '{"a":1}'
              },
              {
                input: [
                  {},
                  {}
                ],
                expectedOutput: '{}'
              }
            ]
          },
          {
            description: 'Create a function using rest parameters that takes any number of arguments and returns their sum',
            testCases: [
              {
                input: [
                  1,
                  2,
                  3
                ],
                expectedOutput: '6'
              },
              {
                input: [],
                expectedOutput: '0'
              },
              {
                input: [
                  42
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  -5,
                  5
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  0,
                  0,
                  0
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function using rest parameters that takes any number of arguments and returns the count of arguments passed',
            testCases: [
              {
                input: [
                  1,
                  2,
                  3
                ],
                expectedOutput: '3'
              },
              {
                input: [],
                expectedOutput: '0'
              },
              {
                input: [
                  'single'
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  null,
                  null,
                  0,
                  '',
                  false
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  'a',
                  'b'
                ],
                expectedOutput: '2'
              }
            ]
          },
          {
            description: 'Create a function that takes a multiplier as first argument and rest parameters for numbers, and returns an array with each number multiplied by the multiplier',
            testCases: [
              {
                input: [
                  2,
                  1,
                  2,
                  3
                ],
                expectedOutput: '2,4,6'
              },
              {
                input: [
                  5
                ],
                expectedOutput: ''
              },
              {
                input: [
                  0,
                  5,
                  10
                ],
                expectedOutput: '0,0'
              },
              {
                input: [
                  -1,
                  3,
                  4
                ],
                expectedOutput: '-3,-4'
              },
              {
                input: [
                  10,
                  0
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that takes a required first name, required last name, and any number of middle names using rest, and returns the full name joined by spaces',
            testCases: [
              {
                input: [
                  'John',
                  'Doe'
                ],
                expectedOutput: 'John Doe'
              },
              {
                input: [
                  'Mary',
                  'Jane',
                  'Smith'
                ],
                expectedOutput: 'Mary Jane Smith'
              },
              {
                input: [
                  'A',
                  'B',
                  'C',
                  'D'
                ],
                expectedOutput: 'A B C D'
              },
              {
                input: [
                  'First',
                  'Last'
                ],
                expectedOutput: 'First Last'
              },
              {
                input: [
                  'X',
                  'M1',
                  'M2',
                  'M3',
                  'Y'
                ],
                expectedOutput: 'X M1 M2 M3 Y'
              }
            ]
          },
          {
            description: 'Create a function that clones an array, reverses the clone, and returns both original order and reversed order as a string separated by " | "',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '1,2,3 | 3,2,1'
              },
              {
                input: [
                  [
                    5
                  ]
                ],
                expectedOutput: '5 | 5'
              },
              {
                input: [
                  [
                    'a',
                    'b'
                  ]
                ],
                expectedOutput: 'a,b | b,a'
              },
              {
                input: [
                  [
                    1,
                    2,
                    1
                  ]
                ],
                expectedOutput: '1,2,1 | 1,2,1'
              },
              {
                input: [
                  [
                    -1,
                    0,
                    1
                  ]
                ],
                expectedOutput: '-1,0,1 | 1,0,-1'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and returns an object with min, max, and sum properties using spread with Math.min and Math.max',
            testCases: [
              {
                input: [
                  [
                    1,
                    5,
                    3,
                    9,
                    2
                  ]
                ],
                expectedOutput: '{"min":1,"max":9,"sum":20}'
              },
              {
                input: [
                  [
                    7
                  ]
                ],
                expectedOutput: '{"min":7,"max":7,"sum":7}'
              },
              {
                input: [
                  [
                    -5,
                    0,
                    5
                  ]
                ],
                expectedOutput: '{"min":-5,"max":5,"sum":0}'
              },
              {
                input: [
                  [
                    -10,
                    -5,
                    -1
                  ]
                ],
                expectedOutput: '{"min":-10,"max":-1,"sum":-16}'
              },
              {
                input: [
                  [
                    0,
                    0,
                    0
                  ]
                ],
                expectedOutput: '{"min":0,"max":0,"sum":0}'
              }
            ]
          }
        ]
      },
      {
        id: 'error-handling',
        title: 'Error handling with try-catch',
        outcomes: [
          'error_types',
          'error_properties',
          'try_catch_syntax',
          'finally_block',
          'throw_statement',
          'custom_error_messages',
          'catching_specific_errors',
          'when_to_use_try_catch',
          'error_propagation'
        ],
        tasks: [
          {
            description: 'Create a function that takes a JSON string and returns the parsed object, or null if parsing fails',
            testCases: [
              {
                input: [
                  '{"name":"John","age":30}'
                ],
                expectedOutput: '{"name":"John","age":30}'
              },
              {
                input: [
                  'invalid json'
                ],
                expectedOutput: 'null'
              },
              {
                input: [
                  '{"valid":true}'
                ],
                expectedOutput: '{"valid":true}'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'null'
              },
              {
                input: [
                  'null'
                ],
                expectedOutput: 'null'
              }
            ]
          },
          {
            description: 'Create a function that divides two numbers but throws an error with message "Cannot divide by zero" if the divisor is zero',
            testCases: [
              {
                input: [
                  10,
                  2
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  10,
                  0
                ],
                expectedOutput: 'Error: Cannot divide by zero'
              },
              {
                input: [
                  0,
                  5
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -10,
                  2
                ],
                expectedOutput: '-5'
              },
              {
                input: [
                  7,
                  2
                ],
                expectedOutput: '3.5'
              }
            ]
          },
          {
            description: 'Create a function that validates age: throws "Age cannot be negative" if negative, "Age cannot exceed 150" if over 150, otherwise returns the age',
            testCases: [
              {
                input: [
                  25
                ],
                expectedOutput: '25'
              },
              {
                input: [
                  -5
                ],
                expectedOutput: 'Error: Age cannot be negative'
              },
              {
                input: [
                  200
                ],
                expectedOutput: 'Error: Age cannot exceed 150'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  150
                ],
                expectedOutput: '150'
              }
            ]
          },
          {
            description: 'Create a function that takes an object and a dot-notation path string, returns the value or "Property not found" if path is invalid',
            testCases: [
              {
                input: [
                  {
                    user: {
                      name: 'Alice'
                    }
                  },
                  'user.name'
                ],
                expectedOutput: 'Alice'
              },
              {
                input: [
                  {
                    a: {
                      b: {
                        c: 42
                      }
                    }
                  },
                  'a.b.c'
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  {
                    x: 10
                  },
                  'y'
                ],
                expectedOutput: 'Property not found'
              },
              {
                input: [
                  {},
                  'any.path'
                ],
                expectedOutput: 'Property not found'
              },
              {
                input: [
                  {
                    val: 0
                  },
                  'val'
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a function that converts a string to an integer, throws "Invalid number" if the string is not a valid integer',
            testCases: [
              {
                input: [
                  '42'
                ],
                expectedOutput: '42'
              },
              {
                input: [
                  'abc'
                ],
                expectedOutput: 'Error: Invalid number'
              },
              {
                input: [
                  '-10'
                ],
                expectedOutput: '-10'
              },
              {
                input: [
                  '3.14'
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'Error: Invalid number'
              }
            ]
          },
          {
            description: 'Create a function that takes an array and index, returns the element or throws "Index out of bounds" if index is invalid',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  1
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  5
                ],
                expectedOutput: 'Error: Index out of bounds'
              },
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ],
                  -1
                ],
                expectedOutput: 'Error: Index out of bounds'
              },
              {
                input: [
                  [
                    'a',
                    'b'
                  ],
                  0
                ],
                expectedOutput: 'a'
              },
              {
                input: [
                  [],
                  0
                ],
                expectedOutput: 'Error: Index out of bounds'
              }
            ]
          },
          {
            description: 'Create a function that takes a value and returns its type, but if the value is null returns "null" (not "object")',
            testCases: [
              {
                input: [
                  42
                ],
                expectedOutput: 'number'
              },
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'string'
              },
              {
                input: [
                  null
                ],
                expectedOutput: 'null'
              },
              {
                input: [
                  null
                ],
                expectedOutput: 'undefined'
              },
              {
                input: [
                  [
                    1,
                    2
                  ]
                ],
                expectedOutput: 'object'
              }
            ]
          },
          {
            description: 'Create a function that calculates square root, throws "Cannot calculate square root of negative number" for negative inputs',
            testCases: [
              {
                input: [
                  16
                ],
                expectedOutput: '4'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -4
                ],
                expectedOutput: 'Error: Cannot calculate square root of negative number'
              },
              {
                input: [
                  2
                ],
                expectedOutput: '1.4142135623730951'
              },
              {
                input: [
                  1
                ],
                expectedOutput: '1'
              }
            ]
          }
        ]
      },
      {
        id: 'async-basics',
        title: 'Callbacks, timers, and async concepts',
        outcomes: [
          'sync_vs_async',
          'single_threaded',
          'event_loop_basics',
          'callback_functions',
          'setTimeout_syntax',
          'setInterval_syntax',
          'clear_timers',
          'execution_order',
          'callback_pattern',
          'callback_hell',
          'why_promises_needed'
        ],
        tasks: [
          {
            description: 'Create a function that takes a number and a callback, then calls the callback with the number doubled',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -3
                ],
                expectedOutput: '-6'
              },
              {
                input: [
                  100
                ],
                expectedOutput: '200'
              },
              {
                input: [
                  0.5
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create a function that takes two numbers and a callback, calls the callback with an object containing sum, difference, and product',
            testCases: [
              {
                input: [
                  10,
                  3
                ],
                expectedOutput: '{"sum":13,"difference":7,"product":30}'
              },
              {
                input: [
                  5,
                  5
                ],
                expectedOutput: '{"sum":10,"difference":0,"product":25}'
              },
              {
                input: [
                  0,
                  7
                ],
                expectedOutput: '{"sum":7,"difference":-7,"product":0}'
              },
              {
                input: [
                  -2,
                  3
                ],
                expectedOutput: '{"sum":1,"difference":-5,"product":-6}'
              },
              {
                input: [
                  1,
                  1
                ],
                expectedOutput: '{"sum":2,"difference":0,"product":1}'
              }
            ]
          },
          {
            description: 'Create a function that takes an array and a callback, calls the callback with the array filtered to only even numbers',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                  ]
                ],
                expectedOutput: '2,4,6'
              },
              {
                input: [
                  [
                    1,
                    3,
                    5
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    2,
                    4,
                    6
                  ]
                ],
                expectedOutput: '2,4,6'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    -2,
                    -1,
                    0,
                    1,
                    2
                  ]
                ],
                expectedOutput: '-2,0,2'
              }
            ]
          },
          {
            description: 'Create a function that takes a string and two callbacks (onSuccess, onError). If string is not empty, call onSuccess with uppercase string. If empty, call onError with "Empty string"',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'success: HELLO'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'error: Empty string'
              },
              {
                input: [
                  'JavaScript'
                ],
                expectedOutput: 'success: JAVASCRIPT'
              },
              {
                input: [
                  'a'
                ],
                expectedOutput: 'success: A'
              },
              {
                input: [
                  '  '
                ],
                expectedOutput: 'success:   '
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers and a callback. Call the callback with an object containing min, max, and average',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3,
                    4,
                    5
                  ]
                ],
                expectedOutput: '{"min":1,"max":5,"avg":3}'
              },
              {
                input: [
                  [
                    10
                  ]
                ],
                expectedOutput: '{"min":10,"max":10,"avg":10}'
              },
              {
                input: [
                  [
                    -5,
                    0,
                    5
                  ]
                ],
                expectedOutput: '{"min":-5,"max":5,"avg":0}'
              },
              {
                input: [
                  [
                    2,
                    2,
                    2
                  ]
                ],
                expectedOutput: '{"min":2,"max":2,"avg":2}'
              },
              {
                input: [
                  [
                    1,
                    100
                  ]
                ],
                expectedOutput: '{"min":1,"max":100,"avg":50.5}'
              }
            ]
          },
          {
            description: 'Create a function that simulates async flow: takes a value, a transform function, and a callback. Apply transform to value, then pass result to callback',
            testCases: [
              {
                input: [
                  5,
                  'double'
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  5,
                  'square'
                ],
                expectedOutput: '25'
              },
              {
                input: [
                  5,
                  'negate'
                ],
                expectedOutput: '-5'
              },
              {
                input: [
                  0,
                  'double'
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -3,
                  'square'
                ],
                expectedOutput: '9'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of strings and a callback. Sort alphabetically, then call callback with the sorted array joined by comma',
            testCases: [
              {
                input: [
                  [
                    'banana',
                    'apple',
                    'cherry'
                  ]
                ],
                expectedOutput: 'apple,banana,cherry'
              },
              {
                input: [
                  [
                    'z',
                    'a',
                    'm'
                  ]
                ],
                expectedOutput: 'a,m,z'
              },
              {
                input: [
                  [
                    'only'
                  ]
                ],
                expectedOutput: 'only'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    'B',
                    'a',
                    'C'
                  ]
                ],
                expectedOutput: 'B,C,a'
              }
            ]
          },
          {
            description: 'Given: console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C"); - What is the output order? Return as string "X,Y,Z"',
            testCases: [
              {
                input: [],
                expectedOutput: 'A,C,B'
              }
            ]
          }
        ]
      },
      {
        id: 'promises',
        title: 'Creating and consuming promises',
        outcomes: [
          'promise_states',
          'creating_promises',
          'resolve_fulfill',
          'reject_reason',
          'then_handler',
          'catch_handler',
          'finally_handler',
          'chaining_then',
          'returning_from_then',
          'promise_resolve_shortcut',
          'promise_reject_shortcut',
          'promise_all',
          'promise_race',
          'promise_allSettled'
        ],
        tasks: [
          {
            description: 'Create a function that returns a promise which resolves with the number doubled after a simulated delay',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -3
                ],
                expectedOutput: '-6'
              },
              {
                input: [
                  100
                ],
                expectedOutput: '200'
              },
              {
                input: [
                  0.5
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create a function that returns a promise which resolves if number is positive, rejects with "Number must be positive" if zero or negative',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: 'resolved: 5'
              },
              {
                input: [
                  0
                ],
                expectedOutput: 'rejected: Number must be positive'
              },
              {
                input: [
                  -10
                ],
                expectedOutput: 'rejected: Number must be positive'
              },
              {
                input: [
                  1
                ],
                expectedOutput: 'resolved: 1'
              },
              {
                input: [
                  100
                ],
                expectedOutput: 'resolved: 100'
              }
            ]
          },
          {
            description: 'Create a function that takes a string and returns a promise. Resolve with uppercase if length > 3, reject with "Too short" otherwise',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'resolved: HELLO'
              },
              {
                input: [
                  'hi'
                ],
                expectedOutput: 'rejected: Too short'
              },
              {
                input: [
                  'abc'
                ],
                expectedOutput: 'rejected: Too short'
              },
              {
                input: [
                  'test'
                ],
                expectedOutput: 'resolved: TEST'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: 'rejected: Too short'
              }
            ]
          },
          {
            description: 'Create a function that chains promises: takes a number, doubles it, then adds 10, returns the final result',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '20'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  -5
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  10
                ],
                expectedOutput: '30'
              },
              {
                input: [
                  1
                ],
                expectedOutput: '12'
              }
            ]
          },
          {
            description: 'Create a function using Promise.resolve or Promise.reject: return resolved promise with "even" if number is even, rejected with "odd" if odd',
            testCases: [
              {
                input: [
                  4
                ],
                expectedOutput: 'resolved: even'
              },
              {
                input: [
                  3
                ],
                expectedOutput: 'rejected: odd'
              },
              {
                input: [
                  0
                ],
                expectedOutput: 'resolved: even'
              },
              {
                input: [
                  -2
                ],
                expectedOutput: 'resolved: even'
              },
              {
                input: [
                  1
                ],
                expectedOutput: 'rejected: odd'
              }
            ]
          },
          {
            description: 'Create a function that takes an array of numbers, returns a promise that resolves with their sum (using Promise.resolve)',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '6'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    10
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    -1,
                    1
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    5,
                    5,
                    5,
                    5
                  ]
                ],
                expectedOutput: '20'
              }
            ]
          },
          {
            description: 'Create a function that simulates Promise.all behavior: takes array of values, returns promise resolving with array of doubled values',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '2,4,6'
              },
              {
                input: [
                  [
                    5
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    0,
                    10
                  ]
                ],
                expectedOutput: '0,20'
              },
              {
                input: [
                  [
                    -1,
                    0,
                    1
                  ]
                ],
                expectedOutput: '-2,0,2'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create a function that returns a promise chain: validate number is positive, then double it, then convert to string with "Result: " prefix',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: 'Result: 10'
              },
              {
                input: [
                  1
                ],
                expectedOutput: 'Result: 2'
              },
              {
                input: [
                  0
                ],
                expectedOutput: 'rejected: Not positive'
              },
              {
                input: [
                  -5
                ],
                expectedOutput: 'rejected: Not positive'
              },
              {
                input: [
                  50
                ],
                expectedOutput: 'Result: 100'
              }
            ]
          }
        ]
      },
      {
        id: 'async-await',
        title: 'Writing cleaner asynchronous code',
        outcomes: [
          'async_keyword',
          'await_keyword',
          'await_only_in_async',
          'async_return_value',
          'async_throw_rejects',
          'try_catch_with_await',
          'sequential_await',
          'parallel_await',
          'async_arrow_functions',
          'async_error_propagation'
        ],
        tasks: [
          {
            description: 'Create an async function that takes a number and returns it doubled (the function should return, not log)',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -3
                ],
                expectedOutput: '-6'
              },
              {
                input: [
                  100
                ],
                expectedOutput: '200'
              },
              {
                input: [
                  0.5
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create an async function that awaits a promise and returns the uppercase version of the resolved string',
            testCases: [
              {
                input: [
                  'hello'
                ],
                expectedOutput: 'HELLO'
              },
              {
                input: [
                  'world'
                ],
                expectedOutput: 'WORLD'
              },
              {
                input: [
                  'JavaScript'
                ],
                expectedOutput: 'JAVASCRIPT'
              },
              {
                input: [
                  ''
                ],
                expectedOutput: ''
              },
              {
                input: [
                  'ABC'
                ],
                expectedOutput: 'ABC'
              }
            ]
          },
          {
            description: 'Create an async function that takes a number. If positive, return doubled value. If zero or negative, throw "Must be positive"',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: 'success: 10'
              },
              {
                input: [
                  0
                ],
                expectedOutput: 'error: Must be positive'
              },
              {
                input: [
                  -5
                ],
                expectedOutput: 'error: Must be positive'
              },
              {
                input: [
                  1
                ],
                expectedOutput: 'success: 2'
              },
              {
                input: [
                  50
                ],
                expectedOutput: 'success: 100'
              }
            ]
          },
          {
            description: 'Create an async function that uses try-catch: await a promise that may reject, return "success" or "failed" based on outcome',
            testCases: [
              {
                input: [
                  true
                ],
                expectedOutput: 'success'
              },
              {
                input: [
                  false
                ],
                expectedOutput: 'failed'
              },
              {
                input: [
                  true
                ],
                expectedOutput: 'success'
              },
              {
                input: [
                  false
                ],
                expectedOutput: 'failed'
              }
            ]
          },
          {
            description: 'Create an async function that takes an array of numbers and returns their sum by awaiting a summing promise',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '6'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    10
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    -1,
                    1
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    5,
                    5,
                    5,
                    5
                  ]
                ],
                expectedOutput: '20'
              }
            ]
          },
          {
            description: 'Create an async function that sequentially awaits two promises: first doubles a number, then adds 10 to the result',
            testCases: [
              {
                input: [
                  5
                ],
                expectedOutput: '20'
              },
              {
                input: [
                  0
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  -5
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  10
                ],
                expectedOutput: '30'
              },
              {
                input: [
                  1
                ],
                expectedOutput: '12'
              }
            ]
          },
          {
            description: 'Create an async function that uses Promise.all with await to double all numbers in an array in parallel',
            testCases: [
              {
                input: [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                expectedOutput: '2,4,6'
              },
              {
                input: [
                  [
                    5
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    0,
                    10
                  ]
                ],
                expectedOutput: '0,20'
              },
              {
                input: [
                  [
                    -1,
                    0,
                    1
                  ]
                ],
                expectedOutput: '-2,0,2'
              },
              {
                input: [
                  []
                ],
                expectedOutput: ''
              }
            ]
          },
          {
            description: 'Create an async arrow function that takes two numbers and returns their product',
            testCases: [
              {
                input: [
                  3,
                  4
                ],
                expectedOutput: '12'
              },
              {
                input: [
                  0,
                  5
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  -2,
                  3
                ],
                expectedOutput: '-6'
              },
              {
                input: [
                  7,
                  7
                ],
                expectedOutput: '49'
              },
              {
                input: [
                  1,
                  1
                ],
                expectedOutput: '1'
              }
            ]
          }
        ]
      },
      {
        id: 'classes',
        title: 'Object-oriented programming',
        outcomes: [
          'what_is_class',
          'class_syntax',
          'constructor_method',
          'this_in_class',
          'instance_properties',
          'instance_methods',
          'creating_instances',
          'static_methods',
          'static_properties',
          'getters_setters',
          'inheritance_extends',
          'super_keyword',
          'method_overriding',
          'instanceof_operator'
        ],
        tasks: [
          {
            description: 'Create a Rectangle class with width and height properties, and a method that returns the area',
            testCases: [
              {
                input: [
                  5,
                  3
                ],
                expectedOutput: '15'
              },
              {
                input: [
                  10,
                  10
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  1,
                  1
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  7,
                  4
                ],
                expectedOutput: '28'
              },
              {
                input: [
                  0,
                  5
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a Counter class with increment, decrement, and getValue methods. Start at 0',
            testCases: [
              {
                input: [
                  [
                    'increment',
                    'increment',
                    'getValue'
                  ]
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [
                    'decrement',
                    'getValue'
                  ]
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  [
                    'getValue'
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    'increment',
                    'decrement',
                    'increment',
                    'getValue'
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    'decrement',
                    'decrement',
                    'decrement',
                    'getValue'
                  ]
                ],
                expectedOutput: '-3'
              }
            ]
          },
          {
            description: 'Create a BankAccount class with deposit, withdraw, and getBalance methods. Withdraw should not allow negative balance',
            testCases: [
              {
                input: [
                  [
                    [
                      'deposit',
                      100
                    ],
                    [
                      'withdraw',
                      30
                    ],
                    [
                      'getBalance'
                    ]
                  ]
                ],
                expectedOutput: '70'
              },
              {
                input: [
                  [
                    [
                      'deposit',
                      50
                    ],
                    [
                      'withdraw',
                      100
                    ],
                    [
                      'getBalance'
                    ]
                  ]
                ],
                expectedOutput: '50'
              },
              {
                input: [
                  [
                    [
                      'getBalance'
                    ]
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    [
                      'deposit',
                      200
                    ],
                    [
                      'deposit',
                      100
                    ],
                    [
                      'getBalance'
                    ]
                  ]
                ],
                expectedOutput: '300'
              },
              {
                input: [
                  [
                    [
                      'withdraw',
                      50
                    ],
                    [
                      'getBalance'
                    ]
                  ]
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a Person class with name property and a static method that returns how many Person instances have been created',
            testCases: [
              {
                input: [
                  [
                    'Alice'
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    'Alice',
                    'Bob'
                  ]
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [
                    'A',
                    'B',
                    'C'
                  ]
                ],
                expectedOutput: '3'
              },
              {
                input: [
                  []
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    'Single'
                  ]
                ],
                expectedOutput: '1'
              }
            ]
          },
          {
            description: 'Create a Temperature class with celsius property and a getter for fahrenheit (celsius * 9/5 + 32)',
            testCases: [
              {
                input: [
                  0
                ],
                expectedOutput: '32'
              },
              {
                input: [
                  100
                ],
                expectedOutput: '212'
              },
              {
                input: [
                  -40
                ],
                expectedOutput: '-40'
              },
              {
                input: [
                  25
                ],
                expectedOutput: '77'
              },
              {
                input: [
                  37
                ],
                expectedOutput: '98.6'
              }
            ]
          },
          {
            description: 'Create an Animal class with name and a speak method. Create a Dog class that extends Animal and overrides speak to return "Woof!"',
            testCases: [
              {
                input: [
                  'Buddy',
                  'dog'
                ],
                expectedOutput: 'Woof!'
              },
              {
                input: [
                  'Rex',
                  'dog'
                ],
                expectedOutput: 'Woof!'
              },
              {
                input: [
                  'Generic',
                  'animal'
                ],
                expectedOutput: '...'
              },
              {
                input: [
                  'Max',
                  'dog'
                ],
                expectedOutput: 'Woof!'
              },
              {
                input: [
                  'Pet',
                  'animal'
                ],
                expectedOutput: '...'
              }
            ]
          },
          {
            description: 'Create a Shape class with a getArea method returning 0. Create Circle and Square classes that extend Shape with proper area calculations',
            testCases: [
              {
                input: [
                  'circle',
                  5
                ],
                expectedOutput: '78.54'
              },
              {
                input: [
                  'square',
                  4
                ],
                expectedOutput: '16'
              },
              {
                input: [
                  'circle',
                  1
                ],
                expectedOutput: '3.14'
              },
              {
                input: [
                  'square',
                  10
                ],
                expectedOutput: '100'
              },
              {
                input: [
                  'circle',
                  0
                ],
                expectedOutput: '0'
              }
            ]
          },
          {
            description: 'Create a TodoList class with add, remove, and getAll methods. Items should be stored in an array',
            testCases: [
              {
                input: [
                  [
                    [
                      'add',
                      'Task 1'
                    ],
                    [
                      'add',
                      'Task 2'
                    ],
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: 'Task 1,Task 2'
              },
              {
                input: [
                  [
                    [
                      'add',
                      'A'
                    ],
                    [
                      'remove',
                      'A'
                    ],
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    [
                      'add',
                      'X'
                    ],
                    [
                      'add',
                      'Y'
                    ],
                    [
                      'remove',
                      'X'
                    ],
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: 'Y'
              },
              {
                input: [
                  [
                    [
                      'add',
                      'One'
                    ],
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: 'One'
              }
            ]
          }
        ]
      },
      {
        id: 'modules',
        title: 'Organizing code with modules',
        outcomes: [
          'what_are_modules',
          'why_use_modules',
          'named_exports',
          'default_export',
          'named_imports',
          'default_import',
          'renaming_imports',
          'import_all',
          're_exporting',
          'module_pattern_iife',
          'revealing_module_pattern',
          'module_scope',
          'dynamic_imports'
        ],
        tasks: [
          {
            description: 'Create a module pattern (using IIFE) that has a private counter and exposes increment, decrement, and getValue methods',
            testCases: [
              {
                input: [
                  [
                    'increment',
                    'increment',
                    'getValue'
                  ]
                ],
                expectedOutput: '2'
              },
              {
                input: [
                  [
                    'decrement',
                    'getValue'
                  ]
                ],
                expectedOutput: '-1'
              },
              {
                input: [
                  [
                    'getValue'
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    'increment',
                    'decrement',
                    'increment',
                    'getValue'
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    'increment',
                    'increment',
                    'increment',
                    'decrement',
                    'getValue'
                  ]
                ],
                expectedOutput: '2'
              }
            ]
          },
          {
            description: 'Create a calculator module with add, subtract, multiply, divide methods that operate on a result value (starts at 0)',
            testCases: [
              {
                input: [
                  [
                    [
                      'add',
                      10
                    ],
                    [
                      'subtract',
                      3
                    ],
                    [
                      'getResult'
                    ]
                  ]
                ],
                expectedOutput: '7'
              },
              {
                input: [
                  [
                    [
                      'add',
                      5
                    ],
                    [
                      'multiply',
                      2
                    ],
                    [
                      'getResult'
                    ]
                  ]
                ],
                expectedOutput: '10'
              },
              {
                input: [
                  [
                    [
                      'add',
                      20
                    ],
                    [
                      'divide',
                      4
                    ],
                    [
                      'getResult'
                    ]
                  ]
                ],
                expectedOutput: '5'
              },
              {
                input: [
                  [
                    [
                      'getResult'
                    ]
                  ]
                ],
                expectedOutput: '0'
              },
              {
                input: [
                  [
                    [
                      'subtract',
                      5
                    ],
                    [
                      'getResult'
                    ]
                  ]
                ],
                expectedOutput: '-5'
              }
            ]
          },
          {
            description: 'Create a user module with private data and public methods: setName, getName, setAge, getAge',
            testCases: [
              {
                input: [
                  [
                    [
                      'setName',
                      'Alice'
                    ],
                    [
                      'getName'
                    ]
                  ]
                ],
                expectedOutput: 'Alice'
              },
              {
                input: [
                  [
                    [
                      'setAge',
                      25
                    ],
                    [
                      'getAge'
                    ]
                  ]
                ],
                expectedOutput: '25'
              },
              {
                input: [
                  [
                    [
                      'setName',
                      'Bob'
                    ],
                    [
                      'setAge',
                      30
                    ],
                    [
                      'getName'
                    ]
                  ]
                ],
                expectedOutput: 'Bob'
              },
              {
                input: [
                  [
                    [
                      'getName'
                    ]
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    [
                      'setName',
                      'Test'
                    ],
                    [
                      'setName',
                      'Final'
                    ],
                    [
                      'getName'
                    ]
                  ]
                ],
                expectedOutput: 'Final'
              }
            ]
          },
          {
            description: 'Create a logger module with log, warn, error methods that store messages, and a getAll method returning all messages as array',
            testCases: [
              {
                input: [
                  [
                    [
                      'log',
                      'info'
                    ],
                    [
                      'warn',
                      'warning'
                    ],
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: '[LOG] info,[WARN] warning'
              },
              {
                input: [
                  [
                    [
                      'error',
                      'oops'
                    ],
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: '[ERROR] oops'
              },
              {
                input: [
                  [
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: ''
              },
              {
                input: [
                  [
                    [
                      'log',
                      'a'
                    ],
                    [
                      'log',
                      'b'
                    ],
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: '[LOG] a,[LOG] b'
              },
              {
                input: [
                  [
                    [
                      'warn',
                      'x'
                    ],
                    [
                      'error',
                      'y'
                    ],
                    [
                      'log',
                      'z'
                    ],
                    [
                      'getAll'
                    ]
                  ]
                ],
                expectedOutput: '[WARN] x,[ERROR] y,[LOG] z'
              }
            ]
          },
          {
            description: 'Create a storage module with set(key, value), get(key), remove(key), and clear() methods',
            testCases: [
              {
                input: [
                  [
                    [
                      'set',
                      'a',
                      1
                    ],
                    [
                      'get',
                      'a'
                    ]
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    [
                      'set',
                      'x',
                      10
                    ],
                    [
                      'set',
                      'y',
                      20
                    ],
                    [
                      'get',
                      'y'
                    ]
                  ]
                ],
                expectedOutput: '20'
              },
              {
                input: [
                  [
                    [
                      'set',
                      'k',
                      5
                    ],
                    [
                      'remove',
                      'k'
                    ],
                    [
                      'get',
                      'k'
                    ]
                  ]
                ],
                expectedOutput: 'undefined'
              },
              {
                input: [
                  [
                    [
                      'set',
                      'a',
                      1
                    ],
                    [
                      'clear'
                    ],
                    [
                      'get',
                      'a'
                    ]
                  ]
                ],
                expectedOutput: 'undefined'
              },
              {
                input: [
                  [
                    [
                      'get',
                      'missing'
                    ]
                  ]
                ],
                expectedOutput: 'undefined'
              }
            ]
          },
          {
            description: 'Create an ID generator module with getNextId() method that returns incrementing IDs starting from 1, and reset() to start over',
            testCases: [
              {
                input: [
                  [
                    'getNextId',
                    'getNextId',
                    'getNextId'
                  ]
                ],
                expectedOutput: '1,2,3'
              },
              {
                input: [
                  [
                    'getNextId'
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    'getNextId',
                    'getNextId',
                    'reset',
                    'getNextId'
                  ]
                ],
                expectedOutput: '1,2,1'
              },
              {
                input: [
                  [
                    'reset',
                    'getNextId'
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    'getNextId',
                    'getNextId',
                    'getNextId',
                    'getNextId',
                    'getNextId'
                  ]
                ],
                expectedOutput: '1,2,3,4,5'
              }
            ]
          },
          {
            description: 'Create a validator module with isEmail(str), isNumber(str), isEmpty(str) methods returning boolean',
            testCases: [
              {
                input: [
                  'isEmail',
                  'test@example.com'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'isEmail',
                  'invalid'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'isNumber',
                  '123'
                ],
                expectedOutput: 'true'
              },
              {
                input: [
                  'isNumber',
                  'abc'
                ],
                expectedOutput: 'false'
              },
              {
                input: [
                  'isEmpty',
                  ''
                ],
                expectedOutput: 'true'
              }
            ]
          },
          {
            description: 'Create a queue module with enqueue(item), dequeue(), peek(), and size() methods',
            testCases: [
              {
                input: [
                  [
                    [
                      'enqueue',
                      'a'
                    ],
                    [
                      'enqueue',
                      'b'
                    ],
                    [
                      'dequeue'
                    ]
                  ]
                ],
                expectedOutput: 'a'
              },
              {
                input: [
                  [
                    [
                      'enqueue',
                      1
                    ],
                    [
                      'enqueue',
                      2
                    ],
                    [
                      'peek'
                    ]
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    [
                      'enqueue',
                      'x'
                    ],
                    [
                      'size'
                    ]
                  ]
                ],
                expectedOutput: '1'
              },
              {
                input: [
                  [
                    [
                      'dequeue'
                    ]
                  ]
                ],
                expectedOutput: 'undefined'
              },
              {
                input: [
                  [
                    [
                      'enqueue',
                      'a'
                    ],
                    [
                      'enqueue',
                      'b'
                    ],
                    [
                      'dequeue'
                    ],
                    [
                      'dequeue'
                    ],
                    [
                      'size'
                    ]
                  ]
                ],
                expectedOutput: '0'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Master python from fundamentals to advanced concepts',
    topics: []
  }
];

// Helper function to format outcomes for display
export const formatOutcomes = (outcomes) => {
  if (!outcomes || outcomes.length === 0) return ''

  return outcomes
    .map((o, i) => {
      if (typeof o === 'object' && o.id && o.teach) {
        return `${i + 1}. ${o.id}: ${o.teach}`
      }
      // Legacy string format fallback
      return `${i + 1}. ${o.replace(/_/g, ' ')}`
    })
    .join('\n')
}

export default courses