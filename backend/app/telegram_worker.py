import asyncio
import logging
import os
import sys
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("telegram_worker")

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    welcome_text = (
        f"🤖 <b>TravelUZ Agency Bot Co-Pilot Connected!</b>\n\n"
        f"Your Chat ID is: <code>{chat_id}</code>\n\n"
        f"Copy this Chat ID into your TravelUZ Agency Settings to receive real-time lead telemetry and client inquiries directly in this chat!\n\n"
        f"Available commands:\n"
        f"/leads - View recent incoming leads\n"
        f"/help - Get agency co-pilot assistance"
    )
    await update.message.reply_html(welcome_text)

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "TravelUZ Telegram Co-pilot active. When a new client fills out a request on your public itinerary link, instant alerts will arrive here."
    )

async def main():
    token = os.environ.get("TELEGRAM_WORKER_BOT_TOKEN") or os.environ.get("TELEGRAM_BOT_TOKEN")
    if not token:
        logger.info("No TELEGRAM_WORKER_BOT_TOKEN found in environment. Worker idle.")
        while True:
            await asyncio.sleep(3600)

    logger.info("Starting Telegram Bot Worker...")
    app = Application.builder().token(token).build()
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))

    async with app:
        await app.start()
        await app.updater.start_polling()
        logger.info("Telegram Bot Polling started.")
        while True:
            await asyncio.sleep(3600)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Telegram worker stopped.")
