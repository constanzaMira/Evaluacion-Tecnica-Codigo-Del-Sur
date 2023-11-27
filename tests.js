const supertest = require('supertest');
const chai = require('chai');
const app = require('./index'); 

const expect = chai.expect;
const request = supertest(app);

describe('POST /users/register', () => {
  it('debería registrar un nuevo usuario', (done) => {
    request.post('/users/register')
      .send({ email: 'seba@gmail.com', password: '123456', firstName: 'Sebastian', lastName: 'Mira' })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('no debería registrar un usuario con un email no válido', (done) => {
    request.post('/users/register')
      .send({ email: 'mailinvalido', password: '123456', firstName: 'Constanza', lastName: 'Mira' })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400); // Cambia el código de estado según tu lógica de validación
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('El formato del email es inválido');
        done();
      });
  });
});
