import 'dotenv/config'
import { Bot, Keyboard } from 'grammy'
import { getCoinPrice } from './axios'

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot('6112029454:AAGEEwf4d__zPg7s_7TXV9eBuivOkmYO88I') // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
const keyboard = new Keyboard()
	.text('Show prices')
	.row()
	.text('Favorite coins')
	.resized()

bot.command('start', (ctx) =>
	ctx.reply('Welcome! Up and running.', { reply_markup: keyboard })
)
// Handle other messages.

const inCurrency = {
	usd: 'USD',
	btc: 'BTC',
	rub: 'RUB',
}

bot.hears('Show prices', async (ctx) => {
	const resp = await getCoinPrice('kaspa', inCurrency)
	if (resp) {
		// Форматирование текста с текущими ценами
		const prices = resp.price
		const formattedPrices = Object.keys(prices)
			.map((currency) => `${currency.toUpperCase()}: ${prices[currency]}`)
			.join('\n')
		const message = `Current ${resp.name} Prices:\n${formattedPrices}`
		ctx.replyWithPhoto(resp.imageUrl, { caption: message })
	} else {
		ctx.reply('Failed to fetch prices.')
	}
})

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start()
