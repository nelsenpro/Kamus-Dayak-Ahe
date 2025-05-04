import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes, CallbackContext

# Ganti dengan token bot yang kamu dapat dari BotFather
TOKEN = "8115015978:AAE86e9JWykCoqN9ehufYHvEBp2P2sPwpO8"

# Mengaktifkan logging untuk debugging dan pemantauan
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

# Fungsi untuk menyambut pengguna dengan tombol PWA
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Tombol untuk membuka PWA
        keyboard = [
            [InlineKeyboardButton("Buka Kamus Dayak Ahe", web_app=WebAppInfo(url="https://nelsenpro.github.io/kd/"))]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        # Kirim pesan sambutan dengan tombol
        await update.message.reply_text(
            "Selamat datang! Klik tombol di bawah untuk membuka aplikasi Kamus Dayak Ahe:",
            reply_markup=reply_markup
        )
    except Exception as e:
        logger.error(f"Error in start function: {e}")
        await update.message.reply_text("Terjadi kesalahan, coba lagi nanti.")

# Fungsi untuk menangani error umum di seluruh bot
async def error(update: Update, context: CallbackContext):
    logger.warning(f"Update {update} caused error {context.error}")

# Membuat aplikasi bot dan menambahkan handler
def main():
    app = Application.builder().token(TOKEN).build()

    # Menambahkan handler untuk command /start
    app.add_handler(CommandHandler("start", start))

    # Menambahkan handler untuk menangani error global
    app.add_error_handler(error)

    # Menjalankan bot dengan polling
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
