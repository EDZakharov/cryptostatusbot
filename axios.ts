import axios from 'axios'

const authGecko = (url: string): string => {
	return process.env.GECKOEND + url + process.env.QUERYAUTHGECKO
}

export async function ping() {
	try {
		const resp = await axios.get(authGecko('ping'))
		return resp
	} catch (error) {
		return null
	}
}

export async function getCoinsList() {
	try {
		const resp = await axios.get(authGecko('/coins/list'))
		return resp
	} catch (error) {
		return null
	}
}

export async function getCoinDataById(id: string) {
	try {
		const resp = await axios.get(authGecko(`/coins/${id}`))
		return resp
	} catch (error) {
		return null
	}
}
type currencies = {
	[key: string]: string
}
// type currencies = 'eth' | 'usd' | 'rub' | 'eur'

export async function getCoinPrice(id: string, inCurrency: currencies) {
	try {
		const resp = await getCoinDataById(id)
		if (resp) {
			const currentPrices = resp.data.market_data.current_price
			const imageUrl = resp.data.image.large
			const coinName = resp.data.name
			// Фильтрация и возврат цен в заданных валютах
			const filteredPrices = Object.keys(inCurrency).reduce((acc, currency) => {
				if (currentPrices[currency]) {
					acc[currency] = currentPrices[currency]
				}
				return acc
			}, {} as { [key: string]: number })

			return {
				price: filteredPrices,
				imageUrl: imageUrl,
				name: coinName,
			}
		}
	} catch (error) {
		console.error('Error fetching data:', error)
		return null
	}
}
