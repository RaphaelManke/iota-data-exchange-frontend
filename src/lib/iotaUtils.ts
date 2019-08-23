import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import { API, Transfer } from '@iota/core/typings/core/src';
import { Trytes } from '@iota/core/typings/types';
import { Bundle, Transaction } from '@iota/http-client/typings/types';
import { AES, enc } from 'crypto-js';
import { defaultDepth, defaultMwm } from './config';
import DateTag from './DateTag';
import { IHashItem } from '@/lib/typings/HashStore';
import { IRequestMsg } from '@/lib/typings/messages/WelcomeMsg';

export function generateSeed(length = 81) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
  const retVal = [];
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal[i] = charset.charAt(Math.floor(Math.random() * n));
  }
  const result = retVal.join('');
  return result;
}

export async function sentMsgToTangle(
  iota: API,
  seed: string,
  address: string,
  message: Trytes,
  tag: string,
  depth: number = defaultDepth,
  mwm: number = defaultMwm
): Promise<Bundle> {
  const transfers: Transfer[] = [
    {
      address,
      message,
      tag,
      value: 0,
    },
  ];
  try {
    const prepTransfersTrytes = await iota.prepareTransfers(seed, transfers);
    const attachedBundle: Bundle = await iota.sendTrytes(
      prepTransfersTrytes,
      depth /*depth*/,
      mwm /*MWM*/
    );
    return attachedBundle;
  } catch (error) {
    throw error;
  }
}

export async function getPubKeyFromTangle({
  iota,
  address,
}: {
  iota: API;
  address: string;
}) {
  if (address.length === 81) {
    const trans: readonly Transaction[] = await iota.findTransactionObjects({
      bundles: [address],
    });
    return extractSignatureFragments(trans);
  } else {
    return address;
  }
}

export interface IParsedRequestMessage {
  msg: IRequestMsg;
  bundle: string;
}
export interface IParsedWelcomeMessage {
  msg: IHashItem[];
  bundle: string;
}

export function extractSignatureFragments(bund: Bundle) {
  const sigFrag = bund
    .slice()
    .sort((a, b) => a.currentIndex - b.currentIndex)
    .map(t => t.signatureMessageFragment)
    .reduce((a, b) => a + b);
  return sigFrag;
}
