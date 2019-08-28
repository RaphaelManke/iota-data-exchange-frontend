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
                    :to="{ name: 'recieverDetails', params: { recieverId: getRecieverByPubKeyAddress(sub.peer) }}"
                  >{{getRecieverByPubKeyAddress(sub.peer)}}</b-link>
                  <br />
                  Start: {{sub.startDate}}
                  <br />
                  End: {{sub.endDate}}
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
@Component({
  components: {},
  props: {
    ownerId: String,
  },
})
export default class OwnerDetails extends Vue {
  @Owner.Action('acceptRequest') acceptRequest!: any;
  @Owner.Action('checkRequestAddress') checkRequestAddress!: any;
  @Owner.Getter('getOwnerById') getOwnerByID!: any;
  @Owner.Getter('getRecieverByPubKeyAddress') getRecieverByPubKeyAddress!: any;
  arrLength(elem: any) {
    return elem.lenght;
  }
  get subscriptionList() {
    return this.owner.data.subMan.requests.map(e => {
      return {
        id: e[0],
        peer: e[1].pubKeyAddress,
        startDate: Object.setPrototypeOf(e[1].startDate, DateTag.prototype),
        endDate: Object.setPrototypeOf(e[1].endDate, DateTag.prototype),
      };
    });
  }
  get owner(): DataOwner {
    return this.getOwnerByID(this.$props.ownerId);
  }
  mounted() {}
}
</script>
