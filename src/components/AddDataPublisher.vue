<template>
  <b-container>
    <h1>Add Data Publisher</h1>
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
          <b-form-group id="pubId">
            <b-form-input
              id="input-pubId"
              v-model="form.id"
              required
              placeholder="Enter Publisher ID"
              :state="validatePubId"
            ></b-form-input>
            <b-form-invalid-feedback
              :state="!publisherExists"
            >A Publisher ID is required or your Publisher ID is already taken..</b-form-invalid-feedback>
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
      <b-row>
        <b-col sm="10">
          <b-form-group id="peer" description="Select the Owner">
            <b-form-select
              id="input-peer"
              v-model="form.peer"
              :options="peerList"
              required
              placeholder="Select a Owner"
              :state="validateOwner"
            ></b-form-select>
            <b-form-invalid-feedback :state="validateOwner">Your must select a Owner.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validateOwner">Looks Good.</b-form-valid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="10">
          <b-form-group id="dataType" description="Select the Datatype">
            <b-form-select
              id="input-dataType"
              v-model="form.dataType"
              :options="dataOptions"
              required
              placeholder="Select a DataType"
            ></b-form-select>
            <b-form-invalid-feedback :state="validateOwner">Your must select a Owner.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validateOwner">Looks Good.</b-form-valid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="form.dataType === 'fitbit'">
        <b-col sm="10">
          <b-form-group id="fitbitUserId">
            <b-form-input
              id="input-fitbitUserId"
              v-model="form.fitbitUserId"
              required
              placeholder="Enter fitbitUserId"
              :state="validatefitbitUserId"
            ></b-form-input>
            <b-form-invalid-feedback :state="validatefitbitUserId">Your fitbitUserId must be set.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validatefitbitUserId">Looks Good.</b-form-valid-feedback>
          </b-form-group>
          <b-form-group id="fitbitAccessToken">
            <b-form-input
              id="input-fitbitAccessToken"
              v-model="form.fitbitAccessToken"
              required
              placeholder="Enter fitbitAccessToken"
              :state="validatefitbitfitbitAccessToken"
            ></b-form-input>
            <b-form-invalid-feedback
              :state="validatefitbitfitbitAccessToken"
            >Your fitbitAccessToken must be set.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validatefitbitfitbitAccessToken">Looks Good.</b-form-valid-feedback>
          </b-form-group>
        </b-col>
      </b-row>

      <b-button :disabled="!formValid" type="submit" variant="primary">Submit</b-button>
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
import { Publisher, Owner } from '@/namespaces';
import { returnType } from '@iota/core/typings/core/src/composeAPI';

@Component({
  components: {},
})
export default class AddDataPublisher extends Vue {
  @Publisher.Action('addPublisher') addPublisher: any;
  @Publisher.Getter('hasPublisher') hasPublisher: any;
  @Owner.Getter('getOwner') getOwner!: any;
  @Owner.Getter('getPublisherOfOwner') getPublisherOfOwnerGetter!: any;

  form = {
    seed: '',
    id: '',
    masterSecret: '',
    peer: '',
    dataType: 'timestamp',
    fitbitUserId: '',
    fitbitAccessToken: '',
  };
  dataOptions = [
    { value: 'timestamp', text: 'Timestamp' },
    { value: 'fitbit', text: 'Fitbit Data' },
  ];
  show = true;
  async onSubmit(evt: Event) {
    evt.preventDefault();
    await this.addPublisher(this.form);
  }
  onReset(evt: Event) {
    evt.preventDefault();
    this.form = {
      seed: '',
      id: '',
      masterSecret: '',
      peer: '',
      dataType: 'timestamp',
      fitbitUserId: '',
      fitbitAccessToken: '',
    };
  }
  generateSeed() {
    this.form.seed = generateSeed();
  }
  get getPublisherOfOwner() {
    return this.getPublisherOfOwnerGetter(this.form.peer);
  }
  get peerList() {
    const list = this.getOwner.map(e => e.id);
    return list;
  }
  get validatefitbitfitbitAccessToken() {
    return this.form.fitbitAccessToken.length > 0;
  }
  get validatefitbitUserId() {
    return this.form.fitbitUserId.length > 0;
  }
  get validatefitbit() {
    if (this.form.dataType === 'fitbit') {
      return this.validatefitbitUserId && this.validatefitbitfitbitAccessToken;
    } else {
      return true;
    }
  }
  get validateOwner() {
    return this.form.peer.length > 0;
  }

  get validateSeed() {
    const res = this.form.seed.match('[A-Z9]*');
    // @ts-ignore
    return res ? res.input.length === 81 : false;
  }
  get publisherExists() {
    return this.hasPublisher(this.form.id);
  }
  get validatePubId() {
    const res = this.form.id.length > 0;
    const unique = !this.publisherExists;
    // @ts-ignore
    return res && unique;
  }
  get validateMasterSecret() {
    const res = this.form.masterSecret.length > 0;
    // @ts-ignore
    return res;
  }
  get formValid() {
    const valid =
      this.validateSeed &&
      this.validatePubId &&
      this.validateMasterSecret &&
      this.validateOwner &&
      this.validatefitbit;
    return valid;
  }
}
</script>

<style>
</style>