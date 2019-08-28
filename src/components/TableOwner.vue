<template>
  <b-container>
    <b-table :v-if="ready" :items="getOwner" :fields="fields">
      <template slot="id" slot-scope="row">{{row.item.id}}</template>
      <template slot="details" slot-scope="row">
        <b-button :to="{ name: 'ownerDetails', params: { ownerId: row.item.id }}">Details</b-button>
      </template>
    </b-table>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Owner } from '@/namespaces';
import { State } from 'vuex-class';
import { publicDecrypt } from 'crypto';
import { RecieverState } from '../store/reciever/types';
@Component({
  components: {},
})
export default class TableOwner extends Vue {
  @Owner.Getter('getOwner') getOwner: any;
  @Owner.Action('fetchOwner') fetchOwner: any;
  fields = [{ key: 'id' }, { key: 'details' }];
  ready = false;

  mounted() {
    this.fetchOwner()
      .then(() => {
        this.ready = true;
      })
      .catch(err => console.error(err));
  }
}
</script>
