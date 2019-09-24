import {
  ComponentService as componentService, ComponentNotFoundError,
  ForbiddenComponentError, PropertyNotFoundError,
} from '../../../domain/greenhouse/services/ComponentService';

async function createComponent(name) {
  const noSpaces = name.replace(/\s/g, '');
  const fn = noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
  return componentService.createComponent(
    'botengine',
    'general',
    name,
    `Description of ${name}`,
    `${fn}`,
    `${fn}Fn`,
    `https:/www.${noSpaces.toLowerCase()}.com`,
    'free',
    0,
    0,
    'enabled',
    'johndoe',
  );
}

async function addProperty(username, id, propertyName) {
  const newProperty = {
    name: propertyName,
    inputType: 'text',
    options: '',
    required: 'yes',
    key: propertyName.replace(/\s/g, ''),
  };
  return componentService.addComponentProperty(username, id, newProperty, 'properties');
}

describe('Components', () => {
  it('should create a valid component', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    const savedComponent = await componentService.findComponentById(component._id);
    expect(savedComponent.name).toBe(component.name);
  });

  it('should throw validation errors when passed empty data', async () => {
    try {
      await componentService.createComponent();
    } catch (err) {
      expect(err.name).toBe('ValidationError');
    }
  });

  it('should throw a validation error when the component name is already in use', async () => {
    try {
      const component = await createComponent('chatscript');
      component.url = 'anything';
      await componentService.updateComponent('johndoe', component);
      await createComponent('ChatScript');
    } catch (err) {
      expect(err.errors.name.message).toBe('domain.component.validation.unique_name');
    }
  });

  it('should throw a "component not found" error when passed a wrong component id', async () => {
    try {
      await componentService.findComponentById();
    } catch (err) {
      expect(err).toBeInstanceOf(ComponentNotFoundError);
    }
  });

  it('should update a valid component', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    const id = component._id;
    let savedComponent = await componentService.findComponentById(id);
    component.name = 'MyNewName';
    await componentService.updateComponent('johndoe', component);
    savedComponent = await componentService.findComponentById(id);
    expect(savedComponent.name).toBe('MyNewName');
  });

  it('should throw a "forbidden component" error when trying to update a component that doesn\'t belong to me', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    const id = component._id;
    await componentService.findComponentById(id);
    component.name = 'MyNewName';
    try {
      await componentService.updateComponent('notmine', component);
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenComponentError);
    }
  });

  it('should change the picture of a component', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    expect(component.pictureUrl).toBe('/images/component-default.png');
    const id = component._id;
    component.picture = '12345678.jpg';
    await componentService.updateComponent('johndoe', component);
    const savedComponent = await componentService.findComponentById(id);
    expect(savedComponent.pictureUrl).toBe('/uploads/12345678.jpg');
  });

  it('should retrieve components in an array of ids', async () => {
    const one = await createComponent('one');
    const two = await createComponent('two');
    await createComponent('three');
    const results = await componentService.findComponentsWithIdInArray([one._id, two._id]);
    expect(results.length).toBe(2);
  });

  it('should retrieve paginated results', async () => {
    await createComponent('one');
    await createComponent('two');
    await createComponent('three');
    await createComponent('four');
    const resultsPageOne = await componentService.findPaginatedComponents(3, 1, '', '', '', '', 'name', 'asc');
    expect(resultsPageOne.results.length).toBe(3);
    expect(resultsPageOne.resultsCount).toBe(4);
    expect(resultsPageOne.currentPage).toBe(1);
    expect(resultsPageOne.pagesCount).toBe(2);
    const resultsPageTwo = await componentService.findPaginatedComponents(3, 2, '', '', '', '', 'name', 'asc');
    expect(resultsPageTwo.results.length).toBe(1);
    expect(resultsPageTwo.resultsCount).toBe(4);
    expect(resultsPageTwo.currentPage).toBe(2);
    expect(resultsPageTwo.pagesCount).toBe(2);
  });

  it('should filter results by username, search text, component type and status', async () => {
    await createComponent('one');
    await createComponent('two');
    await createComponent('three');
    const four = await createComponent('four');
    four.username = 'janedoe';
    four.status = 'disabled';
    await componentService.updateComponent('johndoe', four);
    // username
    let rows = await componentService.findPaginatedComponents(3, 1, 'johndoe', '', '', '', 'name', 'asc');
    expect(rows.results.length).toBe(3);
    rows = await componentService.findPaginatedComponents(3, 1, 'janedoe', '', '', 'disabled', 'name', 'asc');
    expect(rows.results.length).toBe(1);
    rows = await componentService.findPaginatedComponents(3, 1, 'mike', '', '', '', 'name', 'asc');
    expect(rows.results.length).toBe(0);
    // Component type
    rows = await componentService.findPaginatedComponents(3, 1, '', '', 'botengine', 'enabled', 'name', 'asc');
    expect(rows.results.length).toBe(3);
    // Status
    rows = await componentService.findPaginatedComponents(3, 1, '', '', '', 'disabled', 'name', 'asc');
    expect(rows.results.length).toBe(1);
    // search
    rows = await componentService.findPaginatedComponents(3, 1, 'johndoe', 'three', '', '', 'name', 'asc');
    expect(rows.results.length).toBe(1);
  });

  it('should delete a component that belongs to me', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    const id = component._id;
    const value = await componentService.deleteComponentById('johndoe', id);
    expect(value.deletedCount).toBe(1);
    try {
      await componentService.deleteComponentById('johndoe', id);
    } catch (err) {
      expect(err).toBeInstanceOf(ComponentNotFoundError);
    }
  });

  it('should throw a "forbidden component" error when trying to delete a component that doesn\'t belong to me', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    const id = component._id;
    try {
      await componentService.deleteComponentById('notmine', id);
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenComponentError);
    }
  });
});

describe('Properties', () => {
  it('should add a new property to a component', async () => {
    let component = await createComponent('chatscript');
    const id = component._id;
    component = await addProperty('johndoe', id, 'host');
    expect(component.properties.length).toBe(1);
    expect(component.properties[0].name).toBe('host');
    expect(component.properties[0]).toHaveProperty('_id');
  });

  it('should throw a "forbidden component" error when trying to add a property to a component that doesn\'t belong to me', async () => {
    let component = await createComponent('chatscript');
    const id = component._id;
    try {
      component = await addProperty('notmine', id, 'host');
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenComponentError);
    }
  });

  it('should update a property of a component', async () => {
    let component = await createComponent('chatscript');
    const id = component._id;
    component = await addProperty('johndoe', id, 'host', 'properties');
    const property = component.properties[0];
    property.name = 'port';
    await componentService.updateComponentProperty('johndoe', id, property, 'properties');
    const savedComponent = await componentService.findComponentById(id);
    expect(savedComponent.properties[0].name).toBe('port');
  });

  it('should throw a "forbidden component" error when trying to update a property of a component that doesn\'t belong to me', async () => {
    let component = await createComponent('chatscript');
    const id = component._id;
    component = await addProperty('johndoe', id, 'host');
    const property = component.properties[0];
    property.name = 'port';
    try {
      component = await addProperty('notmine', id, 'host');
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenComponentError);
    }
  });

  it('should throw a "property not found" error when passed a wrong property id', async () => {
    const component = await createComponent('chatscript');
    const id = component._id;
    const property = {
      _id: 'itDoesNotExist',
    };
    try {
      await componentService.updateComponentProperty('johndoe', id, property);
    } catch (err) {
      expect(err).toBeInstanceOf(PropertyNotFoundError);
    }
  });

  it('should delete a property of a component', async () => {
    let component = await createComponent('chatscript');
    const id = component._id;
    component = await addProperty('johndoe', id, 'host');
    const property = component.properties[0];
    await componentService.deleteComponentProperty('johndoe', id, property, 'properties');
    const savedComponent = await componentService.findComponentById(id);
    expect(savedComponent.properties.length).toBe(0);
  });

  it('should throw a "forbidden component" error when trying to delete a property of a component that doesn\'t belong to me', async () => {
    let component = await createComponent('chatscript');
    const id = component._id;
    component = await addProperty('johndoe', id, 'host');
    const property = component.properties[0];
    try {
      await componentService.deleteComponentProperty('notmine', id, property);
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenComponentError);
    }
  });

  it('should reorder properties of a component', async () => {
    let component = await createComponent('chatscript');
    const id = component._id;
    component = await addProperty('johndoe', id, 'one');
    component = await addProperty('johndoe', id, 'two');
    component = await addProperty('johndoe', id, 'three');
    expect(component.properties.length).toBe(3);
    expect(component.properties[0].name).toBe('one');
    expect(component.properties[1].name).toBe('two');
    expect(component.properties[2].name).toBe('three');
    const newOrder = [
      component.properties[2]._id,
      component.properties[1]._id,
      component.properties[0]._id,
    ];
    component = await componentService.reorderComponentProperties('johndoe', id, newOrder, 'properties');
    expect(component.properties.length).toBe(3);
    expect(component.properties[0].name).toBe('three');
    expect(component.properties[1].name).toBe('two');
    expect(component.properties[2].name).toBe('one');
  });
});
