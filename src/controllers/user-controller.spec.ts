class UserController {
  async auth(email: string, password: string) {
    if (!email || !password) { return 400; }

    return 200;
  }
}

describe('User Controller', () => {
  test('should return 400 if an empty email is sent', async () => {
    const sut = new UserController();
    const result = await sut.auth('', 'any_password');

    expect(result).toEqual(400);
  });

  test('should return 400 if an empty password is sent', async () => {
    const sut = new UserController();
    const result = await sut.auth('any_email', '');

    expect(result).toEqual(400);
  });
});
