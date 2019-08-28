<template>
  <b-container>
    <b-table :v-if="ready" :items="getPublisher" :fields="fields">
      <template slot="state" slot-scope="row">
        <b-badge v-if="row.item.state">running</b-badge>
        {{ isPublishing(row.item.id)}}
      </template>
      <template slot="actions" slot-scope="row">
        <b-button variant="success" @click="startPublish(row.item.id)">Start</b-button>
        <b-button variant="danger" @click="stopPublish(row.item.id)">Stop</b-button>
      </template>
      <template slot="id" slot-scope="row">{{row.item.id}}</template>
      <template slot="messages" slot-scope="row">
        <b-button
          size="sm"
          @click="info(row.item.data.messages, row.index, $event.target)"
          class="mr-1"
        >
          Info modal
          {{ row.item.data.messages.length}}
        </b-button>
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
import { Publisher } from '@/namespaces';
import { State } from 'vuex-class';
import { publicDecrypt } from 'crypto';
import { PublisherState } from '../store/publisher/types';
@Component({
  components: {},
})
export default class Home extends Vue {
  @State('publisher') pubState!: PublisherState;
  @Publisher.Getter('getPublisher') getPublisher: any;
  @Publisher.Getter('isPublishing') isPublishing: any;
  @Publisher.Getter('numberOfPublishedMessages') numberOfPublishedMessages: any;
  @Publisher.Action('fetchPublisher') fetchPublisher: any;
  @Publisher.Action('startPublish') startPublish: any;
  @Publisher.Action('stopPublish') stopPublish: any;
  fields = [
    { key: 'id' },
    { key: 'state', label: 'publishing' },
    { key: 'actions' },
    { key: 'messages' },
  ];
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
    this.fetchPublisher()
      .then(() => {
        this.ready = true;
      })
      .catch(err => console.error(err));
  }
}
</script>
