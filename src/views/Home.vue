<template>
  <div class="home">
    {{api}}
    {{ dataPub ? dataPub : 'undefined'}}
    <AddDataPublisher />
    <ShowCurrentPublisher />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import AddDataPublisher from '@/components/AddDataPublisher.vue'; // @ is an alias to /src
import ShowCurrentPublisher from '@/components/ShowCurrentPublisher.vue'; // @ is an alias to /src
import { DataPublisher } from '@/lib/';
import { defaultSeed, defaultSeedPublisher } from '../lib/config';
import DateTag from '../lib/DateTag';
import { ntru } from 'ntru';
import axios from 'axios';
import { threadId } from 'worker_threads';

@Component({
  components: {
    HelloWorld,
    AddDataPublisher,
    ShowCurrentPublisher,
  },
})
export default class Home extends Vue {
  pub: DataPublisher | string = 'undefined';
  bla = 'ABC';
  get dataPub() {
    return this.pub !== undefined ? this.pub : 'undefined';
  }
  get api() {
    return process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'no api';
  }

  mounted() {}
}
</script>
