<template>
  <div class="home">
    <h2>Data publisher</h2>
    <ShowCurrentPublisher />
    <h2>Data owner</h2>
    <TableOwner />
    <h2>Data reciever</h2>
    <TableReciever />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ShowCurrentPublisher from '@/components/ShowCurrentPublisher.vue'; // @ is an alias to /src
import TableOwner from '@/components/TableOwner.vue'; // @ is an alias to /src
import TableReciever from '@/components/TableReciever.vue'; // @ is an alias to /src
import { DataPublisher } from '@/lib/';
import { defaultSeed, defaultSeedPublisher } from '../lib/config';
import DateTag from '../lib/DateTag';
import { ntru } from 'ntru';
import axios from 'axios';
import { threadId } from 'worker_threads';

@Component({
  components: {
    ShowCurrentPublisher,
    TableOwner,
    TableReciever,
  },
})
export default class Home extends Vue {
  mounted() {}
}
</script>
