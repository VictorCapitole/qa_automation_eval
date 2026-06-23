const longText = 'A'.repeat(260);

const orderData = {
    baseUrl: 'https://www.saucedemo.com/',

    users: {
        standard: {
            username: 'standard_user',
            password: 'secret_sauce',
        },
        invalid: {
            username: 'invalid_user',
            password: 'invalid_password',
        },
        lockedOut: {
            username: 'locked_out_user',
            password: 'secret_sauce',
        },
        emptyUsername: {
            username: '',
            password: 'secret_sauce',
        },
        emptyPassword: {
            username: 'standard_user',
            password: '',
        },
    },

    products: {
        backpack: 'Sauce Labs Backpack',
    },

    customers: {
        valid: {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: '12345',
        },
        missingFirstName: {
            firstName: '',
            lastName: 'Doe',
            postalCode: '12345',
        },
        missingLastName: {
            firstName: 'John',
            lastName: '',
            postalCode: '12345',
        },
        missingPostalCode: {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: '',
        },
        injectionPayload: {
            firstName: '<script>alert("xss")</script>',
            lastName: "' OR '1'='1",
            postalCode: '12345',
        },
        boundaryLength: {
            firstName: longText,
            lastName: longText,
            postalCode: '12345',
        },
        invalidPostalCode: {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: 'ABCDE',
        },
    },

    messages: {
        usernameRequired: 'Epic sadface: Username is required',
        passwordRequired: 'Epic sadface: Password is required',
        invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
        lockedOutUser: 'Epic sadface: Sorry, this user has been locked out.',
        firstNameRequired: 'Error: First Name is required',
        lastNameRequired: 'Error: Last Name is required',
        postalCodeRequired: 'Error: Postal Code is required',
        orderCompleted: 'Thank you for your order!',
    },
};

module.exports = { orderData };
