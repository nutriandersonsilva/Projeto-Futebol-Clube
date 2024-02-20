import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import SequelizeMatch from '../database/models/SequelizeMatch';
import matchMock from './mocks/Match.mock';
import teamMock from './mocks/Team.mocks';
import JWT from '../utils/JWT';
import { jwtPayload } from './mocks/User.mock';
import SequelizeTeam from '../database/models/SequelizeTeam';
chai.use(chaiHttp);
const { expect } = chai;

describe('Match', () => {
  afterEach(sinon.restore);
  it('Deve retornar a lista de partidas', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(SequelizeMatch.bulkBuild(matchMock.matches));
    const { status, body } = await chai.request(app).get('/matches');
    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchMock.matches);
  });

  it('Deve retornar a lista de partidas em andamento', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(SequelizeMatch.bulkBuild(matchMock.matchesInProgress));
    const { status, body } = await chai.request(app).get('/matches?inProgress=true');
    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchMock.matchesInProgress);
  });

  it('Deve retornar a lista de partidas finalizadas', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(SequelizeMatch.bulkBuild(matchMock.finishedMatches));
    const { status, body } = await chai.request(app).get('/matches?inProgress=false');
    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchMock.finishedMatches);
  });

  it('Deve retornar finaliza uma partida caso ela esteja em andamento', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    sinon.stub(SequelizeMatch, 'update').resolves([1]);
    const { status, body } = await chai.request(app).patch('/matches/1/finish').set('Authorization', 'genericToken');
    expect(status).to.equal(200);
    expect(body).to.deep.equal({ message: 'Finished' });
  });

  it('Deve retornar uma mensagem de erro caso não seja enviado um token no headers', async function() {
    const { status, body } = await chai.request(app).patch('/matches/2/finish');
    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Token not found' });
  });

  it('Deve retornar uma mensagem de erro caso a partida não seja atualizada', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    sinon.stub(SequelizeMatch, 'update').resolves([0]);
    const { status, body } = await chai.request(app).patch('/matches/2/finish').set('Authorization', 'genericToken');
    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'Match not updated' });
  });

  it('Deve retornar uma mensagem de erro se os dados do corpo da requisição estiverem incompletos', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    const { status, body } = await chai.request(app).patch('/matches/1').set('Authorization', 'genericToken').send(matchMock.invalidGoalsToUpdate);
    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'awayTeamGoals is required' });
  });

  it('Deve retornar atualiza os gols dos times', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    sinon.stub(SequelizeMatch, 'update').resolves([1]);
    const { status, body } = await chai.request(app).patch('/matches/1').set('Authorization', 'genericToken').send(matchMock.goalsToUpdate);
    expect(status).to.equal(200);
    expect(body).to.deep.equal({ message: 'Updated' });
  });

  it('Deve retornar não atualiza os gols dos times caso os dados já estejam no banco', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    sinon.stub(SequelizeMatch, 'update').resolves([0]);
    const { status, body } = await chai.request(app).patch('/matches/2').set('Authorization', 'genericToken').send(matchMock.goalsToUpdate);
    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'Match not updated' });
  });

  it('Deve retornar a partida criada', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    sinon.stub(SequelizeTeam, 'findByPk')
      .onFirstCall().resolves(SequelizeTeam.build(teamMock.teams[0]))
      .onSecondCall().resolves(SequelizeTeam.build(teamMock.teams[1]));
    sinon.stub(SequelizeMatch, 'create').resolves(SequelizeMatch.build(matchMock.createdMatch));
    const { status, body } = await chai.request(app).post('/matches').set('Authorization', 'genericToken').send(matchMock.matchToCreate);
    expect(status).to.equal(201);
    expect(body).to.deep.equal(matchMock.createdMatch);
  });

  it('Deve retornar uma mensagem de erro se os dados do corpo da requisição estiverem incompletos', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    const { status, body } = await chai.request(app).post('/matches').set('Authorization', 'genericToken').send(matchMock.invalidMatchToCreate);
    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'awayTeamGoals is required' });
  });

  it('Deve retornar uma mensagem de erro se os ids forem iguais', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    const { status, body } = await chai.request(app).post('/matches').set('Authorization', 'genericToken').send(matchMock.sameTeamsMatchToCreate);
    expect(status).to.equal(422);
    expect(body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
  });

  it('Deve retornar uma mensagem de erro se um dos times não esteja cadastrado no banco de dados', async function() {
    sinon.stub(JWT, 'verify').resolves(jwtPayload);
    sinon.stub(SequelizeTeam, 'findByPk')
      .onFirstCall().resolves(SequelizeTeam.build(teamMock.teams[0]))
      .onSecondCall().resolves(null);
    const { status, body } = await chai.request(app).post('/matches').set('Authorization', 'genericToken').send(matchMock.matchToCreate);
    expect(status).to.equal(404);
    expect(body).to.deep.equal({ message: 'There is no team with such id!' });
  });
});