export class MassiveErrorMessages {
    public static MissingPasswordError :string =  'No password was given';
    public static AttemptTooSoonError :string = 'Account is currently locked. Try again later';
    public static TooManyAttemptsError :string = 'Account locked due to too many failed login attempts';
    public static NoSaltValueStoredError :string = 'Authentication not possible. No salt value stored';
    public static IncorrectPasswordError :string = 'Password or username is incorrect';
    public static IncorrectUsernameError :string = 'Password or username is incorrect';
    public static MissingUsernameError :string = 'No username was given';
    public static UserExistsError :string = 'A user with the given username is already registered';
}
