# Trybe Futebol Clube Project

## Descrição do Projeto

Este projeto tem como foco o desenvolvimento de um sistema de gestão de clubes de futebol, incluindo funcionalidades para gerenciamento de times, partidas, autenticação de usuários e classificações. É parte do currículo da Trybe e envolve desenvolvimento de backend, gerenciamento de banco de dados e integração com um frontend pré-existente.

## Estrutura do Projeto

O projeto é composto pelos seguintes componentes principais:

1. **Banco de Dados:** Utiliza um contêiner Dockerizado MySQL configurado no arquivo `docker-compose.yml` sob o serviço `db`.
2. **Backend:** Desenvolvido utilizando Node.js e Express.js, localizado no diretório `/app/backend`.
3. **Frontend:** Já concluído e localizado em um diretório separado, comunicando-se com o backend através de endpoints definidos.
4. **Docker:** Configuração para contêineres Docker executarem o backend, frontend e banco de dados juntos.

## Configurando o Projeto

1. **Configuração do Banco de Dados:**
   - Certifique-se de que o Docker está instalado.
   - Execute `npm run compose:up` para iniciar os contêineres Docker.
   - Acesse o MySQL utilizando as credenciais configuradas (`docker-compose.yml`).

2. **Configuração do Backend:**
   - Navegue até `/app/backend`.
   - Instale as dependências utilizando `npm install`.
   - Inicie o servidor backend com `npm start`.

3. **Configuração do Frontend:** (Sem modificações necessárias)
   - O frontend já está concluído e acessível via `http://localhost:3000/`.

4. **Configuração do Docker:**
   - Configure os Dockerfiles nos diretórios raiz do backend e frontend.
   - Utilize `npm run compose:up` para iniciar todos os contêineres juntos.

## Endpoints da API

- `/times`: Obtenha todos os times.
- `/times/:id`: Obtenha dados de um time específico.
- `/login`: Autentique o login do usuário.
- `/login/role`: Valide o token e obtenha a função do usuário.
- `/partidas`: Gerencie partidas (criar, atualizar, filtrar).
- `/partidas/:id/encerrar`: Encerre uma partida.
- `/tabela/classificacao`: Obtenha dados de desempenho dos times.
- `/tabela/classificacao/casa`: Obtenha dados de desempenho dos times em casa.
- `/tabela/classificacao/visitante`: Obtenha dados de desempenho dos times visitantes.

## Testes

- Os testes do backend estão localizados em `/app/backend/src/__tests__`.
- Utilize `npm test` para executar os testes do backend e alcançar as metas de cobertura especificadas nos requisitos do projeto.


