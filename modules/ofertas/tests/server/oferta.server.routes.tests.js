'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Oferta = mongoose.model('Oferta'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  oferta;

/**
 * Oferta routes tests
 */
describe('Oferta CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Oferta
    user.save(function () {
      oferta = {
        name: 'Oferta name'
      };

      done();
    });
  });

  it('should be able to save a Oferta if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Oferta
        agent.post('/api/ofertas')
          .send(oferta)
          .expect(200)
          .end(function (ofertaSaveErr, ofertaSaveRes) {
            // Handle Oferta save error
            if (ofertaSaveErr) {
              return done(ofertaSaveErr);
            }

            // Get a list of Ofertas
            agent.get('/api/ofertas')
              .end(function (ofertasGetErr, ofertasGetRes) {
                // Handle Ofertas save error
                if (ofertasGetErr) {
                  return done(ofertasGetErr);
                }

                // Get Ofertas list
                var ofertas = ofertasGetRes.body;

                // Set assertions
                (ofertas[0].user._id).should.equal(userId);
                (ofertas[0].name).should.match('Oferta name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Oferta if not logged in', function (done) {
    agent.post('/api/ofertas')
      .send(oferta)
      .expect(403)
      .end(function (ofertaSaveErr, ofertaSaveRes) {
        // Call the assertion callback
        done(ofertaSaveErr);
      });
  });

  it('should not be able to save an Oferta if no name is provided', function (done) {
    // Invalidate name field
    oferta.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Oferta
        agent.post('/api/ofertas')
          .send(oferta)
          .expect(400)
          .end(function (ofertaSaveErr, ofertaSaveRes) {
            // Set message assertion
            (ofertaSaveRes.body.message).should.match('Please fill Oferta name');

            // Handle Oferta save error
            done(ofertaSaveErr);
          });
      });
  });

  it('should be able to update an Oferta if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Oferta
        agent.post('/api/ofertas')
          .send(oferta)
          .expect(200)
          .end(function (ofertaSaveErr, ofertaSaveRes) {
            // Handle Oferta save error
            if (ofertaSaveErr) {
              return done(ofertaSaveErr);
            }

            // Update Oferta name
            oferta.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Oferta
            agent.put('/api/ofertas/' + ofertaSaveRes.body._id)
              .send(oferta)
              .expect(200)
              .end(function (ofertaUpdateErr, ofertaUpdateRes) {
                // Handle Oferta update error
                if (ofertaUpdateErr) {
                  return done(ofertaUpdateErr);
                }

                // Set assertions
                (ofertaUpdateRes.body._id).should.equal(ofertaSaveRes.body._id);
                (ofertaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ofertas if not signed in', function (done) {
    // Create new Oferta model instance
    var ofertaObj = new Oferta(oferta);

    // Save the oferta
    ofertaObj.save(function () {
      // Request Ofertas
      request(app).get('/api/ofertas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Oferta if not signed in', function (done) {
    // Create new Oferta model instance
    var ofertaObj = new Oferta(oferta);

    // Save the Oferta
    ofertaObj.save(function () {
      request(app).get('/api/ofertas/' + ofertaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', oferta.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Oferta with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ofertas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Oferta is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Oferta which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Oferta
    request(app).get('/api/ofertas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Oferta with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Oferta if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Oferta
        agent.post('/api/ofertas')
          .send(oferta)
          .expect(200)
          .end(function (ofertaSaveErr, ofertaSaveRes) {
            // Handle Oferta save error
            if (ofertaSaveErr) {
              return done(ofertaSaveErr);
            }

            // Delete an existing Oferta
            agent.delete('/api/ofertas/' + ofertaSaveRes.body._id)
              .send(oferta)
              .expect(200)
              .end(function (ofertaDeleteErr, ofertaDeleteRes) {
                // Handle oferta error error
                if (ofertaDeleteErr) {
                  return done(ofertaDeleteErr);
                }

                // Set assertions
                (ofertaDeleteRes.body._id).should.equal(ofertaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Oferta if not signed in', function (done) {
    // Set Oferta user
    oferta.user = user;

    // Create new Oferta model instance
    var ofertaObj = new Oferta(oferta);

    // Save the Oferta
    ofertaObj.save(function () {
      // Try deleting Oferta
      request(app).delete('/api/ofertas/' + ofertaObj._id)
        .expect(403)
        .end(function (ofertaDeleteErr, ofertaDeleteRes) {
          // Set message assertion
          (ofertaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Oferta error error
          done(ofertaDeleteErr);
        });

    });
  });

  it('should be able to get a single Oferta that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Oferta
          agent.post('/api/ofertas')
            .send(oferta)
            .expect(200)
            .end(function (ofertaSaveErr, ofertaSaveRes) {
              // Handle Oferta save error
              if (ofertaSaveErr) {
                return done(ofertaSaveErr);
              }

              // Set assertions on new Oferta
              (ofertaSaveRes.body.name).should.equal(oferta.name);
              should.exist(ofertaSaveRes.body.user);
              should.equal(ofertaSaveRes.body.user._id, orphanId);

              // force the Oferta to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Oferta
                    agent.get('/api/ofertas/' + ofertaSaveRes.body._id)
                      .expect(200)
                      .end(function (ofertaInfoErr, ofertaInfoRes) {
                        // Handle Oferta error
                        if (ofertaInfoErr) {
                          return done(ofertaInfoErr);
                        }

                        // Set assertions
                        (ofertaInfoRes.body._id).should.equal(ofertaSaveRes.body._id);
                        (ofertaInfoRes.body.name).should.equal(oferta.name);
                        should.equal(ofertaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Oferta.remove().exec(done);
    });
  });
});
