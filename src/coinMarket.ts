import axios from "axios";

const API_KEY = "8136b43a-cee0-4ac7-a4eb-9ca13115522b";
const API_ENDPOINT = "https://pro-api.coinmarketcap.com";

type Currency = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  rank: number;
  is_active: number;
  first_historical_data: string;
  last_historical_data: string;
  platform: null | {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  };
};

type GetCurrencyPriceResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: {
    [key: string]: {
      id: number;
      name: string;
      symbol: string;
      slug: string;
      num_market_pairs: number;
      date_added: string;
      tags: string[];
      max_supply: number;
      circulating_supply: number;
      total_supply: number;
      platform: null | {
        id: number;
        name: string;
        symbol: string;
        slug: string;
        token_address: string;
      };
      cmc_rank: number;
      last_updated: string;
      quote: {
        USD: {
          price: number;
          volume_24h: number;
          percent_change_1h: number;
          percent_change_24h: number;
          percent_change_7d: number;
          market_cap: number;
          last_updated: string;
        };
      };
    };
  };
};

type GetCurrenciesResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: Currency[];
};

const axiosInstance = axios.create({
  headers: {
    "X-CMC_PRO_API_KEY": API_KEY,
  },
});

async function getEthCurrencies(): Promise<Currency[]> {
  const response = await axiosInstance.get<GetCurrenciesResponse>(
    `${API_ENDPOINT}/v1/cryptocurrency/map`
  );

  const output = response.data.data;

  return output.filter(
    (value) => value.platform && value.platform.symbol === "ETH"
  );
}

async function getLatestPrice(external_id: number) {
  const response = await axiosInstance.get<GetCurrencyPriceResponse>(
    `${API_ENDPOINT}/v2/cryptocurrency/quotes/latest`,
    {
      params: {
        id: external_id,
      },
    }
  );

  console.log(response.data.data[external_id.toString()]);
}
export { getEthCurrencies, getLatestPrice };
