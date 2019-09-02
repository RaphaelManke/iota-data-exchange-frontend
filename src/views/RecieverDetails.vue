<template>
  <b-container>
    <h1>Data Reciever - {{recieverId}}</h1>

    <b-card>
      <b-card-header>
        <h4>Properties</h4>
      </b-card-header>
      <b-card-body>
        <b-row>
          <b-col sm="2">ID</b-col>
          <b-col sm="8">{{reciever.id}}</b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">Requests</b-col>
          <b-col sm="8">
            <b-button v-b-toggle="'collapse-requests'" class="m-1">show requests</b-button>
            <b-button
              @click="info(reciever.id, reciever.id, $event.target)"
              class="mr-1"
            >Request Access</b-button>
            <b-collapse id="collapse-requests">
              <b-card>
                <b-list-group>
                  <b-list-group-item>
                    <h3>Open Requests</h3>
                    <b-list-group>
                      <b-list-group-item v-for="item in openRequests">
                        Peer:
                        <b-link
                          :to="{ name: 'ownerDetails', params: { ownerId: getPeerByAddress(item.peerAddress) }}"
                        >{{getPeerByAddress(item.peerAddress)}}</b-link>
                        <br />
                        Start: {{item.msg.startDate}}
                        <br />
                        End: {{item.msg.endDate}}
                        <br />
                        NextAddress: {{item.msg.nextAddress}}
                      </b-list-group-item>
                    </b-list-group>
                  </b-list-group-item>
                  <b-list-group-item>
                    <h3>Active Requests</h3>
                    <b-list-group>
                      <b-list-group-item v-for="item in activeRequests">
                        StartRoot: {{item.startRoot}}
                        <br />
                        StartDate: {{item.startDate.year}}-{{item.startDate.month}}-{{item.startDate.day}}
                        <br />
                        EndDate: {{item.endDate.year}}-{{item.endDate.month}}-{{item.endDate.day}}
                        <br />
                      </b-list-group-item>
                    </b-list-group>
                  </b-list-group-item>
                  <b-list-group-item>
                    <h3>Closed Requests</h3>
                    <b-list-group>
                      <b-list-group-item
                        v-for="item in closedRequests"
                      >{{item.msg.startDate}} - {{item.msg.endDate}}</b-list-group-item>
                    </b-list-group>
                  </b-list-group-item>
                </b-list-group>
              </b-card>
            </b-collapse>
          </b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">Seed</b-col>
          <b-col sm="8">{{reciever.data.seed}}</b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">Public Key Address</b-col>
          <b-col sm="8">{{reciever.data.pubKeyAddress}}</b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col sm="2">HashStore</b-col>
          <b-col sm="8">
            <b-button v-b-toggle="'collapse-hashstore'" class="m-1">show hashstore</b-button>

            <b-collapse id="collapse-hashstore">
              <b-card>
                <b-list-group>
                  <b-list-group-item v-for="item in hashStore">
                    Prefix: {{item.prefix}}
                    <br />
                    Hash: {{item.hash}}
                  </b-list-group-item>
                </b-list-group>
              </b-card>
            </b-collapse>
          </b-col>
        </b-row>
        <hr />

        <b-row>
          <b-col sm="2">Actions</b-col>
          <b-col sm="8">
            <b-button @click="checkOpenRequests(reciever.id)">Check Open Requests</b-button>
          </b-col>
        </b-row>
        <hr />

        <b-row>
          <b-col sm="2">Data Connections</b-col>
          <b-col sm="8">
            <b-list-group>
              <b-list-group-item v-for="item in dataConnectors" :key="item[0]">
                {{item[0]}}
                <br />
                <b-button @click="fetchMessages(item[0])" class="m-1">fetch messages</b-button>
                <b-button v-b-toggle="`collapse-${item[0]}`" class="m-1">show messages</b-button>

                <b-collapse :id="`collapse-${item[0]}`">
                  <b-card>
                    <b-list-group>
                      <b-list-group-item
                        v-for="message in item[1].decryptedMessages"
                        :key="message[0]"
                      >
                        Root: {{message[0]}}
                        <br />Message:
                        <span style="text-align:left">
                          <vue-json-pretty :deep="4" :data="jsonFormat(message[1])"></vue-json-pretty>
                        </span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-card>
                </b-collapse>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <AddRecieverRequest :recieverId="infoModal.recieverId" />
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AddRecieverRequest from '@/components/AddRecieverRequest.vue';
import { DataPublisher, DataReciever } from '@/lib/';
import { Reciever } from '@/namespaces';
import { any } from 'bluebird';
import { returnType } from '@iota/core/typings/core/src/composeAPI';
import DateTag from '../lib/DateTag';
// @ts-ignore
import VueJsonPretty from 'vue-json-pretty';
@Component({
  components: {
    AddRecieverRequest,
    VueJsonPretty,
  },
  props: {
    recieverId: String,
  },
})
export default class RecieverDetails extends Vue {
  @Reciever.Action('checkOpenRequests') checkOpenRequests!: any;
  @Reciever.Action('fetchMessages') fetchMessagesAction!: any;
  @Reciever.Getter('getRecieverById') getRecieverByID!: any;
  @Reciever.Getter('getPeerByAddress') getPeerByAddress!: any;

  infoModal = {
    id: 'info-modal',
    title: '',
    recieverId: '',
  };
  info(recieverId: any, index: any, button: any) {
    this.infoModal.title = `Add Request for: ${index}`;
    this.infoModal.recieverId = recieverId;
    this.$root.$emit('bv::show::modal', this.infoModal.id, button);
  }
  resetInfoModal() {
    this.infoModal.title = '';
    this.infoModal.recieverId = '';
  }
  fetchMessages(connId: string) {
    const payload = {
      id: this.$props.recieverId,
      connId,
    };
    console.info(payload);
    this.fetchMessagesAction(payload);
  }
  jsonFormat(s: string) {
    try {
      const parsed = JSON.parse(s);
      return parsed;
    } catch (error) {
      return { text: s };
    }
  }
  get dataConnectors() {
    try {
      return this.reciever.data.dataConnectors;
    } catch (error) {
      return [];
    }
  }
  get hashStore() {
    try {
      return this.reciever.data.hashStore.hashList;
    } catch (error) {
      return [];
    }
  }
  get openRequests() {
    try {
      const data = this.reciever.data.requests.open.map(item => {
        Object.setPrototypeOf(item.msg.startDate, DateTag.prototype);
        Object.setPrototypeOf(item.msg.endDate, DateTag.prototype);
        return item;
      });
      return data;
    } catch (error) {
      return [];
    }
  }
  get activeRequests() {
    try {
      const data = this.reciever.data.requests.active.map(item => {
        return item;
      });
      return data;
    } catch (error) {
      return [];
    }
  }
  get closedRequests() {
    try {
      const data = this.reciever.data.requests.closed.map(item => {
        Object.setPrototypeOf(item.msg.startDate, DateTag.prototype);
        Object.setPrototypeOf(item.msg.endDate, DateTag.prototype);
        return item;
      });
      return data;
    } catch (error) {
      return [];
    }
  }
  get reciever(): DataReciever {
    return this.getRecieverByID(this.$props.recieverId);
  }
  mounted() {}
}
</script>
