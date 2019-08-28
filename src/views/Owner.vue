<template>
  <b-container>
    <h1>Data Owner</h1>
    <TableOwner />
    <AddDataOwner></AddDataOwner>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DataPublisher } from '@/lib/';
import AddDataOwner from '@/components/AddDataOwner.vue'; // @ is an alias to /src
import TableOwner from '@/components/TableOwner.vue'; // @ is an alias to /src

@Component({
  components: {
    AddDataOwner,
    TableOwner,
  },
})
export default class Owner extends Vue {
  mounted() {}
}
</script>
