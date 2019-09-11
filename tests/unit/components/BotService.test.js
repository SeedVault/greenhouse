import {
  ComponentService as componentService, ComponentNotFoundError,
  ForbiddenComponentError, PropertyNotFoundError,
} from '../../../domain/greenhouse/services/ComponentService';
import {
  BotService as botService, BotNotFoundError, ForbiddenBotError,
} from '../../../domain/greenhouse/services/BotService';
import { Config } from '@jest/types';

async function createComponent(name, componentType) {
  const noSpaces = name.replace(/\s/g, '');
  const fn = noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
  return componentService.createComponent(
    componentType,
    'general',
    name,
    `Description of ${name}`,
    `${fn}`,
    `${fn}Fn`,
    `https:/www.${noSpaces.toLowerCase()}.com`,
    0,
    'enabled',
    'johndoe',
  );
}

async function addProperty(id, propertyName) {
  const newProperty = {
    name: propertyName,
    inputType: 'text',
    options: '',
    required: 'yes',
    key: propertyName.replace(/\s/g, ''),
  };
  return componentService.addComponentProperty('johndoe', id, newProperty);
}

async function createAllComponents() {
  let allComponents = [];
  // if (typeof allComponents.chatscript === 'undefined') {
    allComponents.chatscript = await createComponent('ChatScript', 'botengine');
    allComponents.chatscript = await addProperty(allComponents.chatscript._id, 'Bot ID');
    allComponents.chatscript = await addProperty(allComponents.chatscript._id, 'Host');
    allComponents.chatscript = await addProperty(allComponents.chatscript._id, 'Port');
    allComponents.accuWeather = await createComponent('AccuWeather', 'service');
    allComponents.accuWeather = await addProperty(allComponents.accuWeather._id, 'API Key');
    allComponents.googleTranslate = await createComponent('Google Translate', 'service');
    allComponents.telegram = await createComponent('Telegram', 'channel');
    allComponents.telegram = await addProperty(allComponents.telegram._id, 'Token');
  // }
  return allComponents;
}

async function createBot(name, components) {
  let chatscriptValues = new Map();
  chatscriptValues.set(`_${components.chatscript.properties[0]._id}`, 'myId');
  chatscriptValues.set(`_${components.chatscript.properties[1]._id}`, 'http://127.0.0.1');
  chatscriptValues.set(`_${components.chatscript.properties[2]._id}`, '1024');
  let accuWeatherValues = new Map();
  accuWeatherValues.set(`_${components.accuWeather.properties[0]._id}`, 'myAccuWeatherKey');
  let googleTranslateValues = new Map();
  let telegramValues = new Map();
  telegramValues.set(`_${components.telegram.properties[0]._id}`, 'telegram3itqF3eoXaY');
  const bot = await botService.createBot(
    'general',
    name,
    'This is my bot',
    `Features of my bot`,
    0,
    'enabled',
    'johndoe',
    {
      component: components.chatscript._id,
      values: chatscriptValues,
    },
    [
      {
        component: components.accuWeather._id,
        values: accuWeatherValues,
      },
      {
        component: components.googleTranslate._id,
        values: googleTranslateValues,
      },
    ],
    [
      {
        component: components.telegram._id,
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

/*  it('should throw validation errors when passed empty data', async () => {
    try {
      await botService.createBot();
    } catch (err) {
      expect(err.name).toBe('ValidationError');
    }
  }); */

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
    let id = bot._id;
    let savedBot = await botService.findBotById(id);
    bot.name = 'MyNewName';
    const saved = await botService.updateBot('johndoe', bot);
    savedBot = await botService.findBotById(id);
    expect(savedBot.name).toBe('MyNewName');
  });


  it('should throw a "forbidden bot" error when trying to update a bot that doesn\'t belong to me', async () => {
    const components = await createAllComponents();
    const bot = await createBot('my bot', components);
    expect(bot).toHaveProperty('_id');
    let id = bot._id;
    let savedBot = await botService.findBotById(id);
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
    let id = bot._id;
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
