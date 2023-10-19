import Moralis from 'moralis';
import config from '../config';

export interface RequestMessage {
  address: string;
  chain: string;
  networkType: string;
}

const STATEMENT = 'Welcome to nenesty, Please sign this message to confirm your identity.';
const EXPIRATION_TIME = 9000000;
const TIMEOUT = 15;

export async function requestMessage({
  address,
  chain,
  networkType,
}: {
  address: string;
  chain: string;
  networkType: 'evm';
}) {
  const url = new URL(config.SERVER_URL_AUTH);
  const urltoString = url?.toString()
  const now = new Date();
  const expirationTime = new Date(now.getTime() + EXPIRATION_TIME);

  const result = await Moralis.Auth.requestMessage({
    address,
    chain,
    networkType,
    domain: url.hostname,
    uri: urltoString,
    statement: STATEMENT,
    notBefore: now.toISOString(),
    expirationTime: expirationTime.toISOString(),
    timeout: TIMEOUT,
  });

  const { message } = result.toJSON();

  return message;
}