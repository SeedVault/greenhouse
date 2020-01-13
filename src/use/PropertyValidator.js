import { reactive, toRefs } from '@vue/composition-api';

export default function PropertyValidator() {
  const data = reactive({
    validationErrors: [],
  });

  function validateDefinition(property) {
    const validationErrors = [];
    if (property.name === '') {
      validationErrors.name = [{ msg: 'validation.required' }];
    } else {
      const rule = /^[a-zA-Z_$][a-zA-Z_\-$0-9]*$/;
      if (rule.test(property.name) === false) {
        validationErrors.name = [{ msg: 'validation.regex' }];
      }
    }
    return validationErrors;
  }

  function validate(values, config) {
    const validationErrors = [];
    const collectionNames = ['properties', 'headers', 'predefinedVars', 'mappedVars'];
    for (let i = 0; i < collectionNames.length; i++) {
      const collectionName = collectionNames[i];
      if (config[collectionName] !== 'undefined' && config[collectionName].length > 0) {
        for (let j = 0; j < config[collectionName].length; j++) {
          const property = config[collectionName][j];
          const value = values.values.get(property._id) || '';
          if (property.required === 'yes' && value === '') {
            validationErrors[property._id] = [{ msg: 'validation.required' }];
          }
        }
      }
    }
    return validationErrors;
  }

  return {
    ...toRefs(data),
    validateDefinition,
    validate,
  };
}
