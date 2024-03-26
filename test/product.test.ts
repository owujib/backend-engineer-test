// productController.test.ts

import request from 'supertest';
import app from '../src/app';
import Products from '../src/models/Products';
import User from '../src/models/User';
import { PRODUCT_STATUS_ENUM } from '../src/shared/enums';

describe('Product Controller', () => {
  let productId: string;
  let token: string;

  beforeAll(async () => {
    const response = await request(app).post('/api/user/register').send({
      fullname: 'testuser',
      email: 'test3@example.com',
      password: 'password123',
    });

    token = response.body.accessToken;
    const productResponse = await request(app)
      .post('/api/product')
      .send({
        name: 'Test Product',
        price: 19000.99,
        description: 'This is a test product',
      })
      .set('Authorization', `Bearer ${token}`);
    productId = productResponse.body._id;
  });

  afterAll(async () => {
    await Products.deleteMany({ name: 'Test Product' });
    await User.deleteMany({ email: 'test3@example.com' });
  });

  it('should create a new product', async () => {
    const response = await request(app).post('/api/product').send({
      name: 'New Test Product',
      price: 5000,
      description: 'This is a new test product',
    });

    console.log({ a: response.body });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'New Test Product');
    expect(response.body).toHaveProperty('price', 5000);
  });

  it('should get all products', async () => {
    const response = await request(app).get('/api/product');
    expect(response.status).toBe(200);
  });

  it('should get product by ID', async () => {
    const response = await request(app)
      .get(`/api/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', productId);
  });

  it('should update product', async () => {
    const response = await request(app)
      .put(`/api/product/${productId}`)
      .send({
        name: 'Updated Test Product',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'data',
      'Product updated successfully',
    );
  });

  it('should update product status', async () => {
    const response = await request(app)
      .put(`/api/product/${productId}/status`)
      .send({
        status: PRODUCT_STATUS_ENUM.IN_ACTIVE,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id', productId);
  });

  it('should delete product', async () => {
    const response = await request(app)
      .delete(`/api/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'data',
      'Product deleted successfully',
    );
  });
});
