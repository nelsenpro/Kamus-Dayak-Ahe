import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes, CallbackContext

# Token bot langsung ditulis di sini
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
            text="Buka Kamus Dayak Ahe",
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
        logger.exception("Terjadi kesalahan di handler /start")
        await update.message.reply_text("Terjadi kesalahan, coba lagi nanti.")

# Handler global untuk error
async def error_handler(update: object, context: CallbackContext):
    logger.error("Update %s menyebabkan error: %s", update, context.error)

# Fungsi utama untuk menjalankan bot
def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_error_handler(error_handler)
    logger.info("Bot sedang berjalan...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
