const ValidationError = require('mongoose/lib/error/validation');
const { Component, Property } = require('../entities/Component');


class ComponentNotFoundError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'ComponentNotFoundError';
    this.errors['_'] = { message: 'domain.component.validation.component_not_found' };
  }
}

class ForbiddenComponentError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenComponentError';
    this.errors['_'] = { message: 'domain.component.validation.forbidden_component' };
  }
}

class PropertyNotFoundError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'PropertyNotFoundError';
    this.errors['_'] = { message: 'domain.property.validation.property_not_found' };
  }
}

const ComponentService = {

  createComponent: async (componentType, category, name, description, license, key, functionName, url,
    httpMethod, timeout, pricingModel, pricePerUse, pricePerMonth, status, username) => {
      let component = new Component({
        componentType,
        category,
        name,
        description,
        license,
        key,
        functionName,
        url,
        httpMethod,
        timeout,
        pricingModel,
        pricePerUse,
        pricePerMonth,
        status,
        username
      });
    component.properties = [];
    return await component.save();
  },

  updateComponent: async (username, component) => {
    await ComponentService.findMyComponentById(username, component._id);
    return await component.save();
  },

  findComponentById: async (id) => {
    let component = await Component.findById(id).exec();
    if (!component) {
      throw new ComponentNotFoundError();
    }
    return component;
  },

  findMyComponentById: async (username, id) => {
    let component = await Component.findById(id).exec();
    if (!component) {
      throw new ComponentNotFoundError();
    }
    if (component.username === username) {
      return component;
    } else {
      throw new ForbiddenComponentError('');
    }
  },

  findComponentsWithIdInArray: async (ids) => {
    return await Component.find().where('_id').in(ids).exec();
  },

  findPaginatedComponents: async (resultsPerPage, currentPage, username, search, componentType, status, sortBy, sortType) => {
    let query = {}
    let sorting = {}
    if (username !== '' ) {
      query['username'] = username;
    }
    if (search !== '') {
      query['$and'] = [{ $or: [{name: { $regex:  `.*${search}.*`, $options: 'i' }}, {description: { $regex:  `.*${search}.*`, $options: 'i' }}] }];
    }
    if (Array.isArray(componentType)) {
      query['componentType'] = componentType;
    } else {
      if (componentType !== '' ) {
        query['componentType'] = componentType;
      }
    }

    if (status !== '' ) {
      query['status'] = status;
    }
    if (sortBy !== '' ) {
      sorting[sortBy] = sortType;
    }
    const results = await Component.find(query)
      .sort(sorting)
      .skip((resultsPerPage * currentPage) - resultsPerPage)
      .limit(resultsPerPage);
    const resultsCount = await Component.countDocuments(query);
    const pagesCount = Math.ceil(resultsCount / resultsPerPage);
    return {
      results,
      resultsCount,
      currentPage,
      pagesCount,
    }
  },

  deleteComponentById: async (username, id) => {
    let component = await ComponentService.findMyComponentById(username, id);
    return await Component.deleteOne({_id: id});
  },


  normalizePropertyErrors(err) {
    if (err.errors) {
      let keys = Object.keys(err.errors);
      let values = Object.values(err.errors);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].startsWith('properties.')) {
          let parts = keys[i].split('.');
          err.errors[keys[i]] = parts[2];
          Object.defineProperty(err.errors, parts[2],
            Object.getOwnPropertyDescriptor(err.errors, keys[i]));
            err.errors[parts[2]] = values[i];
            delete err.errors[keys[i]];
        }
      }
    }
    return err;
  },

  addComponentProperty: async (username, id, property, propertyGroup) => {
    let component = await ComponentService.findMyComponentById(username, id);
    switch (propertyGroup) {
      case 'properties':
        component.properties.push(property);
        break;
      case 'headers':
        component.headers.push(property);
        break;
      case 'predefinedVars':
        component.predefinedVars.push(property);
        break;
      case 'mappedVars':
        component.mappedVars.push(property);
        break;
    }
    try {
      return await component.save();
    } catch (err) {
      if (err instanceof ValidationError) {
        throw ComponentService.normalizePropertyErrors(err);
      }
    }
  },

  findProperty: async (component, propertyId, propertyGroup) => {
    let p = null;
    switch (propertyGroup) {
      case 'properties':
        p = await component.properties.id(propertyId);
        break;
      case 'headers':
        p = await component.headers.id(propertyId);
        break;
      case 'predefinedVars':
        p = await component.predefinedVars.id(propertyId);
        break;
      case 'mappedVars':
        p = await component.mappedVars.id(propertyId);
        break;
    }
    if (p === null) {
      throw new PropertyNotFoundError();
    } else {
      return p;
    }
  },

  updateComponentProperty: async (username, id, property, propertyGroup) => {
    let component = await ComponentService.findMyComponentById(username, id);
    let p = await ComponentService.findProperty(component, property._id, propertyGroup);
    p.name = property.name;
    p.valueType = property.valueType;
    p.inputType = property.inputType;
    p.options = property.options;
    p.required = property.required;
    p.value = property.value;
    try {
      await component.save();
    } catch (err) {
      if (err instanceof ValidationError) {
        throw ComponentService.normalizePropertyErrors(err);
      }
    }
  },

  deleteComponentProperty: async (username, id, property, propertyGroup) => {
    let component = await ComponentService.findMyComponentById(username, id);
    let p = await ComponentService.findProperty(component, property._id, propertyGroup);
    p.remove();
    return await component.save();
  },

  reorderComponentProperties: async (username, id, propertyIds, propertyGroup) => {
    let component = await ComponentService.findMyComponentById(username, id);
    let p = new Array(propertyIds.length);
    for (let i = 0; i < propertyIds.length; i++) {
      p[i] = await ComponentService.findProperty(component, propertyIds[i], propertyGroup);
    }
    switch (propertyGroup) {
      case 'properties':
        component.properties = p;
        break;
      case 'headers':
        component.headers = p;
        break;
      case 'predefinedVars':
        component.predefinedVars = p;
        break;
      case 'mappedVars':
        component.mappedVars = p;
        break;
    }
    return await component.save();
  }
}

module.exports = {
  ComponentNotFoundError,
  ForbiddenComponentError,
  PropertyNotFoundError,
  ComponentService,
}


