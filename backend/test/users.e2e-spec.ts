import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { Verification } from 'src/users/entities/verification.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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
  entities: [User, Verification]
});


const mockUserInf = {
  email: 'tryyyy@qq.com',
  password: '19990507',
  role: 'Client',
  jwtToken: ''
}

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    await connection.initialize();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {

    await connection.dropDatabase();
    app.close();
  });

  describe('createAccount', () => {

    it('should create an account', () => {
      return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
        query: `mutation{
          createAccount(input:{email:"${mockUserInf.email}", password:"${mockUserInf.password}", role:${mockUserInf.role}}){
            ok,
            error
          }
        }`
      })
        .expect(200)
        .expect(res => {
          const { ok, error } = res.body.data.createAccount;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        })

    })
  })

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
        query: `mutation{
          login(input:{email:"${mockUserInf.email}", password:"${mockUserInf.password}"}){
            ok
            error
            token
          }
        }`
      })
        .expect(200)
        .expect(res => {
          const { ok, error, token } = res.body.data.login;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(token).toEqual(expect.any(String));
          mockUserInf.jwtToken = token;
        })
    })
    it('should not be able to login with wrong credentials', () => {
      return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
        query: `mutation{
          login(input:{email:"${mockUserInf.email}", password:"wrongPassword"}){
            ok
            error
            token
          }
        }`
      })
        .expect(200)
        .expect(res => {
          const { ok, error, token } = res.body.data.login;
          expect(ok).toBe(false);
          expect(error).toBe('wrong password');
          expect(token).toBe(null);
        })
    })
  })

  describe('getUserProfile', () => {
    let userId: number;
    beforeAll(async () => {
      let userRepository = await connection.getRepository(User);
      let [user] = await userRepository.find();
      userId = user.id;
    })

    it('should get a user profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set(`X-JWT`, mockUserInf.jwtToken)
        .send({
          query: `{
          getUserProfile(userId:${userId}){
            ok,
            error,
            user{
              id
            }
          }
        }`
        })
        .expect(200)
        .expect(res => {
          let { ok, error, user } = res.body.data.getUserProfile;
          let { id } = user;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        })
    })
    it('can not get a user profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set(`X-JWT`, mockUserInf.jwtToken)
        .send({
          query: `{
        getUserProfile(userId:66666){
          ok,
          error,
          user{
            id
          }
        }
      }`
        })
        .expect(200)
        .expect(res => {
          let { ok, error } = res.body.data.getUserProfile
          expect(ok).toBe(false);
          expect(error).toBe('User not found');
        })
    })
  })

  describe('me', () => {
    it('should find me with correct token', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set(`X-JWT`, mockUserInf.jwtToken)
        .send({
          query: `{
            me{
              role,
              email
            }
          }`
        })
        .expect(200)
        .expect(res => {
          let { role, email } = res.body.data.me
          expect(role).toBe(mockUserInf.role);
          expect(email).toBe(mockUserInf.email);
        })
    })

    it('can not find me with wrong token', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set(`X-JWT`, 'I am a wrong token')
        .send({
          query: `{
          me{
            role,
            email
          }
        }`
        })
        .expect(200)
        .expect(res => {
          let { errors } = res.body;
          expect(errors).toEqual(expect.any(Array));
        })
    })
  })

  describe('editProfile', () => {
    let newEmail: string = 'newTest@email.com'
    it('can edit profile with right token', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set(`X-JWT`, mockUserInf.jwtToken)
        .send({
          query: `mutation{
            editProfile(input:{email:"${newEmail}"}){
              ok,
              error
            }
          }`
        })
        .expect(200)
        .expect(res => {
          let { ok, error } = res.body.data.editProfile;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        })
    })
    it('should get the new email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set(`X-JWT`, mockUserInf.jwtToken)
        .send({
          query: `{
          me{
            email
          }
        }`
        })
        .expect(200)
        .expect(res => {
          let { email } = res.body.data.me
          expect(email).toBe(newEmail);
        })
    })
  })

  describe('verifyEmail', () => {
    let verCode: string;
    beforeAll(async () => {
      let verification = await connection.getRepository(Verification);
      let [ver] = await verification.find();
      verCode = ver.code;
    })
    it('should verify the email with right code', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation{
            verifyEmail(input:{code:"${verCode}"}){
              ok,
              error
            }
          }`
        })
        .expect(200)
        .expect(res => {
          let { ok, error } = res.body.data.verifyEmail;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        })
    })

    it('should fail on verification code not found', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation{
          verifyEmail(input:{code:"wrongCode"}){
            ok,
            error
          }
        }`
        })
        .expect(200)
        .expect(res => {
          let { ok, error } = res.body.data.verifyEmail;
          expect(ok).toBe(false);
          expect(error).toBe('Verification not found.');
        })
    })
  })


});
