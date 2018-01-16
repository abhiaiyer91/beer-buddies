import { isNumber } from 'lodash';

const asyncRedis = require("async-redis");

const client = asyncRedis.createClient();

export async function getBeerCount(beer) {
  const result = await client.hmget('beers', beer);
  return isNumber(result) ? result : 0;
}

export async function getBeerCounts() {
  const result = await client.hgetall('beers');
  return result;
}

export async function incrementBeerCount(beer) {
  const result = await client.hincrby('beers', beer, 1);
  return isNumber(result) ? result : 0;
}

export async function decrementBeerCount(beer) {
  const result = await client.hincrby('beers', beer, -1);
  return isNumber(result) ? result : 0;
}
