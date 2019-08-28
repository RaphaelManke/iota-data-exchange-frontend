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
          <b-col sm="8">{{owner.data.subMan.requests}}</b-col>
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
@Component({
  components: {},
  props: {
    ownerId: String,
  },
})
export default class OwnerDetails extends Vue {
  @Owner.Getter('getOwnerById') getOwnerByID!: any;
  @Owner.Action('checkRequestAddress') checkRequestAddress!: any;
  arrLength(elem: any) {
    return elem.lenght;
  }
  get owner(): DataOwner {
    return this.getOwnerByID(this.$props.ownerId);
  }
  mounted() {}
}
</script>
