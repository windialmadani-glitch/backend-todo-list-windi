const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getError = async (doc) => {
  try {
    await doc.validate();
    return null;
  } catch (err) {
    return err;
  }
};

describe('User model (unit test)', () => {
  test('valid kalau name, email, password lengkap', async () => {
    const u = new User({
      name: 'Windi',
      email: 'WINDI@Example.com',
      password: 'password123',
    });
    expect(await getError(u)).toBeNull();
    expect(u.email).toBe('windi@example.com'); // lowercase otomatis
    expect(u.role).toBe('user'); // default role
  });

  test('tidak valid kalau data kosong', async () => {
    const err = await getError(new User({}));
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  test('tidak valid kalau password kurang dari 6 karakter', async () => {
    const err = await getError(
      new User({ name: 'A', email: 'a@a.com', password: '123' })
    );
    expect(err.errors.password).toBeDefined();
  });

  test('tidak valid kalau role bukan user/admin', async () => {
    const err = await getError(
      new User({
        name: 'A',
        email: 'a@a.com',
        password: '123456',
        role: 'hacker',
      })
    );
    expect(err.errors.role).toBeDefined();
  });

  test('comparePassword cocok / tidak cocok', async () => {
    const hash = await bcrypt.hash('rahasia123', 4);
    const u = new User();
    expect(await u.comparePassword('rahasia123', hash)).toBe(true);
    expect(await u.comparePassword('salah', hash)).toBe(false);
  });
});