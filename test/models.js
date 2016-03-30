'use strict';

const mongoose = require('mongoose');

const draft = require('../lib/draft');

const NestedSchema = new mongoose.Schema({
  'label_1': {
    'type': String,
    'required': true,
  },
  'label_2': {
    'type': String,
    'required': false,
  },
});

const TestSchemaDefault = new mongoose.Schema({
  'label_1': {
    'type': String,
    'required': true,
  },
  'label_2': {
    'type': String,
    'required': false,
  },
});

TestSchemaDefault.plugin(draft);

const TestSchemaOptionTrue = new mongoose.Schema({
  'label_1': {
    'type': String,
    'required': true,
  },
  'label_2': {
    'type': String,
    'required': false,
  },
});

TestSchemaOptionTrue.plugin(draft, {isDraft: true});

const TestSchemaOptionFalse = new mongoose.Schema({
  'label_1': {
    'type': String,
    'required': true,
  },
  'label_2': {
    'type': String,
    'required': false,
  },
});

TestSchemaOptionFalse.plugin(draft, {isDraft: false});

const TestSchemaFieldName = new mongoose.Schema({
  'label_1': {
    'type': String,
    'required': true,
  },
  'label_2': {
    'type': String,
    'required': false,
  },
});

TestSchemaFieldName.plugin(draft, {fieldName: '_test'});

const TestSchemaCustomValidator = new mongoose.Schema({
  'label_1': {
    'type': String,
    'required': true,
  },
  'label_2': {
    'type': String,
    'required': false,
  },
});

TestSchemaCustomValidator.path('label_2').validate(function _validate() {
  this.invalidate('label_2', 'custom validator label_2');
});

TestSchemaCustomValidator.plugin(draft);

const TestSchema = new mongoose.Schema({
  'label': {
    'type': String,
    'required': true,
  },
  'nested': {
    'type': mongoose.Schema.ObjectId,
    'ref': 'Nested',
    'required': true,
  },
  'sub': {
    'sub_label': {
      'type': String,
      'required': true,
    },
    'sub_nested': {
      'type': mongoose.Schema.ObjectId,
      'ref': 'Nested',
      'required': true,
    },
  },
  'sub_array': {
    'type': [{
      'sub_sub_array': {
        'type': [{
          'type': mongoose.Schema.ObjectId,
          'ref': 'Nested',
          'required': true,
        }],
        'required': true,
      },
    }],
    'required': true,
  },
  'ignored': {
    'type': mongoose.Schema.ObjectId,
    'ref': 'Nested',
    'required': false,
  },
});


TestSchema.plugin(draft);

module.exports = {
  'Nested': mongoose.model('Nested', NestedSchema),
  'TestDraftDefault': mongoose.model('Test_draft_default', TestSchemaDefault),
  'TestDraftOptionTrue': mongoose.model('Test_draft_default_option_true', TestSchemaOptionTrue),
  'TestDraftOptionFalse': mongoose.model('Test_draft_default_option_false', TestSchemaOptionFalse),
  'TestDraftFieldName': mongoose.model('Test_draft_fieldname', TestSchemaFieldName),
  'TestDraftCustomValidator': mongoose.model('Test_draft_custom_validator', TestSchemaCustomValidator),
  'TestDraft': mongoose.model('Test_draft', TestSchema),
};
