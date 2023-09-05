import { useReducer, useState } from 'react';
import './App.css';
import Input from './components/Input';
import Select from './components/Select';

const API_KEY = process.env.REACT_APP_FREECURRENCY_KEY;
const AMOUNT_REGEX = /^\d*(\.\d{0,2})?$/g;
const HISTORY_LENGTH = 20;
const CURRENCIES = ['USD', 'EUR', 'JPY', 'BGN', 'DKK', 'CZK', 'HRK', 'PLN', 'GBP', 'TRY'];

const getConversion = async (fromCurrency, toCurrency) => {
  const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}`);
  return response.json();
};

const historyReducer = (state, action) => {
  switch (action.type) {
    case 'addItem': {
      return [...state, action.item].slice(-HISTORY_LENGTH);
    }
    case 'removeItem': {
      return state.filter(record => record.key !== action.key);
    }
    case 'clear': {
      return [];
    }
    default: {
      return state;
    }
  }
};

const App = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState(CURRENCIES[1]);
  const [error, setError] = useState('');
  const [history, dispatchHistory] = useReducer(historyReducer, []);

  const onConvert = async () => {
    const conversionResponse = await getConversion(fromCurrency, toCurrency);
    if (conversionResponse.message) {
      setError(conversionResponse.message);
      return;
    } else {
      setError('');
    }

    const conversionData = conversionResponse.data;
    const conversionRate = conversionData[toCurrency];
    const conversionResult = amount*conversionRate;

    dispatchHistory({
      type: 'addItem',
      item: {
        key: new Date().toJSON(),
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        amount: amount,
        conversionResult: conversionResult,
      }
    });
  };

  const currencyOptions = CURRENCIES.map(currency => ({ label: currency, value: currency }));

  const isDataValid = fromCurrency.length === 3 && toCurrency.length === 3 && amount;

  return (
    <div className='App container-md'>
      <div className='p-3 md-3'>
        <Input
          label='Amount'
          value={amount}
          onChange={(e) => {
            const inputValue = e.target.value.toUpperCase();
            const match = inputValue.match(AMOUNT_REGEX);
            if (match) {
              setAmount(inputValue);
            }
          }}
          placeholder='Select amount...'
        />
        <Select
          label='From currency'
          options={currencyOptions}
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        />
        <Select
          label='To currency'
          options={currencyOptions}
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        />
        <button
          className="btn btn-primary"
          disabled={!isDataValid}
          onClick={onConvert}
        >
          Convert
        </button>
        {error && <div className='mt-2 alert alert-danger' style={{ display: error ? 'block' : 'none' }}>{error}</div>}
      </div>
      <div className='p-3'>
        <h2>History</h2>
        <div className='p-3 mb-4 border'>
          <div className='border-bottom row pb-2 fw-bold'>
            <div className='col d-flex align-items-center'>Amount</div>
            <div className='col d-flex align-items-center'>From currency</div>
            <div className='col d-flex align-items-center'>To currency</div>
            <div className='col d-flex align-items-center'>Actions</div>
          </div>
          {history.map(historyRecord => (
            <div key={historyRecord.key} className='border-bottom row py-1'>
              <div className='col d-flex align-items-center'>{historyRecord.amount} / {historyRecord.conversionResult}</div>
              <div className='col d-flex align-items-center'>{historyRecord.fromCurrency}</div>
              <div className='col d-flex align-items-center'>{historyRecord.toCurrency}</div>
              <div className='col d-flex align-items-center'>
                <button
                  className="btn btn-danger"
                  onClick={() => dispatchHistory({ type: 'removeItem', key: historyRecord.key })}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-danger"
          onClick={() => dispatchHistory({ type: 'clear' })}
        >
          Clear history
        </button>
      </div>
    </div>
  );
}

export default App;
