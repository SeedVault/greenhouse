import {
  ComponentService as componentService, ComponentNotFoundError, ForbiddenComponentError,
} from '../../../domain/greenhouse/services/ComponentService';

async function createComponent(name) {
  return componentService.createComponent(
    'botengine',
    'general',
    name,
    `Description of ${name}`,
    `${name}Fn`,
    `https:/www.${name}.com`,
    0,
    'enabled',
    'johndoe',
    /* [
      {
        name: 'host',
        label: 'Host',
        inputType: 'text',
        required: 'true',
      },
      {
        name: 'port',
        label: 'Port',
        inputType: 'text',
        required: 'false',
      },
    ], */
  );
}

describe('ComponentService', () => {
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
      await createComponent('chatscript');
      await createComponent('ChatScript');
    } catch (err) {
      expect(err.errors.name.message).toBe('domain.component.validation.unique_name');
    }
  });

  it('should throw an "component not found" error when passed a wrong component id', async () => {
    try {
      await componentService.findComponentById();
    } catch (err) {
      expect(err).toBeInstanceOf(ComponentNotFoundError);
    }
  });

  it('should update a valid component', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    let id = component._id;
    let savedComponent = await componentService.findComponentById(id);
    component.name = "MyNewName";
    const saved = await componentService.updateComponent(component);
    savedComponent = await componentService.findComponentById(id);
    expect(savedComponent.name).toBe("MyNewName");
  });

  it('should retrieve paginated results', async () => {
    await createComponent('one');
    await createComponent('two');
    await createComponent('three');
    await createComponent('four');
    const resultsPageOne = await componentService.findPaginatedComponents(3, 1, '', '', '', 'name', 'asc');
    expect(resultsPageOne.results.length).toBe(3);
    expect(resultsPageOne.resultsCount).toBe(4);
    expect(resultsPageOne.currentPage).toBe(1);
    expect(resultsPageOne.pagesCount).toBe(2);
    const resultsPageTwo = await componentService.findPaginatedComponents(3, 2, '', '', '', 'name', 'asc');
    expect(resultsPageTwo.results.length).toBe(1);
    expect(resultsPageTwo.resultsCount).toBe(4);
    expect(resultsPageTwo.currentPage).toBe(2);
    expect(resultsPageTwo.pagesCount).toBe(2);
  });


  it('should delete a component that belongs to me', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    const id = component._id;
    const value = await componentService.deleteComponentById(id, 'johndoe');
    expect(value.deletedCount).toBe(1);
    try {
      await componentService.deleteComponentById(id, 'johndoe');
    } catch (err) {
      expect(err).toBeInstanceOf(ComponentNotFoundError);
    }
  });


  it('should throw an "forbidden component" error when passed a component that doesn\'t belong to me', async () => {
    const component = await createComponent('chatscript');
    expect(component).toHaveProperty('_id');
    const id = component._id;
    try {
      const value = await componentService.deleteComponentById(id, 'notmine');
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenComponentError);
    }
  });
});
