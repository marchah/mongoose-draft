'use strict';

const MONGO_URI = 'mongodb://localhost/mongoose-plugin-test';
process.env.MONGO_URI = MONGO_URI;

const _ = require('lodash');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const Promise = require('bluebird');

const ValidationError = mongoose.Error.ValidationError;
const ValidatorError = mongoose.Error.ValidatorError;

const models = require('./models');

const Nested = models.Nested;
const TestDraftDefault = models.TestDraftDefault;
const TestDraftOptionTrue = models.TestDraftOptionTrue;
const TestDraftOptionFalse = models.TestDraftOptionFalse;
const TestDraftFieldName = models.TestDraftFieldName;
const TestDraftCustomValidator = models.TestDraftCustomValidator;
const TestDraft = models.TestDraft;


describe('Unit Testing ->', () => {
  before((done) => {
    mongoose.connect(MONGO_URI);

    mongoose.connection.on('connected', () => {
      done();
    });
    mongoose.connection.on('error', done);
  });
  describe('Draft ->', () => {
    after((done) => {
      Promise.all([
        TestDraftDefault.remove({}),
        TestDraftOptionTrue.remove({}),
        TestDraftOptionFalse.remove({}),
        TestDraftFieldName.remove({}),
        TestDraftCustomValidator.remove({}),
        TestDraft.remove({}),
      ]).then(() => {
        done();
      }).catch(done);
    });
    describe('Options ->', () => {
      it('should create model is draft (default)', () => {
        const model = new TestDraftDefault();

        expect(model).that.is.an('object').to.have.property('_is_draft', true);
      });
      it('should create model is draft (option.isDraft === `true`)', () => {
        const model = new TestDraftOptionTrue();

        expect(model).that.is.an('object').to.have.property('_is_draft', true);
      });
      it('should create model is not draft (option.isDraft === `false`)', () => {
        const model = new TestDraftOptionFalse();

        expect(model).that.is.an('object').to.have.property('_is_draft', false);
      });
      it('should use `_test` as draft field name', () => {
        const model = new TestDraftFieldName();

        expect(model).that.is.an('object').to.not.have.property('_is_draft');
        expect(model).to.have.property('_test', true);
      });
    });
    describe('Virtual Fields ->', () => {
      describe('isDraft ->', () => {
        it('should create model is draft (default)', () => {
          const model = new TestDraftDefault();

          expect(model.isDraft).to.be.true;
        });
        it('should create model is draft (option.isDraft === `true`)', () => {
          const model = new TestDraftOptionTrue();

          expect(model.isDraft).to.be.true;
        });
        it('should create model is not draft (option.isDraft === `false`)', () => {
          const model = new TestDraftOptionFalse();

          expect(model.isDraft).to.be.false;
        });
        it('should set is draft value (default)', () => {
          const model = new TestDraftDefault();

          expect(model.isDraft).to.be.true;
          model.isDraft = false;
          expect(model.isDraft).to.be.false;
        });
        it('should set is draft value (option.isDraft === `true`)', () => {
          const model = new TestDraftOptionTrue();

          expect(model.isDraft).to.be.true;
          model.isDraft = false;
          expect(model.isDraft).to.be.false;
        });
        it('should set is draft value (option.isDraft === `false`)', () => {
          const model = new TestDraftOptionFalse();

          expect(model.isDraft).to.be.false;
          model.isDraft = true;
          expect(model.isDraft).to.be.true;
        });
      });
    });
    describe('Functions ->', () => {
      describe('setIsDraft ->', () => {
        it('should set is draft (default)', () => {
          const model = new TestDraftDefault();

          expect(model.setIsDraft).to.be.a('function');
          expect(model.isDraft).to.be.true;
          model.setIsDraft(false);
          expect(model.isDraft).to.be.false;
          model.setIsDraft(true);
          expect(model.isDraft).to.be.true;
          model.setIsDraft(true);
          expect(model.isDraft).to.be.true;
        });
        it('should set is draft (option.isDraft === `true`)', () => {
          const model = new TestDraftOptionTrue();

          expect(model.setIsDraft).to.be.a('function');
          expect(model.isDraft).to.be.true;
          model.setIsDraft(false);
          expect(model.isDraft).to.be.false;
          model.setIsDraft(true);
          expect(model.isDraft).to.be.true;
          model.setIsDraft(true);
          expect(model.isDraft).to.be.true;
        });
        it('should set is draft (option.isDraft === `false`)', () => {
          const model = new TestDraftOptionFalse();

          expect(model.setIsDraft).to.be.a('function');
          expect(model.isDraft).to.be.false;
          model.setIsDraft(true);
          expect(model.isDraft).to.be.true;
          model.setIsDraft(false);
          expect(model.isDraft).to.be.false;
          model.setIsDraft(false);
          expect(model.isDraft).to.be.false;
        });
      });
    });
    describe('Events ->', () => {
      describe('ValidateSync ->', () => {
        it('should not return validation error (default)');
        it('should not return validation error (option.isDraft === `true`)');
        it('should return validation error (option.isDraft === `false`)');
      });
      describe('Validate ->', () => {
        it('should not return validation error using `setIsDraft`(default)', (done) => {
          const model = new TestDraftDefault();

          model.validate()
            .then(() => {
              model.setIsDraft(false);
              model.validate()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model.setIsDraft(true);
                  model.validate()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch((err) => {
              console.log(err);
              done(err);
            });
        });
        it('should not return validation error using `isDraft`(default)', (done) => {
          const model = new TestDraftDefault();

          model.validate()
            .then(() => {
              model.isDraft = false;
              model.validate()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model.isDraft = true;
                  model.validate()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should not return validation error using `_is_draft`(default)', (done) => {
          const model = new TestDraftDefault();

          model.validate()
            .then(() => {
              model._is_draft = false;
              model.validate()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model._is_draft = true;
                  model.validate()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should not return validation error using `setIsDraft`(option.isDraft === `true`)', (done) => {
          const model = new TestDraftOptionTrue();

          model.validate()
            .then(() => {
              model.setIsDraft(false);
              model.validate()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default_option_true validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model.setIsDraft(true);
                  model.validate()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should not return validation error using `isDraft`(option.isDraft === `true`)', (done) => {
          const model = new TestDraftOptionTrue();

          model.validate()
            .then(() => {
              model.isDraft = false;
              model.validate()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default_option_true validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model.isDraft = true;
                  model.validate()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should not return validation error using `_is_draft`(option.isDraft === `true`)', (done) => {
          const model = new TestDraftOptionTrue();

          model.validate()
            .then(() => {
              model._is_draft = false;
              model.validate()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default_option_true validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model._is_draft = true;
                  model.validate()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should not return validation error using `setIsDraft`(option.isDraft === `false`)', (done) => {
          const model = new TestDraftOptionFalse();

          model.validate()
            .then(() => {
              done('Not suppose to happend');
            }).catch((validationError) => {
              expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                .and.have.property('message', 'Test_draft_default_option_false validation failed');
              expect(validationError.errors).to.exist.and.be.an('object');
              const errors = validationError.errors;
              expect((_.keys(errors)).length).to.eql(1);

              expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
              expect(errors.label_1).to.have.property('path', 'label_1');
              expect(errors.label_1).to.have.property('value', undefined);
              model.setIsDraft(true);
              model.validate()
                .then(() => {
                  model.setIsDraft(false);
                  model.validate()
                    .then(() => {
                      done('Not suppose to happend');
                    }).catch((validationError) => {
                      expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                        .and.have.property('message', 'Test_draft_default_option_false validation failed');
                      expect(validationError.errors).to.exist.and.be.an('object');
                      const errors = validationError.errors;
                      expect((_.keys(errors)).length).to.eql(1);

                      expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                      expect(errors.label_1).to.have.property('path', 'label_1');
                      expect(errors.label_1).to.have.property('value', undefined);
                      done();
                    });
                }).catch(done);
            });
        });
        it('should not return validation error using `isDraft`(option.isDraft === `false`)', (done) => {
          const model = new TestDraftOptionFalse();

          model.validate()
            .then(() => {
              done('Not suppose to happend');
            }).catch((validationError) => {
              expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                .and.have.property('message', 'Test_draft_default_option_false validation failed');
              expect(validationError.errors).to.exist.and.be.an('object');
              const errors = validationError.errors;
              expect((_.keys(errors)).length).to.eql(1);

              expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
              expect(errors.label_1).to.have.property('path', 'label_1');
              expect(errors.label_1).to.have.property('value', undefined);
              model.isDraft = true;
              model.validate()
                .then(() => {
                  model.isDraft = false;
                  model.validate()
                    .then(() => {
                      done('Not suppose to happend');
                    }).catch((validationError) => {
                      expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                        .and.have.property('message', 'Test_draft_default_option_false validation failed');
                      expect(validationError.errors).to.exist.and.be.an('object');
                      const errors = validationError.errors;
                      expect((_.keys(errors)).length).to.eql(1);

                      expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                      expect(errors.label_1).to.have.property('path', 'label_1');
                      expect(errors.label_1).to.have.property('value', undefined);
                      done();
                    });
                }).catch(done);
            });
        });
        it('should not return validation error using `_is_draft`(option.isDraft === `false`)', (done) => {
          const model = new TestDraftOptionFalse();

          model.validate()
            .then(() => {
              done('Not suppose to happend');
            }).catch((validationError) => {
              expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                .and.have.property('message', 'Test_draft_default_option_false validation failed');
              expect(validationError.errors).to.exist.and.be.an('object');
              const errors = validationError.errors;
              expect((_.keys(errors)).length).to.eql(1);

              expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
              expect(errors.label_1).to.have.property('path', 'label_1');
              expect(errors.label_1).to.have.property('value', undefined);
              model._is_draft = true;
              model.validate()
                .then(() => {
                  model._is_draft = false;
                  model.validate()
                    .then(() => {
                      done('Not suppose to happend');
                    }).catch((validationError) => {
                      expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                        .and.have.property('message', 'Test_draft_default_option_false validation failed');
                      expect(validationError.errors).to.exist.and.be.an('object');
                      const errors = validationError.errors;
                      expect((_.keys(errors)).length).to.eql(1);

                      expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                      expect(errors.label_1).to.have.property('path', 'label_1');
                      expect(errors.label_1).to.have.property('value', undefined);
                      done();
                    });
                }).catch(done);
            });
        });
        it('should not return validation error with customs validation', (done) => {
          const model = new TestDraftCustomValidator();

          model.label_2 = 'label';
          model.validate()
            .then(() => {
              model.setIsDraft(false);
              model.validate()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_custom_validator validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(2);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);

                  expect(errors.label_2).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_2).to.have.property('path', 'label_2');
                  expect(errors.label_2).to.have.property('message', 'custom validator label_2');
                  expect(errors.label_2).to.have.property('value', undefined);
                  model.setIsDraft(true);
                  model.validate()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
      });
      describe('Save ->', () => {
        it('should save model using `setIsDraft`(default)', (done) => {
          const model = new TestDraftDefault();

          model.save()
            .then(() => {
              model.setIsDraft(false);
              model.save()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model.setIsDraft(true);
                  model.save()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should save model using `isDraft`(default)', (done) => {
          const model = new TestDraftDefault();

          model.save()
            .then(() => {
              model.isDraft = false;
              model.save()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model.isDraft = true;
                  model.save()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should save model using `_is_draft`(default)', (done) => {
          const model = new TestDraftDefault();

          model.save()
            .then(() => {
              model._is_draft = false;
              model.save()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model._is_draft = true;
                  model.save()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should save model using `setIsDraft`(option.isDraft === `true`)', (done) => {
          const model = new TestDraftOptionTrue();

          model.save()
            .then(() => {
              model.setIsDraft(false);
              model.save()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default_option_true validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model.setIsDraft(true);
                  model.save()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should save model using `isDraft`(option.isDraft === `true`)', (done) => {
          const model = new TestDraftOptionTrue();

          model.save()
            .then(() => {
              model.isDraft = false;
              model.save()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default_option_true validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model.isDraft = true;
                  model.save()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should save model using `_is_draft`(option.isDraft === `true`)', (done) => {
          const model = new TestDraftOptionTrue();

          model.save()
            .then(() => {
              model._is_draft = false;
              model.save()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_default_option_true validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(1);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);
                  model._is_draft = true;
                  model.save()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
        it('should save model using `setIsDraft`(option.isDraft === `false`)', (done) => {
          const model = new TestDraftOptionFalse();

          model.save()
            .then(() => {
              done('Not suppose to happend');
            }).catch((validationError) => {
              expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                .and.have.property('message', 'Test_draft_default_option_false validation failed');
              expect(validationError.errors).to.exist.and.be.an('object');
              const errors = validationError.errors;
              expect((_.keys(errors)).length).to.eql(1);

              expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
              expect(errors.label_1).to.have.property('path', 'label_1');
              expect(errors.label_1).to.have.property('value', undefined);
              model.setIsDraft(true);
              model.save()
                .then(() => {
                  model.setIsDraft(false);
                  model.save()
                    .then(() => {
                      done('Not suppose to happend');
                    }).catch((validationError) => {
                      expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                        .and.have.property('message', 'Test_draft_default_option_false validation failed');
                      expect(validationError.errors).to.exist.and.be.an('object');
                      const errors = validationError.errors;
                      expect((_.keys(errors)).length).to.eql(1);

                      expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                      expect(errors.label_1).to.have.property('path', 'label_1');
                      expect(errors.label_1).to.have.property('value', undefined);
                      done();
                    });
                }).catch(done);
            });
        });
        it('should save model using `isDraft`(option.isDraft === `false`)', (done) => {
          const model = new TestDraftOptionFalse();

          model.save()
            .then(() => {
              done('Not suppose to happend');
            }).catch((validationError) => {
              expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                .and.have.property('message', 'Test_draft_default_option_false validation failed');
              expect(validationError.errors).to.exist.and.be.an('object');
              const errors = validationError.errors;
              expect((_.keys(errors)).length).to.eql(1);

              expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
              expect(errors.label_1).to.have.property('path', 'label_1');
              expect(errors.label_1).to.have.property('value', undefined);
              model.isDraft = true;
              model.save()
                .then(() => {
                  model.isDraft = false;
                  model.save()
                    .then(() => {
                      done('Not suppose to happend');
                    }).catch((validationError) => {
                      expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                        .and.have.property('message', 'Test_draft_default_option_false validation failed');
                      expect(validationError.errors).to.exist.and.be.an('object');
                      const errors = validationError.errors;
                      expect((_.keys(errors)).length).to.eql(1);

                      expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                      expect(errors.label_1).to.have.property('path', 'label_1');
                      expect(errors.label_1).to.have.property('value', undefined);
                      done();
                    });
                }).catch(done);
            });
        });
        it('should save model using `_is_draft`(option.isDraft === `false`)', (done) => {
          const model = new TestDraftOptionFalse();

          model.save()
            .then(() => {
              done('Not suppose to happend');
            }).catch((validationError) => {
              expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                .and.have.property('message', 'Test_draft_default_option_false validation failed');
              expect(validationError.errors).to.exist.and.be.an('object');
              const errors = validationError.errors;
              expect((_.keys(errors)).length).to.eql(1);

              expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
              expect(errors.label_1).to.have.property('path', 'label_1');
              expect(errors.label_1).to.have.property('value', undefined);
              model._is_draft = true;
              model.save()
                .then(() => {
                  model._is_draft = false;
                  model.save()
                    .then(() => {
                      done('Not suppose to happend');
                    }).catch((validationError) => {
                      expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                        .and.have.property('message', 'Test_draft_default_option_false validation failed');
                      expect(validationError.errors).to.exist.and.be.an('object');
                      const errors = validationError.errors;
                      expect((_.keys(errors)).length).to.eql(1);

                      expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                      expect(errors.label_1).to.have.property('path', 'label_1');
                      expect(errors.label_1).to.have.property('value', undefined);
                      done();
                    });
                }).catch(done);
            });
        });
        it('should save model with customs validation', (done) => {
          const model = new TestDraftCustomValidator();

          model.label_2 = 'label';
          model.save()
            .then(() => {
              model.isDraft = false;
              model.save()
                .then(() => {
                  done('Not suppose to happend');
                }).catch((validationError) => {
                  expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
                    .and.have.property('message', 'Test_draft_custom_validator validation failed');
                  expect(validationError.errors).to.exist.and.be.an('object');
                  const errors = validationError.errors;
                  expect((_.keys(errors)).length).to.eql(2);

                  expect(errors.label_1).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_1).to.have.property('path', 'label_1');
                  expect(errors.label_1).to.have.property('value', undefined);

                  expect(errors.label_2).to.exist.and.be.an.instanceof(ValidatorError);
                  expect(errors.label_2).to.have.property('path', 'label_2');
                  expect(errors.label_2).to.have.property('message', 'custom validator label_2');
                  expect(errors.label_2).to.have.property('value', undefined);
                  model.isDraft = true;
                  model.save()
                    .then(() => {
                      done();
                    }).catch(done);
                });
            }).catch(done);
        });
      });
    });
    describe('Complex Tests', () => {
      let model;
      it('should save model', (done) => {
        model = new TestDraft();

        expect(model.isDraft).to.be.true;
        model.save()
          .then(() => {
            done();
          }).catch(done);
      });
      it('should update model into isDraft === `false` 1/3', () => {
        expect(model.isDraft).to.be.true;
        model.setIsDraft(false);
        expect(model.isDraft).to.be.false;
      });
      it('should return validation error when update model and isDraft === `false` 1/3', (done) => {
        expect(model.isDraft).to.be.false;
        model.save()
          .then(() => {
            done('Not suppose to happend');
          }).catch((validationError) => {
            expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
              .and.have.property('message', 'Test_draft validation failed');
            expect(validationError.errors).to.exist.and.be.an('object');
            const errors = validationError.errors;
            expect((_.keys(errors)).length).to.eql(5);

            expect(errors.label).to.exist.and.be.an.instanceof(ValidatorError);
            expect(errors.label).to.have.property('path', 'label');
            expect(errors.label).to.have.property('value', undefined);

            expect(errors.nested).to.exist.and.be.an.instanceof(ValidatorError);
            expect(errors.nested).to.have.property('path').that.eql('nested');
            expect(errors.nested).to.have.property('value', undefined);

            expect(errors['sub.sub_label']).to.exist.and.be.an.instanceof(ValidatorError);
            expect(errors['sub.sub_label']).to.have.property('path').that.eql('sub.sub_label');
            expect(errors['sub.sub_label']).to.have.property('value', undefined);

            expect(errors['sub.sub_nested']).to.exist.and.be.an.instanceof(ValidatorError);
            expect(errors['sub.sub_nested']).to.have.property('path').that.eql('sub.sub_nested');
            expect(errors['sub.sub_nested']).to.have.property('value', undefined);

            expect(errors.sub_array).to.exist.and.be.an.instanceof(ValidatorError);
            expect(errors.sub_array).to.have.property('path').that.eql('sub_array');
            expect(errors.sub_array).to.have.property('value').to.eql([]);

            done();
          });
      });
      it('should update model into isDraft === `true` 1/2', () => {
        expect(model.isDraft).to.be.false;
        model.isDraft = true;
        expect(model.isDraft).to.be.true;
      });
      it('should save updated model 1/2', (done) => {
        model.label = 'label';
        model.nested = new Nested();
        model.sub.sub_label = 'sub_label';
        model.sub.sub_nested = new Nested();
        model.sub_array = [{ }];

        expect(model.isDraft).to.be.true;
        model.save()
          .then(() => {
            done();
          }).catch(done);
      });
      it('should update model into isDraft === `false` 2/3', () => {
        expect(model.isDraft).to.be.true;
        model.isDraft = false;
        expect(model.isDraft).to.be.false;
      });
      it('should return validation error when update model and isDraft === `false` 2/3', (done) => {
        expect(model.isDraft).to.be.false;
        model.save()
          .then(() => {
            done('Not suppose to happend');
          }).catch((validationError) => {
            expect(validationError).to.exist.and.be.an.instanceof(ValidationError)
              .and.have.property('message', 'Test_draft validation failed');
            expect(validationError.errors).to.exist.and.be.an('object');
            const errors = validationError.errors;
            expect((_.keys(errors)).length).to.eql(1);

            expect(errors['sub_array.0.sub_sub_array']).to.exist.and.be.an.instanceof(ValidatorError);
            expect(errors['sub_array.0.sub_sub_array']).to.have.property('path').that.eql('sub_sub_array');
            expect(errors['sub_array.0.sub_sub_array']).to.have.property('value').to.eql([]);

            done();
          });
      });
      it('should update model into isDraft === `true` 2/2', () => {
        expect(model.isDraft).to.be.false;
        model.setIsDraft(true);
        expect(model.isDraft).to.be.true;
      });
      it('should save updated model 2/2', (done) => {
        model.sub_array[0].sub_sub_array = [new Nested()];

        expect(model.isDraft).to.be.true;
        model.save()
          .then(() => {
            done();
          }).catch(done);
      });
      it('should update model into isDraft === `false` 3/3', () => {
        expect(model.isDraft).to.be.true;
        model.setIsDraft(false);
        expect(model.isDraft).to.be.false;
      });
      it('should update model and isDraft === `false` 3/3', (done) => {
        expect(model.isDraft).to.be.false;
        model.save()
          .then(() => {
            done();
          }).catch(done);
      });
    });
  });
  after((done) => {
    mongoose.connection.close(done);
  });
});
