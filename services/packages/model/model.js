const _ = require('lodash')
const { createRequest } = require('./rabbitServices')

module.exports = Model

function Model (collection, Schema, db, dbOptions = {}) {
  function model (data, fromDB = false) {
    // should not create an object from null
    if (!data) return data
    const dataModel = new Schema({ ...data })

    function checkModified (data, attr) {
      // consider newly created data as dirty
      if (!fromDB) return true
      return this[attr] !== data[attr]
    }
    const _isModified = checkModified.bind(dataModel, data)

    Object.setPrototypeOf(dataModel, {
      save,
      ...Schema.methods,
      _Schema: Schema,
      _isModified,
      _collectionAttributes: {
        collection,
        db
      }
    })
    return dataModel
  }
  // db attributes
  this.model = model
  this.dbOptions = dbOptions
  this._Schema = Schema
  this.db = db
  this.collection = collection

  this.save = save.bind(this)
  this.count = count.bind(this)
  this.upsert = upsert.bind(this)
  this.update = update.bind(this)
  this.remove = remove.bind(this)
  this.get = get.bind(this)
  this.getOne = getOne.bind(this)
  this.setOptions = setOptions.bind(this)
  this.describe = describe.bind(this)
  Object.setPrototypeOf(model, this)
  this.options = Schema.getOptions()

  this.setOptions({ options: this.options, dbOptions: this.dbOptions }).catch(
    (err) => {
      console.log('Error Creating collection ', this.collection)
      console.log(err)
    }
  )
  this.getAccessRights = Schema.getAccessRights()
  return model
}

function upsert (query, data, options = {}) {
  const { db, collection } = this

  // query should be part of the created object
  data = this.model({ ...query, ...data })
  data._Schema.validate(data)
  const dataToBeSaved = _.pick(data, Object.getOwnPropertyNames(data))

  createRequest({
    data: dataToBeSaved,
    query,
    action: 'save',
    db,
    collection,
    options
  })
}

function save (data, options = {}) {
  if (data) {
    return this.model(data).save(null, options)
  }
  this._Schema.validate(this)

  try {
    this._Schema.validations.forEach((validationFunc) => {
      validationFunc(this)
    })
  } catch (err) {
    return Promise.reject(err)
  }
  return new Promise((resolve, reject) => {
    runHooks(this._Schema.preHooks['save'], this, (err) => {
      if (err) reject(err)
      resolve()
    })
  }).then(() => {
    const { db, collection } = this._collectionAttributes
    const { _id } = this
    const query = _id
      ? {
        _id
      }
      : null

    const dataToBeSaved = _.pick(this, Object.getOwnPropertyNames(this))
    return createRequest({
      data: dataToBeSaved,
      query,
      action: 'save',
      db,
      collection,
      options
    })
  })
}

function remove (query, options = {}) {
  const { db, collection } = this
  return createRequest({
    query,
    action: 'remove',
    db,
    collection,
    options
  })
}

function update (query, update, options) {
  const { db, collection } = this
  return createRequest({
    query,
    update,
    action: 'update',
    db,
    collection,
    options: { ...options }
  })
}

function count (query, options) {
  const { db, collection, _Schema } = this
  return createRequest({
    query,
    action: 'count',
    db,
    collection,
    options: { ...options, isCount: true }
  })
}
function getOne (query, options) {
  const { db, collection, _Schema } = this
  return createRequest({
    query,
    action: 'getOne',
    db,
    collection,
    options: { ...options, isGetOne: true }
  })
    .then((data) => this.model(data, true))
    .then((data) => applyDerivedProperties(data, _Schema.derivedProperties))
}

function get (query, options) {
  const { db, collection, _Schema } = this
  return createRequest({
    query,
    action: 'get',
    db,
    collection,
    options
  }).then((results) =>
    results
      .map((data) => this.model(data, true))
      .map((data) => applyDerivedProperties(data, _Schema.derivedProperties))
  )
}

function setOptions ({ options, dbOptions }) {
  const { db, collection } = this
  return createRequest({
    action: 'option',
    db,
    collection,
    options,
    dbOptions
  }).then((results) => results)
}

function describe (options = {}) {
  const { db, collection } = this
  return createRequest({
    action: 'describe',
    db,
    collection,
    options
  })
}

function applyDerivedProperties (doc, derivedProps) {
  return Object.keys(derivedProps).reduce(
    (acc, v) => ({ ...acc, [v]: derivedProps[v](acc) }),
    doc
  )
}

function runHooks (hooks, data, cb) {
  let i = hooks.length
  while (i--) {
    cb = hooks[i].bind(data, cb)
  }
  cb()
}
