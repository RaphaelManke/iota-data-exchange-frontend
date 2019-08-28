<template>
  <b-container>
    <h1>Data Reciever</h1>
    <TableReciever />
    <AddDataReciever></AddDataReciever>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DataPublisher } from '@/lib/';
import AddDataReciever from '@/components/AddDataReciever.vue';
import TableReciever from '@/components/TableReciever.vue';

@Component({
  components: {
    AddDataReciever,
    TableReciever,
  },
})
export default class Reciever extends Vue {
  mounted() {}
}
</script>
