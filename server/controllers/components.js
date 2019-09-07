const { ComponentService } = require('../../domain/greenhouse/services/ComponentService');
const ValidationError = require('mongoose/lib/error/validation');
const fs = require('fs');
const {resolve} = require("path");

const components = {

  // GET - /components/list
  list: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const resultsPerPage = 10;
      const page = req.query.page || 1;
      const search = req.query.search || '';
      let status = req.query.status || '';
      if (status !== 'enabled' && status !== 'disabled') {
        status = '';
      }
      let sortBy = req.query.sortBy || '';
      if (sortBy !== 'name' && sortBy !== 'updatedAt') {
        sortBy = '';
      }
      let sortType = req.query.sortType || 'asc';
      if (sortType !== 'asc' && sortType !== 'desc') {
        sortType = 'asc';
      }
      const data = await ComponentService.findPaginatedComponents(
        resultsPerPage,
        page,
        req.user.username,
        search,
        status,
        sortBy,
        sortType,
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // POST - /components/save
  save: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      let id = req.body.id;
      if (req.body.id === '') {
        const result = await ComponentService.createComponent(
          req.body.componentType,
          req.body.category,
          req.body.name,
          req.body.description,
          req.body.functionName,
          req.body.url,
          req.body.price,
          req.body.status,
          req.user.username
        );
        id = result._id;
      } else {
        let component = await ComponentService.findComponentById(id);
        component.componentType = req.body.componentType;
        component.category = req.body.category;
        component.name = req.body.name;
        component.description = req.body.description;
        component.functionName = req.body.functionName;
        component.url = req.body.url;
        component.price = req.body.price;
        component.status = req.body.status;
        await ComponentService.updateComponent(req.user.username, component);
      }
      res.status(200).json({saved: true, id: id});
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(422).json(err);
      } else {
        return res.status(500).json(err);
      }
    }
  },

  // GET - /components/:id
  view: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const data = await ComponentService.findComponentById(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // POST - /components/delete
  delete: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const component = await ComponentService.findMyComponentById(req.user.username, req.body.id);
      const oldFile = resolve(`${__dirname}/../../public/uploads/${component.picture}`);
      if (component.picture !== '') {
        if (fs.existsSync(oldFile)) {
          fs.unlink(oldFile, (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
      }
      const data = await ComponentService.deleteComponentById(req.user.username, req.body.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // POST - /components/:id/change-picture
  changePicture: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const component = await ComponentService.findMyComponentById(req.user.username, req.params.id);
      const oldFile = resolve(`${__dirname}/../../public/uploads/${component.picture}`);
      if (component.picture !== '') {
        if (fs.existsSync(oldFile)) {
          fs.unlink(oldFile, (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
      }
      component.picture = req.file.filename;
      const data = await ComponentService.updateComponent(req.user.username, component);
      res.status(200).json(oldFile);
    } catch (err) {
      next(err);
    }
  },

  // POST - /components/property/save
  saveProperty: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      let id = req.body.id;
      let propertyId = req.body.propertyId;
      if (propertyId === '') {
        const p = {
          name: req.body.propertyName,
          label: req.body.propertyLabel,
          inputType: req.body.propertyInputType,
          options: req.body.propertyOptions,
          required: req.body.propertyRequired,
        };
        await ComponentService.addComponentProperty(req.user.username, id, p);
      } else {
        const p = {
          _id: propertyId,
          name: req.body.propertyName,
          label: req.body.propertyLabel,
          inputType: req.body.propertyInputType,
          options: req.body.propertyOptions,
          required: req.body.propertyRequired,
        };
        await ComponentService.updateComponentProperty(req.user.username, id, p);
      }
      res.status(200).json({saved: true});
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(422).json(err);
      } else {
        return res.status(500).json(err);
      }
    }
  },

  // POST - /components/property/delete
  deleteProperty: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      let id = req.body.id;
      let propertyId = req.body.propertyId;
      const p = {
        _id: propertyId
      }
      await ComponentService.deleteComponentProperty(req.user.username, id, p);
      res.status(200).json({deleted: true});
    } catch (err) {
      next(err);
    }
  },

  // POST - /components/property/reorder
  reorderProperties: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      let id = req.body.id;
      let propertyIds = req.body.propertyIds.split(',');
      await ComponentService.reorderComponentProperties(req.user.username, id, propertyIds);
      res.status(200).json({saved: true});
    } catch (err) {
      next(err);
    }
  },
}

module.exports = components;

