<template>
  <b-container>
    <h1>Add Data Owner</h1>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-row>
        <b-col sm="10">
          <b-form-group id="seed" description="The seed of the owner">
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
              placeholder="Enter Owner ID"
              :state="validatePubId"
            ></b-form-input>
            <b-form-invalid-feedback
              :state="!ownerExists"
            >A Reciever ID is required or your Reciever ID is already taken..</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validatePubId">Looks Good.</b-form-valid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="10">
          <b-form-group id="masterSecret">
            <b-form-input
              id="input-masterSecret"
              v-model="form.masterSecret"
              required
              placeholder="Enter masterSecret"
              :state="validateMasterSecret"
            ></b-form-input>
            <b-form-invalid-feedback :state="validateMasterSecret">Your MasterSecret must be set.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validateMasterSecret">Looks Good.</b-form-valid-feedback>
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
import { Owner } from '@/namespaces';

@Component({
  components: {},
})
export default class AddDataOwner extends Vue {
  @Owner.Action('addOwner') addOwner: any;
  @Owner.Getter('hasOwner') hasOwner: any;
  form = {
    seed: '',
    id: '',
    masterSecret: '',
  };
  async onSubmit(evt: Event) {
    evt.preventDefault();
    await this.addOwner(this.form);
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
  get ownerExists() {
    return this.hasOwner(this.form.id);
  }
  get validateMasterSecret() {
    const res = this.form.masterSecret.length > 0;
    // @ts-ignore
    return res;
  }

  get validatePubId() {
    const res = this.form.id.length > 0;
    const unique = !this.ownerExists;
    console.log(unique);
    // @ts-ignore
    return res && unique;
  }
  get formValid() {
    const valid =
      this.validateSeed && this.validatePubId && this.validateMasterSecret;
    console.info(valid);
    return valid;
  }
}
</script>

<style>
</style>