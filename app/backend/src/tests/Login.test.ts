import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { invalidEmailLoginBody, invalidLoginBody, invalidPasswordLoginBody, jwtPayload, registeredUser, validLoginBody } from './mocks/User.mock';
import SequelizeUser from '../database/models/SequelizeUser';
import JWT from '../utils/JWT';
chai.use(chaiHttp);

const { expect } = chai;
describe('Login', () => {
  afterEach(sinon.restore);
  it('Deve retornar uma mensagem de erro com body inválido', async function() {
    const { status, body } = await chai.request(app).post('/login').send({});
    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('Deve retornar uma mensagem de erro com email inválido', async function() {
    const { status, body } = await chai.request(app).post('/login').send(invalidEmailLoginBody);
    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Deve retornar uma mensagem de erro com senha inválida', async function() {
    const { status, body } = await chai.request(app).post('/login').send(invalidPasswordLoginBody);
    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Deve retornar um token quando o login é efetuado com sucesso', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(SequelizeUser.build(registeredUser));
    sinon.stub(JWT, 'sign').returns('token');
    const { status, body } = await chai.request(app).post('/login').send(validLoginBody);
    expect(status).to.equal(200);
    expect(body).to.have.property('token');
  });

  it('Deve retornar uma mensagem de erro se não encontrar o usuário', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(null);
    const { status, body } = await chai.request(app).post('/login').send(validLoginBody);
    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Deve retornar uma mensagem de erro se a senha enviada não corresponder a senha salva no banco', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(SequelizeUser.build(registeredUser));
    const { status, body } = await chai.request(app).post('/login').send(invalidLoginBody);
    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Deve retornar o role do usuário se receber um token válido', async function() {
    sinon.stub(JWT, 'verify').returns(jwtPayload);
    const { status, body } = await chai.request(app).get('/login/role').set('Authorization', 'validToken');
    expect(status).to.equal(200);
    expect(body).to.deep.equal({ role: jwtPayload.role });
  });

  it('Deve retornar uma mensagem de erro se receber um token inválido', async function() {
    sinon.stub(JWT, 'verify').returns('Token must be a valid token');
    const { status, body } = await chai.request(app).get('/login/role').set('Authorization', 'invalidToken');
    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Token must be a valid token' });
  });
});