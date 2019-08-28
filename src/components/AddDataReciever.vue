<template>
  <b-container>
    <h1>Hello</h1>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-row>
        <b-col sm="10">
          <b-form-group id="seed" description="The seed of the publisher">
            <b-form-input
              id="input-seed"
              v-model="form.seed"
              type="text"
              required
              placeholder="Enter seed"
              :state="validateSeed"
            ></b-form-input>
            <b-form-invalid-feedback :state="validateSeed">Your seed must be 81 characters long.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validateSeed">Looks Good.</b-form-valid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="2">
          <b-button @click="generateSeed" variant="primary">new</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="10">
          <b-form-group id="id">
            <b-form-input
              id="input-id"
              v-model="form.id"
              required
              placeholder="Enter Reciever ID"
              :state="validatePubId"
            ></b-form-input>
            <b-form-invalid-feedback
              :state="!publisherExists"
            >A Reciever ID is required or your Reciever ID is already taken..</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validatePubId">Looks Good.</b-form-valid-feedback>
          </b-form-group>
        </b-col>
      </b-row>

      <b-button :active="formValid" type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { isAddress } from '@iota/validators';
import { State, Action, Getter } from 'vuex-class';
import { generateSeed } from '../lib/iotaUtils';
import { threadId } from 'worker_threads';
import Axios from 'axios';
import { Reciever } from '@/namespaces';

@Component({
  components: {},
})
export default class AddDataReciever extends Vue {
  @Reciever.Action('addReciever') addReciever: any;
  @Reciever.Getter('hasReciever') hasReciever: any;
  form = {
    seed: '',
    id: '',
  };
  show = true;
  async onSubmit(evt: Event) {
    evt.preventDefault();
    await this.addReciever(this.form);
  }
  onReset(evt: Event) {
    evt.preventDefault();
  }
  generateSeed() {
    this.form.seed = generateSeed();
  }
  get validateSeed() {
    const res = this.form.seed.match('[A-Z9]*');
    // @ts-ignore
    return res ? res.input.length === 81 : false;
  }
  get publisherExists() {
    return this.hasReciever(this.form.id);
  }
  get validatePubId() {
    const res = this.form.id.length > 0;
    const unique = !this.publisherExists;
    console.log(unique);
    // @ts-ignore
    return res && unique;
  }
  get formValid() {
    const valid = this.validateSeed && this.validatePubId;
    console.info(valid);
    return valid;
  }
}
</script>

<style>
</style>