// This file contains all error message.

module.exports = {
    Database: {
        GET_FAIL: 'Could\'t get the entry',
        CREATION_FAIL: 'Could\'t create the entry'
    },  
    System : {
        CONFIG_NOT_FOUND: 'Couldn\'t find the config file.',
        HASHING_FAILED: 'The system function of hashing failed to process.'
    },
    Users : {
        CREATION_FAIL: 'Couldn\'t create user',
        ERASEFAILED: 'Couldn\'t erase user',
        NOTFOUND: 'Requested user not found',
        BADPASSWORD: 'The given password do not match the one of the user.'
    },
    Request : {
        MISSINGARGUMENTS: 'Some arguments are missing to complete the asked request',
        WRONGARGUMENTS: 'The type of the given argiuments seems to be invalid',
        UNAUTHORIZED: 'The user must be authenticated to do this request'
    }
}