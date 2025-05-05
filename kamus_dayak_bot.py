import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes, CallbackContext

# Token bot dari BotFather
TOKEN = ""

# Konfigurasi logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Handler untuk perintah /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[
        InlineKeyboardButton(
            "Buka Kamus Dayak Ahe",
            web_app=WebAppInfo(url="https://nelsenpro.github.io/kd/")
        )
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    try:
        await update.message.reply_text(
            "Selamat datang! Klik tombol di bawah untuk membuka aplikasi Kamus Dayak Ahe:",
            reply_markup=reply_markup
        )
    except Exception as e:
        logger.error("Error in start handler: %s", e)
        await update.message.reply_text("Terjadi kesalahan, coba lagi nanti.")

# Handler global untuk error
async def error_handler(update: object, context: CallbackContext):
    logger.warning("Update %s caused error %s", update, context.error)

# Fungsi utama menjalankan bot
def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_error_handler(error_handler)
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
