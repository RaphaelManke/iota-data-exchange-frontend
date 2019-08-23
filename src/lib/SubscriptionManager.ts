import { createKeyPair, KeyPair } from '@decentralized-auth/ntru';
import * as ntru from '@decentralized-auth/ntru';
import { asciiToTrytes, trits, trytes } from '@iota/converter';
import { API, composeAPI, Transaction } from '@iota/core';
import { Trytes } from '@iota/core/typings/types';
import { AES } from 'crypto-js';
import { defaultNodeAddress } from './config';
import DateTag from './DateTag';
import { hashCurl, hashFromBinStr } from './hashingTree';
import { groupBy } from './helpers';
import {
  generateSeed,
  getPubKeyFromTangle,
  IParsedRequestMessage,
  parseRequestMessage,
  sentMsgToTangle,
} from './iotaUtils';
import { ISubscription } from './SubscriptionStore';
import { getNodesBetween } from './treeCalculation';
import { IHashItem } from '@/lib/typings/HashStore';
import { IRequestMsg } from '@/lib/typings/messages/WelcomeMsg';
import { strict } from 'assert';
export default class SubscriptionManager {
  public iota: API;
  public subscriptionRequestAddress: string;
  private keyPair!: KeyPair;
  private seed: string;
  private masterSecret: string;
  private requests: Map<string, IRequestMsg>;
  private subscriptionStore: Map<string, ISubscription>;
  constructor({
    masterSecret,
    keyPair,
    seed,
    subscriptionRequestAddress,
  }: {
    masterSecret: string;
    keyPair?: KeyPair;
    seed?: string;
    subscriptionRequestAddress?: string;
  }) {
    this.subscriptionStore = new Map();
    this.requests = new Map();
    this.masterSecret = masterSecret;
    if (keyPair) {
      this.keyPair = keyPair;
    }
    if (!seed) {
      this.seed = generateSeed();
    } else {
      this.seed = seed;
    }
    this.subscriptionRequestAddress = subscriptionRequestAddress
      ? subscriptionRequestAddress
      : trytes(hashCurl(trits(this.seed), trits('REQUESTADDRESS')));
      this.iota = composeAPI({
        provider: defaultNodeAddress,
      });
  }
  /**
   * init
   */
  public async init() {
    if (this.keyPair !== undefined) {
      throw Error('Keypair already set');
    }
    this.keyPair = await createKeyPair(this.seed);
  }

  /**
   * connectToTangle
   */
  public connectToTangle() {
    this.iota = composeAPI({
      provider: defaultNodeAddress,
    });
  }
  /**
   * getPubKey
   */
  public getPubKey(asTrytes = true): string | Uint8Array | undefined {
    try {
      return asTrytes
        ? ntru.toTrytes(this.keyPair.public)
        : this.keyPair.public;
    } catch {
      return undefined;
    }
  }
  /**
   * fetchSubscriptionRequests
   */
  public async fetchSubscriptionRequests(): Promise<IParsedRequestMessage[]> {
    const transactions: readonly Transaction[] = await this.iota.findTransactionObjects({
      addresses: [this.subscriptionRequestAddress],
    });
    // make sure only zero value transactions are pproccessed
    const zeroValTrans = transactions.filter(t => t.value === 0);
    const groupedBundles: TTransactionMap = groupBy(
      zeroValTrans,
      (t:Transaction) => t.bundle
    );

    const messages = await this.decryptRequestBundel(groupedBundles);
    return messages;
  }
  /**
   * getSubscriptionRequestAddress
   */
  public getSubscriptionRequestAddress(): string {
    return this.subscriptionRequestAddress;
  }
  /**
   * decryptRequestBundels
   */
  public async decryptRequestBundel(
    bundle: TTransactionMap
  ): Promise<IParsedRequestMessage[]> {
    let promises: Array<Promise<IParsedRequestMessage>> = [];
    bundle.forEach((v) => {
      const prom = parseRequestMessage(v, this.keyPair.private);
      promises = [...promises, prom];
    });
    const results = await Promise.all(promises);

    results.forEach(v => this.requests.set(v.bundle, v.msg));
    return results;
  }
  /**
   * sentRequestAcceptMsg
   */
  public async sentRequestAcceptMsg(sub: ISubscription) {
    const hashList = this.getNodeHashesForDaterange(sub.startDate, sub.endDate);
    const hashListJson = JSON.stringify(hashList);

    // encrypt the symetric key of the data with the pubKey
    // FIXME make secret changeable
    const secret = 'SomeSecret';
    const address = sub.responseAddress;
    const hashListEnc = AES.encrypt(hashListJson, secret).toString();
    const hashListTrytes = asciiToTrytes(hashListEnc);
    const recieverPubKey = await getPubKeyFromTangle({
      address: sub.pubKey,
      iota: this.iota,
    });
    const secretEnc: Trytes = ntru.encrypt(secret, recieverPubKey);
    const msgTrytes = secretEnc + hashListTrytes;
    const tag = `${secretEnc.length.toString()}-${hashListTrytes.length.toString()}`;
    const msg = await sentMsgToTangle(
      this.iota,
      this.seed,
      address!,
      msgTrytes,
      asciiToTrytes(tag)
    );
    return msg;
  }
  /**
   * acceptRequest
   */
  public async acceptRequest(requestBundleHash: string) {
   const element = this.requests.get(requestBundleHash);
   if(element){
    const {
      dataType,
      nextAddress,
      endDate,
      pubKeyAddress,
      startDate,
    } = element
    const sub: ISubscription = {
      dataType,
      endDate,
      pubKey: pubKeyAddress,
      responseAddress: nextAddress,
      startDate,
    };

    this.subscriptionStore.set(requestBundleHash, sub);
    return sub;
   }else{
     throw Error('request not found')
   }
  }
  private getNodeHashesForDaterange(s: DateTag, e: DateTag) {
    const dateRangePaths = getNodesBetween(s, e);
    if(dateRangePaths){

      const hashList: IHashItem[] = dateRangePaths.map((p:string) => {
        return {
          hash: hashFromBinStr(this.masterSecret, p),
          prefix: p,
        };
      });
      return hashList;
    }
  }
}

type TTransactionMap = Map<string, Transaction[]>;
