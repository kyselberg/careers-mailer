import TelegramBot from 'node-telegram-bot-api';
import { logger } from './logger';

// Abstract external logger interface
export interface ExternalLogger {
  log(message: string): Promise<void>;
}

export class TelegramLogger implements ExternalLogger {
  private bot: TelegramBot | null = null;
  private chatId: string | null = null;

  constructor() {
    const token = process.env['TELEGRAM_BOT_TOKEN'];
    const chatId = process.env['TELEGRAM_CHAT_ID'];

    if (token && chatId) {
      this.bot = new TelegramBot(token, { polling: false });
      this.chatId = chatId;
      logger.info('Telegram logger initialized');
    } else {
      logger.warn('Telegram credentials not provided, external logging disabled');
    }
  }

  async log(message: string): Promise<void> {
    if (this.bot && this.chatId) {
      try {
        await this.bot.sendMessage(this.chatId, message);
        logger.info('Message sent to Telegram');
      } catch (error) {
        logger.error('Failed to send message to Telegram:', error);
      }
    }
  }
}

// Initialize and export external logger instance
export const externalLogger: ExternalLogger = new TelegramLogger();