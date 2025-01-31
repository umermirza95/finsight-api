import {firestore} from "firebase-admin";
import FSICurrencyConverter from "../interface/FSICurrencyConverter";
import CONSTANTS from "../utils/constants";
import ERROR_MESSAGES from "../utils/error-messages";
import {logger} from "firebase-functions/v1";

class CurrencyConverter implements FSICurrencyConverter {
  async convert(amount: number, convertFrom: string, date: Date) {
    logger.info(`doing fixed currency conversion of ${convertFrom}`)
    const docId = `${date.getFullYear()}${date.getMonth() + 1}`;
    const snapshot = await firestore().collection(CONSTANTS.COLLECTIONS.EXCHANGE_RATES).doc(docId).get()
    const data = snapshot.data();
    if (!data || !data[convertFrom]) {
      throw Error(ERROR_MESSAGES["exchange_rate_failed"])
    }
    const rate = data[convertFrom] as number;
    return parseFloat((amount / rate).toFixed(2));
  }
}

class CurrencyConverterWise implements FSICurrencyConverter {
  async convert(amount: number, convertFrom: string, date: Date) {
    const url = `${CONSTANTS.WISE_API_URL}/rates?source=PKR&target=USD&time=${date.toISOString()}`;
    const req = await fetch(url, {
      headers: {Authorization: "Bearer " + process.env.WISE_API_KEY},
    });
    const res = await req.text();
    if (req.status >= 400) {
      throw Error(res);
    }
    const exchangeRate = JSON.parse(res)[0]?.rate as number;
    if (isNaN(exchangeRate)) {
      throw Error(ERROR_MESSAGES["exchange_rate_failed"])
    }
    return parseFloat((amount * exchangeRate).toFixed(2));
  }
}


const fixedCurrencyConverter = new CurrencyConverter();
const liveCurrencyConverter = new CurrencyConverterWise();

export default function getCurrencyConverter(live = false): FSICurrencyConverter {
  if (!live) {
    return fixedCurrencyConverter;
  }
  return liveCurrencyConverter
}
