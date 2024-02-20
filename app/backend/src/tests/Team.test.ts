import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import SequelizeTeam from '../database/models/SequelizeTeam';
import teamMock from './mocks/Team.mocks';
chai.use(chaiHttp);

const { expect } = chai;
describe('Teams', () => {
  afterEach(sinon.restore);
  it('Deve retornar todos os times', async function() {
    sinon.stub(SequelizeTeam, 'findAll').resolves(teamMock.teams.map((team) => SequelizeTeam.build(team)));
    const { status, body } = await chai.request(app).get('/teams');
    expect(status).to.equal(200);
    expect(body).to.deep.equal(teamMock.teams);
  });

  it('Deve retornar o time com id correto', async function() {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(SequelizeTeam.build(teamMock.teams[0]));
    const { status, body } = await chai.request(app).get('/teams/1');
    expect(status).to.equal(200);
    expect(body).to.deep.equal(teamMock.teams[0]);
  });

  it('Deve retornar uma mensagem de erro se não encontrar o time', async function() {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(null);
    const { status, body } = await chai.request(app).get('/teams/9455');
    expect(status).to.equal(404);
    expect(body).to.deep.equal({ message: 'Team 9455 not found' });
  });
});