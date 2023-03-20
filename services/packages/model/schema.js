const _ = require('lodash')

module.exports = Schema
function mongoObjectId (_id) {
  if (_id) return _id
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16)
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16)
      })
      .toLowerCase()
  )
}

function objectIsDescription (obj) {
  // identifies if the object is a description of the attribute
  // or it's a sub document
  return _.isEmpty(obj) || typeof obj.type === 'function'
}
function objectIsAccessControl (obj) {
  // identifies if the object is a description of the attribute
  // or it's a sub document
  return obj && typeof obj.type === 'function' && obj.accessRight
}
function objectIsMapping (obj) {
  // identifies if the object is a description of the attribute
  // or it's a sub document
  return obj && typeof obj.type === 'function' && obj.mapping
}

function getPathsToProps (tree) {
  /** * Will list properties of an object ***/
  const leaves = []
  const walk = function (obj, path) {
    path = path || ''
    for (const n in obj) {
      if (obj.hasOwnProperty(n)) {
        if (obj[n] instanceof Array) {
          leaves.push(path + '.' + n)
        } else if (typeof obj[n] === 'object') {
          if (objectIsDescription(obj[n])) {
            leaves.push(path + '.' + n)
          } else {
            walk(obj[n], path + '.' + n)
          }
        } else {
          leaves.push(path + '.' + n)
        }
      }
    }
  }
  walk(tree, '')
  return leaves.map((leave) => leave.replace(/^\./, ''))
}

function Schema (schema) {
  schema = _.isEmpty(schema) ? {} : { _id: mongoObjectId, ...schema }
  this.schema = schema
  this.paths = getPathsToProps(this.schema)
  this.pre = addHook.bind(this, 'preHooks')
  this.post = addHook.bind(this, 'postHooks')
  this.preHooks = { save: [] }
  this.postHooks = { save: [] }
  this.validate = (obj) => loopObject(obj, this.schema, validateAndCast)
  this.methods = {}
  this.validations = []
  this.derivedProperties = {}
  this.getAccessRights = () =>
    this.paths.map((path) =>
      getFieldsAccessRight(_.get(this.schema, path, {}), path)
    )

  this.getOptions = (obj) => ({
    indexes: this.paths
      .map((path) => getIndexFields(_.get(this.schema, path, {}), path))
      .filter(Boolean),
    mappings: this.paths
      .map((path) => getFieldsMapping(_.get(this.schema, path, {}), path))
      .filter(Boolean)
  })

  function _schema (obj) {
    // if schema is empty forgo casting
    if (Object.keys(schema).length === 0) return obj
    obj = loopObject(obj, schema, castProp)
    return obj
  }

  Object.setPrototypeOf(_schema, this)
  return _schema
}

function getFieldsAccessRight (prop, path) {
  if (!objectIsAccessControl(prop)) {
    // _id is a special field that can only be read
    if (path === '_id') return { path, access: () => 1 }

    // access all by default
    return { path, access: () => 2 }
  }
  return {
    path,
    access: prop.accessRight
  }
}

function getFieldsMapping (prop, path) {
  if (!objectIsMapping(prop)) return
  return {
    path,
    type: prop.mapping
  }
}
function getIndexFields (prop, path) {
  if (!objectIsDescription(prop)) return
  if (!_.isEmpty(prop.index)) {
    return {
      path,
      index: prop.index
    }
  }
}

function validateAndCast (prop, objProp, path) {
  if (typeof prop === 'object') {
    if (prop.required && (_.isNil(objProp) || _.isEmpty(objProp))) {
      const msgError = _.isString(prop.required)
        ? prop.required
        : `Validation Error : ${path} is required`
      throw new Error(msgError)
    }
  }
  return castProp(prop, objProp)
}

function loopObject (obj, schema, action) {
  const paths = getPathsToProps(schema)
  // empty validation object means no validation to perform
  let newObj = _.cloneDeep(obj)
  newObj = _.pick(newObj, paths)
  if (!_.isEmpty(paths)) {
    for (const path of paths) {
      const prop = _.get(schema, path)
      if (prop instanceof Array) {
        // Array in schema means to apply the schema for each item
        const oldValues = _.get(newObj, path, [])
        if (oldValues instanceof Array) {
          _.set(newObj, path, oldValues.map((val) => action(prop[0], val, path)))
        } else {
          console.log("SHOULd've been an ARRAY ")
          console.log(JSON.stringify(oldValues))
        }
      } else {
        const oldValue = _.get(newObj, path)
        const newValue = action(prop, oldValue, path)
        if (!_.isNil(newValue)) {
          _.set(newObj, path, newValue)
        }
      }
    }
  }
  return newObj
}

function addHook (hookType, event, hook) {
  // adds hooks to lifecycle
  if (Object.keys(this[hookType]).indexOf(event) === -1) {
    throw new Error(
      `Unsupported event (${event}) \nsupported events are ${Object.keys(
        this[hookType]
      )}`
    )
  }
  if (typeof hook !== 'function') throw new Error('Hooks should be functions')
  this[hookType][event].push(hook)
}

function castProp (prop, objProp) {
  // will apply transformaion to props according to their type
  if (typeof prop === 'function') {
    // if the schema property is function
    // then we use that function to cast the value
    return _.isNil(objProp) ? prop() : prop(objProp)
  } else if (typeof prop === 'object') {
    // empty object means schema to enforce
    if (_.isEmpty(prop)) return objProp

    // set default value if defined
    if (!_.isNil(prop.default)) {
      objProp = _.isNil(objProp) ? prop.default : objProp
    }
    // if type is defined cast the property
    if (typeof prop.type === 'function') {
      objProp = _.isNil(objProp) ? prop.type() : prop.type(objProp)
    }

    return objProp
  }
}
