const ValidationError = require('mongoose/lib/error/validation');
const { Component, Attribute } = require('../entities/Component');


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

const ComponentService = {
  createComponent: async (componentType, category, name, description, functionName, url, price,
    status, username) => {
      let component = new Component({
        componentType,
        category,
        name,
        description,
        functionName,
        url,
        price,
        status,
        username
      });
      component.attributes = [];
      return await component.save();
  },

  updateComponent: async (component) => {
    return await component.save();
  },

  findComponentById: async (id) => {
    let component = await Component.findById(id).exec();
    if (!component) {
      throw new ComponentNotFoundError();
    }
    return component;
  },

  findPaginatedComponents: async (resultsPerPage, currentPage, username, search, status, sortBy, sortType) => {
    let query = {}
    let sorting = {}
    if (username !== '' ) {
      query['username'] = username;
    }
    if (search !== '') {
      query['$and'] = [{ $or: [{name: { $regex:  `.*${search}.*`, $options: 'i' }}, {description: { $regex:  `.*${search}.*`, $options: 'i' }}] }];
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
    const resultsCount = await Component.countDocuments();
    const pagesCount = Math.ceil(resultsCount / resultsPerPage);
    return {
      results,
      resultsCount,
      currentPage,
      pagesCount,
    }
  },

  deleteComponentById: async (id, username) => {
    let component = await Component.findById(id).exec();
    if (!component) {
      throw new ComponentNotFoundError();
    }
    if (component.username === username) {
      return await Component.deleteOne({_id: id});
    } else {
      throw new ForbiddenComponentError('');
    }
  },
}

module.exports = {
  ComponentNotFoundError,
  ForbiddenComponentError,
  ComponentService,
}


