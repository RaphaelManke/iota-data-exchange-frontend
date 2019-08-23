import { API, composeAPI } from '@iota/core';
import { MAM_MODE, MAM_SECURITY } from 'mam.ts';
import { defaultDepth, defaultMwm, defaultNodeAddress } from './config';
import DateTag from './DateTag';
import { hashFromDatetag } from './hashingTree';
import { generateSeed } from './iotaUtils';
import { MamWriter } from '@/lib/mam';

export  class DataPublisher {
  private initialized: boolean = false;
;
  private seed: string ;
  private masterSecret: string ;
  private mamMode = MAM_MODE.RESTRICTED;
  private securitsLevel: MAM_SECURITY;
  private writer!: MamWriter;
  constructor({
    masterSecret,
    seed,
    securityLevel = MAM_SECURITY.LEVEL_1,
  }: {
    masterSecret: string;
    seed: string;
    securityLevel?: MAM_SECURITY;
  }) {    this.seed = seed ? seed : generateSeed();
    this.masterSecret = masterSecret;
    this.securitsLevel = securityLevel;
}
  /**
   * init
   */
  public async init(initialSideKey:string='unsecure') {

    this.writer = new MamWriter(
      defaultNodeAddress,
      this.seed,
      this.mamMode,
      initialSideKey,
      this.securitsLevel
    );
    await this.writer.catchUpThroughNetwork();
    this.initialized = true;
  }
  /**
   * getNextRoot
   */
  public getNextRoot() {
    return this.writer.getNextRoot();
  }
  /**
   * run
   */
  public run(interval: number) {
    return setInterval(async () => {
      const txs = await this.sentMessage(new Date().toTimeString());
      console.log(`Message published at ${txs[0].address}`);
    }, interval);
  }
  /**
   * sentMessage
   */
  public async sentMessage(msg: string) {
    if (!this.initialized) {
      throw new Error('not initilized! run init() first');
    }
    const date = new Date();
    const dateTag = new DateTag(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    const tag = dateTag.toTrytes();
    this.writer.setTag(tag);
    const sideKey = hashFromDatetag(this.masterSecret, dateTag);
    this.writer.changeMode(this.mamMode, sideKey);
    const mamMsg: {
      payload: string;
      root: string;
      address: string;
    } = await this.writer.create(msg);
    const attachedMsg = await this.writer.attach(
      mamMsg.payload,
      mamMsg.address,
      defaultDepth,
      defaultMwm
    );
    return attachedMsg;
  }
}
