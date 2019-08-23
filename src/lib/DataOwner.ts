import { MamReader } from 'mam.ts/typings/src';
import DataPublishConnector from './DataPublishConnector';
import SubscriptionManager from './SubscriptionManager';

export class DataOwner {
  private subMan!: SubscriptionManager;
  private seed: string;
  private dataConnectors: Map<string, DataPublishConnector>;
  constructor({masterSecret, seed ,subscriptionRequestAddress}:{masterSecret:string, seed:string, subscriptionRequestAddress:string}){
    this.dataConnectors = new Map();
    this.seed = seed;
    this.subMan = new SubscriptionManager({
      masterSecret,
      seed,
      subscriptionRequestAddress,
    });

  }
  /**
   * init
   */
  public async init() {
    const subManinit = await this.subMan.init();
  }
  /**
   * addDataConnector
   */
  public addDataConnector({
    conn,
    id,
  }: {
    conn: DataPublishConnector;
    id: string;
  }) {
    this.dataConnectors.set(id, conn);
  }
  /**
   * getSubscriptionRequestAddress
   */
  public getSubscriptionRequestAddress(): string {
    return this.subMan.getSubscriptionRequestAddress();
  }
  /**
   * getPubKey
   */
  public getPubKey() {
    const key =this.subMan.getPubKey()
    if(key){

      return key.toString();
    } else{
      throw Error('no PubKey found')
    }
  }
  /**
   * getAccessRequests
   */
  public async getAccessRequests() {
    return this.subMan.fetchSubscriptionRequests();
  }
  /**
   * acceptAccessRequest
   */
  public async acceptAccessRequest(request: string) {
    return this.subMan.acceptRequest(request);
  }
}

interface IInitDataOwner {
  seed: string;
  masterSecret: string;
  subscriptionRequestAddress?: string;
}
