# mongoose-draft
Mongoose draft plugin to skip the model validation

## Documentation

### Options

* `isDraft` set the initial value (optional, default `true`)
* `fieldName` set fieldName value, use it only is you're already using the default value somewhere else (optional, default `_is_draft`)

### Methods

#### instance.setIsDraft(isDraft)

Set the value of `isDraft`

### Virtual fields

#### instance.isDraft

Get/Set the value of `isDraft`

## Examples

````javascript
var mongoose = require('mongoose');
var draft = require('mongoose-draft');

var TestSchema = new mongoose.Schema({
  'label_1': {
    'type': String,
    'required': true,
  },
  'label_2': {
    'type': String,
    'required': false,
  },
});

TestSchema.plugin(draft, { isDraft: true });

var TestDraft = mongoose.model('Test_draft', TestSchema);

var model = new TestDraft()

model.validate(); // -> return a promise fulfilled without any validation errors
model.isDraft = false;
model.validate(); // -> return a promise fulfilled with validation errors

model.setIsDraft(true);

model.save(); // -> return a promise fulfilled with the model instance
model.setIsDraft(false);
model.save(); // -> return a promise fulfilled with validation errors
````

## Contributing

This project is a work in progress and subject to API changes, please feel free to contribute
