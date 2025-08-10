# Authentication Tests

This directory contains comprehensive tests for the authentication system of the English Website backend.

## Test Structure

```
tests/
├── setup.ts                    # Global test setup and configuration
├── helpers/
│   └── testUtils.ts           # Test utility functions and mocks
├── controllers/
│   └── authController.test.ts # Unit tests for auth controller functions
├── routes/
│   └── authRoutes.test.ts     # Integration tests for auth routes
├── middleware/
│   └── auth.test.ts           # Tests for authentication middleware
├── models/
│   └── User.test.ts           # Tests for User model
├── integration/
│   └── authEndpoints.test.ts  # End-to-end integration tests
└── README.md                   # This file
```

## Test Coverage

The tests cover the following authentication endpoints:

### 1. POST /api/auth/register - User Registration
- ✅ Successful user registration
- ✅ Duplicate email/username validation
- ✅ Default role assignment
- ✅ Required field validation
- ✅ Error handling

### 2. POST /api/auth/login - User Login
- ✅ Successful login with valid credentials
- ✅ Invalid email/password handling
- ✅ Deactivated account handling
- ✅ Last login update
- ✅ Error handling

### 3. GET /api/auth/profile - Get User Profile
- ✅ Authenticated profile access
- ✅ Unauthorized access handling
- ✅ User not found scenarios
- ✅ Error handling

### 4. POST /api/auth/logout - User Logout
- ✅ Successful logout
- ✅ Authentication requirement
- ✅ Error handling

## Running Tests

### Prerequisites
1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure MongoDB is running locally or set up a test database

3. Create a `.env.test` file with test configuration:
   ```env
   NODE_ENV=test
   MONGODB_URI_TEST=mongodb://localhost:27017/english_website_test
   JWT_SECRET=test-secret-key-for-testing-only
   ```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Files
```bash
# Run only controller tests
npm test -- authController.test.ts

# Run only route tests
npm test -- authRoutes.test.ts

# Run only middleware tests
npm test -- auth.test.ts
```

### Run Tests by Pattern
```bash
# Run all tests containing "register" in the name
npm test -- --testNamePattern="register"

# Run all tests in a specific describe block
npm test -- --testNamePattern="User Registration"
```

## Test Types

### 1. Unit Tests (`authController.test.ts`)
- Test individual controller functions in isolation
- Mock external dependencies (JWT, database)
- Focus on business logic and error handling

### 2. Integration Tests (`authRoutes.test.ts`)
- Test complete request-response cycle
- Use supertest for HTTP assertions
- Test route-level functionality

### 3. Middleware Tests (`auth.test.ts`)
- Test authentication middleware
- Mock JWT verification
- Test various token scenarios

### 4. Model Tests (`User.test.ts`)
- Test User model validation
- Test password hashing
- Test database operations

### 5. End-to-End Tests (`authEndpoints.test.ts`)
- Test complete authentication flows
- Test concurrent operations
- Test error scenarios and edge cases

## Test Utilities

### `testUtils.ts`
- `createTestUser()` - Create test users with default values
- `generateTestToken()` - Generate JWT tokens for testing
- `mockRequest()` - Create mock request objects
- `mockResponse()` - Create mock response objects

### Global Setup (`setup.ts`)
- Database connection management
- Environment configuration
- Global test cleanup
- Console mocking

## Database Testing

- Tests use a separate test database
- Database is cleaned between tests
- Each test runs in isolation
- No test data persists between test runs

## Mocking Strategy

- **JWT**: Mocked to avoid token expiration issues
- **bcrypt**: Mocked for password hashing tests
- **Console**: Mocked to reduce test output noise
- **Database**: Real MongoDB connection for integration testing

## Best Practices

1. **Test Isolation**: Each test is independent
2. **Cleanup**: Database is cleaned after each test
3. **Mocking**: External dependencies are mocked appropriately
4. **Assertions**: Clear and specific test assertions
5. **Error Handling**: Test both success and failure scenarios
6. **Edge Cases**: Test boundary conditions and error states

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env.test`

2. **Test Timeout**
   - Increase timeout in `jest.config.js`
   - Check for hanging database operations

3. **JWT Verification Errors**
   - Ensure `JWT_SECRET` is set in test environment
   - Check token generation in tests

4. **Password Hashing Issues**
   - Ensure bcrypt is properly mocked
   - Check password field modifications

### Debug Mode
Run tests with verbose output:
```bash
npm test -- --verbose
```

### Debug Specific Test
Add `debugger` statement and run:
```bash
npm test -- --runInBand --no-cache
```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Test both success and failure scenarios
4. Mock external dependencies appropriately
5. Clean up test data
6. Add tests for edge cases and error conditions

## Coverage Goals

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

Run coverage report to check current status:
```bash
npm run test:coverage
```
