import request from 'supertest';
import app from '../src/app'; // Assuming your Express app instance is exported as 'app'
import User from '../src/models/User';
import Products from '../src/models/Products';
import CartItem from '../src/models/CartItem';

describe('User Controller', () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
    const response = await request(app).post('/api/user/register').send({
      fullname: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    token = response.body.accessToken;

    const Productresponse = await request(app)
      .post('/api/product')
      .send({
        name: 'Bag Of Potato',
        price: 100000,
        description: 'Sample description',
      })
      .set('Authorization', `Bearer ${token}`);

    productId = Productresponse.body.id;
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'test@example.com' });
    await User.deleteMany({ email: 'test2@example.com' });
    await Products.deleteMany({ _id: productId });
    await CartItem.deleteMany();
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/api/user/register').send({
      fullname: 'testuser2',
      email: 'test2@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('fullname', 'testuser2');
    expect(response.body.data).toHaveProperty('email', 'test2@example.com');
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should login a user', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    token = response.body.accessToken;
  });

  it('should add to user cart', async () => {
    let quantity = 3;
    const response = await request(app)
      .post('/api/user/add-to-cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity,
      });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('productId', productId);
    expect(response.body.data).toHaveProperty('quantity', quantity);
  });

  it('should get user cart', async () => {
    const response = await request(app)
      .get('/api/user/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
