import { DIService, tsyringeDependencyRegistryEngine } from 'discordx';
import 'dotenv/config';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Bot } from './bot';

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

Bot.start();
