<template>
  <b-container>
    <b-table :v-if="ready" :items="getPublisher" :fields="fields">
      <template slot="id" slot-scope="row">{{row.item.id}}</template>
      <template slot="details" slot-scope="row">
        <b-button :to="{ name: 'recieverDetails', params: { recieverId: row.item.id }}">Details</b-button>
      </template>
    </b-table>
    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre> 

        {{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Reciever } from '@/namespaces';
import { State } from 'vuex-class';
import { publicDecrypt } from 'crypto';
import { RecieverState } from '../store/reciever/types';
@Component({
  components: {},
})
export default class TableReciever extends Vue {
  @Reciever.Getter('getReciever') getPublisher: any;
  @Reciever.Action('fetchReciever') fetchReciever: any;
  fields = [{ key: 'id' }, { key: 'details' }];
  ready = false;
  infoModal = {
    id: 'info-modal',
    title: '',
    content: '',
  };
  info(item: any, index: any, button: any) {
    this.infoModal.title = `Row index: ${index}`;
    this.infoModal.content = item;
    this.$root.$emit('bv::show::modal', this.infoModal.id, button);
  }
  resetInfoModal() {
    this.infoModal.title = '';
    this.infoModal.content = '';
  }
  mounted() {
    this.fetchReciever()
      .then(() => {
        this.ready = true;
      })
      .catch(err => console.error(err));
  }
}
</script>
