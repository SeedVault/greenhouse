import {
  ComponentService as componentService,
} from '../../../domain/greenhouse/services/ComponentService';
import {
  BotService as botService, BotNotFoundError, ForbiddenBotError,
  BotEngineRequiredError, ChannelRequiredError, BotSubscriptionNotFoundError,
} from '../../../domain/greenhouse/services/BotService';

async function createComponent(name, componentType) {
  const noSpaces = name.replace(/\s/g, '');
  const fn = noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
  return componentService.createComponent(
    componentType,
    'general',
    name,
    `Description of ${name}`,
    'license here',
    `${fn}`,
    `${fn}Fn`,
    `https:/www.${noSpaces.toLowerCase()}.com`,
    'GET',
    30,
    'free',
    0,
    0,
    'enabled',
    'johndoe',
  );
}

async function addProperty(id, propertyName) {
  const newProperty = {
    name: propertyName.replace(/\s/g, ''),
    valueType: 'fixed',
    inputType: 'text',
    options: '',
    required: 'yes',
    value: 'test',
  };
  return componentService.addComponentProperty('johndoe', id, newProperty, 'properties');
}

async function addHeader(id, propertyName) {
  const newProperty = {
    name: propertyName.replace(/\s/g, ''),
    valueType: 'fixed',
    inputType: 'text',
    options: '',
    required: 'yes',
    value: 'test',
  };
  return componentService.addComponentProperty('johndoe', id, newProperty, 'headers');
}

async function addPredefinedVar(id, propertyName) {
  const newProperty = {
    name: propertyName.replace(/\s/g, ''),
    valueType: 'fixed',
    inputType: 'text',
    options: '',
    required: 'yes',
    value: 'test',
  };
  return componentService.addComponentProperty('johndoe', id, newProperty, 'predefinedVars');
}

async function addMappedVar(id, propertyName) {
  const newProperty = {
    name: propertyName.replace(/\s/g, ''),
    valueType: 'fixed',
    inputType: 'text',
    options: '',
    required: 'yes',
    value: 'test',
  };
  return componentService.addComponentProperty('johndoe', id, newProperty, 'mappedVars');
}


async function createAllComponents() {
  const allComponents = [];
  // if (typeof allComponents.chatscript === 'undefined') {
  allComponents.chatscript = await createComponent('ChatScript', 'botengine');
  allComponents.chatscript = await addProperty(allComponents.chatscript._id, 'Bot ID');
  allComponents.chatscript = await addProperty(allComponents.chatscript._id, 'Host');
  allComponents.chatscript = await addProperty(allComponents.chatscript._id, 'Port');
  allComponents.accuWeather = await createComponent('AccuWeather', 'service');
  allComponents.accuWeather = await addProperty(allComponents.accuWeather._id, 'API Key');
  allComponents.accuWeather = await addHeader(allComponents.accuWeather._id, 'head');
  allComponents.accuWeather = await addPredefinedVar(allComponents.accuWeather._id, 'p');
  allComponents.accuWeather = await addMappedVar(allComponents.accuWeather._id, 'q');
  allComponents.googleTranslate = await createComponent('Google Translate', 'service');
  allComponents.telegram = await createComponent('Telegram', 'channel');
  allComponents.telegram = await addProperty(allComponents.telegram._id, 'Token');
  // }
  return allComponents;
}

async function createBot(name, components) {
  const noSpaces = name.replace(/\s/g, '');
  const chatscriptValues = new Map();
  chatscriptValues.set(`_${components.chatscript.properties[0]._id}`, 'myId');
  chatscriptValues.set(`_${components.chatscript.properties[1]._id}`, 'http://127.0.0.1');
  chatscriptValues.set(`_${components.chatscript.properties[2]._id}`, '1024');
  const accuWeatherValues = new Map();
  accuWeatherValues.set(`_${components.accuWeather.properties[0]._id}`, 'myAccuWeatherKey');
  const googleTranslateValues = new Map();
  const telegramValues = new Map();
  telegramValues.set(`_${components.telegram.properties[0]._id}`, 'telegram3itqF3eoXaY');
  const bot = await botService.createBot(
    'general',
    noSpaces,
    name,
    'This is my bot',
    'Features of my bot',
    'license here',
    'free',
    0,
    0,
    'enabled',
    'johndoe',
    {
      component: components.chatscript._id,
      subscriptionType: 'month',
      values: chatscriptValues,
    },
    [
      {
        component: components.accuWeather._id,
        subscriptionType: 'month',
        values: accuWeatherValues,
      },
      {
        component: components.googleTranslate._id,
        subscriptionType: 'month',
        values: googleTranslateValues,
      },
    ],
    [
      {
        component: components.telegram._id,
        subscriptionType: 'month',
        values: telegramValues,
      },
    ],
  );
  return bot;
}

describe('Bots', () => {
  it('should create a valid bot', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    expect(bot).toHaveProperty('_id');
    const savedBot = await botService.findBotById(bot._id);
    expect(savedBot.name).toBe(bot.name);
  });

  it('should throw a "bot engine required" error when a bot engine is missing', async () => {
    try {
      const components = await createAllComponents();
      const bot = await createBot('my bot', components);
      bot.botEngine = {};
      await botService.updateBot('johndoe', bot);
    } catch (err) {
      expect(err).toBeInstanceOf(BotEngineRequiredError);
    }
  });

  it('should throw a "channel required" error when a channel is missing', async () => {
    try {
      const components = await createAllComponents();
      const bot = await createBot('my bot', components);
      bot.channels = [];
      await botService.updateBot('johndoe', bot);
    } catch (err) {
      expect(err).toBeInstanceOf(ChannelRequiredError);
    }
  });

  it('should throw a "bot not found" error when passed a wrong bot id', async () => {
    try {
      await botService.findBotById();
    } catch (err) {
      expect(err).toBeInstanceOf(BotNotFoundError);
    }
  });

  it('should update a valid bot', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    expect(bot).toHaveProperty('_id');
    const id = bot._id;
    let savedBot = await botService.findBotById(id);
    bot.name = 'MyNewName';
    await botService.updateBot('johndoe', bot);
    savedBot = await botService.findBotById(id);
    expect(savedBot.name).toBe('MyNewName');
  });


  it('should throw a "forbidden bot" error when trying to update a bot that doesn\'t belong to me', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    expect(bot).toHaveProperty('_id');
    const id = bot._id;
    await botService.findBotById(id);
    bot.name = 'MyNewName';
    try {
      await botService.updateBot('notmine', bot);
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenBotError);
    }
  });

  it('should change the picture of a bot', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    expect(bot).toHaveProperty('_id');
    expect(bot.pictureUrl).toBe('/images/bot-default.png');
    const id = bot._id;
    bot.picture = '12345678.jpg';
    await botService.updateBot('johndoe', bot);
    const savedBot = await botService.findBotById(id);
    expect(savedBot.pictureUrl).toBe('/uploads/12345678.jpg');
  });

  it('should retrieve paginated results', async () => {
    const components = await createAllComponents();
    await createBot('bot one', components);
    await createBot('bot two', components);
    await createBot('bot three', components);
    await createBot('bot four', components);
    const resultsPageOne = await botService.findPaginatedBots(3, 1, '', '', '', 'name', 'asc');
    expect(resultsPageOne.results.length).toBe(3);
    expect(resultsPageOne.resultsCount).toBe(4);
    expect(resultsPageOne.currentPage).toBe(1);
    expect(resultsPageOne.pagesCount).toBe(2);
    const resultsPageTwo = await botService.findPaginatedBots(3, 2, '', '', '', 'name', 'asc');
    expect(resultsPageTwo.results.length).toBe(1);
    expect(resultsPageTwo.resultsCount).toBe(4);
    expect(resultsPageTwo.currentPage).toBe(2);
    expect(resultsPageTwo.pagesCount).toBe(2);
  });

  it('should filter results by username, search text and status', async () => {
    const components = await createAllComponents();
    await createBot('bot one', components);
    await createBot('bot two', components);
    await createBot('bot three', components);
    const four = await createBot('bot four', components);
    four.username = 'janedoe';
    four.status = 'disabled';
    await botService.updateBot('johndoe', four);
    let rows = await botService.findPaginatedBots(3, 1, 'johndoe', '', '', 'name', 'asc');
    expect(rows.results.length).toBe(3);
    rows = await botService.findPaginatedBots(3, 1, 'janedoe', '', 'disabled', 'name', 'asc');
    expect(rows.results.length).toBe(1);
    rows = await botService.findPaginatedBots(3, 1, 'mike', '', '', 'name', 'asc');
    expect(rows.results.length).toBe(0);
    rows = await botService.findPaginatedBots(3, 1, 'johndoe', 'three', '', 'name', 'asc');
    expect(rows.results.length).toBe(1);
  });

  it('should delete a bot that belongs to me', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    expect(bot).toHaveProperty('_id');
    const id = bot._id;
    const value = await botService.deleteBotById('johndoe', id);
    expect(value.deletedCount).toBe(1);
    try {
      await botService.deleteBotById('johndoe', id);
    } catch (err) {
      expect(err).toBeInstanceOf(BotNotFoundError);
    }
  });

  it('should throw a "forbidden bot" error when trying to delete a bot that doesn\'t belong to me', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    expect(bot).toHaveProperty('_id');
    const id = bot._id;
    try {
      await botService.deleteBotById('notmine', id);
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenBotError);
    }
  });
});

describe('Bot subscription', () => {
  it('should be able to subscribe to a bot', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    const subscription = await botService.subscribe('johndoe', bot._id, 'free');
    expect(subscription).toHaveProperty('_id');
    expect(subscription.username).toBe('johndoe');
  });

  it('should be able to retrieve a subscription by username and bot id', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    await botService.subscribe('johndoe', bot._id, 'free');
    const savedSubscription = await botService.findSubscriptionByUserAndBot('johndoe', bot._id);
    expect(savedSubscription).toHaveProperty('_id');
    expect(savedSubscription.username).toBe('johndoe');
  });

  it('should throw a "bot subscription not found" error when passed a wrong bot or username', async () => {
    try {
      await botService.findSubscriptionByUserAndBot('none', '5d8e657a7ecd975e9f577b85');
    } catch (err) {
      expect(err).toBeInstanceOf(BotSubscriptionNotFoundError);
    }
  });

  it('should be able to unsubscribe from a bot', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    const subscription = await botService.subscribe('johndoe', bot._id, 'free');
    expect(subscription).toHaveProperty('_id');
    const id = bot._id;
    const value = await botService.unsubscribe('johndoe', id);
    expect(value.deletedCount).toBe(1);
    try {
      await botService.unsubscribe('johndoe', id);
    } catch (err) {
      expect(err).toBeInstanceOf(BotSubscriptionNotFoundError);
    }
  });

  it('should be able to list subscriptions of a user', async () => {
    const components = await createAllComponents();
    const botOne = await createBot('bot one', components);
    const botTwo = await createBot('bot two', components);
    await createBot('bot three', components);
    await botService.subscribe('janedoe', botOne._id, 'free');
    await botService.subscribe('janedoe', botTwo._id, 'free');
    const rows = await botService.findPaginatedBotSubscriptions('janedoe', 3, 1, '', '', '', 'name', 'asc');
    expect(rows.resultsCount).toBe(2);
  });
});
