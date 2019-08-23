<template>
  <b-container>
    <b-table :items="getPublisher" :fields="fields">
      <template slot="state" slot-scope="row">{{row.item[1].state}}</template>
      <template slot="id" slot-scope="row">{{row.item[0]}}</template>
    </b-table>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Publisher } from '@/namespaces';
@Component({
  components: {},
})
export default class Home extends Vue {
  @Publisher.Getter('getPublisher') getPublisher: any;
  @Publisher.Action('fetchPublisher') fetchPublisher: any;
  fields = [{ key: 'id' }, { key: 'state' }];
  async mounted() {
    await this.fetchPublisher();
  }
}
</script>
