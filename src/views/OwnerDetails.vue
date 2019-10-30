<template>
  <b-container>
    <h1>Data Owner - {{ownerId}}</h1>

    <b-card>
      <b-card-header>
        <h4>Properties</h4>
      </b-card-header>
      <b-card-body>
        <b-row>
          <b-col sm="2">ID</b-col>
          <b-col sm="8">{{owner.id}}</b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">Seed</b-col>
          <b-col sm="8">{{owner.data.seed}}</b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">Subscription Address</b-col>
          <b-col sm="8">{{owner.data.subMan.subscriptionRequestAddress}}</b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">SubscriptionStore</b-col>
          <b-col sm="8">
            <b-button v-b-toggle="'collapse-hashstore'" class="m-1">show hashstore</b-button>

            <b-collapse id="collapse-hashstore">
              <b-card>{{owner.data.subMan.subscriptionStore}}</b-card>
            </b-collapse>
          </b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">Requests</b-col>
          <b-col sm="8">
            <b-button v-b-toggle="'collapse-requests'" class="m-1">show requests</b-button>

            <b-collapse id="collapse-requests">
              <b-list-group>
                <b-list-group-item v-for="sub in subscriptionList" v-bind:key="sub.id">
                  ID: {{sub.id}}
                  <br />Peer:
                  <b-link
                    v-if="getRecieverByPubKeyAddress(sub.peer)"
                    :to="{ name: 'recieverDetails', params: { recieverId: getRecieverByPubKeyAddress(sub.peer) }}"
                  >{{getRecieverByPubKeyAddress(sub.peer)}}</b-link>
                  <span v-else>UNKOWN</span>
                  <br />
                  Start: {{sub.startDate}}
                  <br />
                  End: {{sub.endDate}}
                  <br />
                  NextAddress: {{sub.nextAddress}}
                  <br />
                  <b-button
                    @click="acceptRequest({ownerId:owner.id, requestId:sub.id})"
                  >accept Request</b-button>
                </b-list-group-item>
              </b-list-group>
            </b-collapse>
          </b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">Aktions</b-col>
          <b-col sm="8">
            <b-button @click="checkRequestAddress(owner.id)">check Requests</b-button>
            <b-button @click="getNextMessage(owner.id)">getNextMessage</b-button>
          </b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">Messages</b-col>
          <b-col sm="8">
            <b-row>
              <b-col sm="4">
                <b-button v-b-toggle="'collapse-messages'" class="m-1">show messages</b-button>
                <b-button @click="fetchMessages">fetchMessages</b-button>
              </b-col>
              <b-col sm="4">
                <b-form-group id="peer" description="Select the Owner">
                  <b-form-select
                    id="input-peer"
                    v-model="selectedPublisher"
                    :options="publisherList"
                    required
                    placeholder="Select a Publisher"
                  ></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-collapse id="collapse-messages">
              <b-list-group>
                <b-list-group-item v-for="msg in messages" v-bind:key="msg[0]">
                  NextRoot: {{msg[0]}}
                  <br />Message:
                  <span style="text-align:left">
                    <vue-json-pretty :deep="4" :data="jsonFormat(msg[1])"></vue-json-pretty>
                  </span>
                </b-list-group-item>
              </b-list-group>
            </b-collapse>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DataPublisher, DataReciever, DataOwner } from '@/lib/';
import { Owner } from '@/namespaces';
import { any } from 'bluebird';
import DateTag from '../lib/DateTag';
// @ts-ignore
import VueJsonPretty from 'vue-json-pretty';

@Component({
  components: {
    VueJsonPretty,
  },
  props: {
    ownerId: String,
  },
})
export default class OwnerDetails extends Vue {
  @Owner.Action('acceptRequest') acceptRequest!: any;
  @Owner.Action('getNextMessage') getNextMessage!: any;
  @Owner.Action('fetchMessages') fetchMessagesAction!: any;
  @Owner.Action('checkRequestAddress') checkRequestAddress!: any;
  @Owner.Getter('getOwnerById') getOwnerByID!: any;
  @Owner.Getter('getRecieverByPubKeyAddress') getRecieverByPubKeyAddress!: any;
  selectedPublisher = '';
  fetchMessages() {
    const payload = {
      ownerId: this.$props.ownerId,
      pubId: this.selectedPublisher,
    };
    this.fetchMessagesAction(payload);
  }
  arrLength(elem: any) {
    return elem.lenght;
  }
  jsonFormat(s: string) {
    try {
      const parsed = JSON.parse(s);
      return parsed;
    } catch (error) {
      return { text: s };
    }
  }

  get subscriptionList() {
    return this.owner.data.subMan.accessRequests.map(e => {
      return {
        id: e[0],
        peer: e[1].pubKeyAddress,
        nextAddress: e[1].nextAddress,
        startDate: Object.setPrototypeOf(e[1].startDate, DateTag.prototype),
        endDate: Object.setPrototypeOf(e[1].endDate, DateTag.prototype),
      };
    });
  }
  get messages() {
    const connector = this.owner.data.dataConnectors.find(
      e => e[0] === this.selectedPublisher
    );
    if (connector) {
      return connector[1].decryptedMessages;
    } else return [];
  }
  get publisherList() {
    return this.owner.data.dataConnectors.map(e => e[0]);
  }
  get owner(): DataOwner {
    return this.getOwnerByID(this.$props.ownerId);
  }
  mounted() {}
}
</script>
