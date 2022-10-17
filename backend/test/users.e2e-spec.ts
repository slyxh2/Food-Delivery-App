import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, getConnection } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { Verification } from 'src/users/entities/verification.entity';


const GRAPHQL_ENDPOINT = '/graphql';

let connection = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  // entities: [User, Verification]
});

connection.initialize();

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {

    await connection.dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    const userEmail = "tryyyy@qq.com";
    it('should create an account', async () => {
      return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
        query: `mutation{
          createAccount(input:{email:"${userEmail}", password:"750772121", role:Client}){
            ok,
            error
          }
        }`
      }).expect(200);
    })
  })


  // it.todo('me');
  // it.todo('getUserProfile');
  // it.todo('login');
  // it.todo('editProfile');
  // it.todo('verifyEmail');


});
