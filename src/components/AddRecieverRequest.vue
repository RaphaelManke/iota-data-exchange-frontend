<template>
  <b-container>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-row>
        <b-col sm="10">
          <b-form-group id="startDate" description="The start Date">
            <b-form-input
              id="input-startDate"
              v-model="form.startDate"
              type="date"
              required
              placeholder="Select start date"
              :state="validateDate"
            ></b-form-input>
            <b-form-invalid-feedback
              :state="validateDate"
            >Start date must be before end Date or equal</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validateDate">Looks Good.</b-form-valid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="10">
          <b-form-group id="endDate" description="The end Date">
            <b-form-input
              id="input-endDate"
              v-model="form.endDate"
              type="date"
              required
              placeholder="Select end date"
              :state="validateDate"
            ></b-form-input>
            <b-form-invalid-feedback
              :state="validateDate"
            >End date must be after start Date or equal</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validateDate">Looks Good.</b-form-valid-feedback>
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
          <b-form-group id="sensor" description="Select the Sensor">
            <b-form-select
              id="input-sensor"
              v-model="form.sensor"
              :options="sensorList"
              required
              placeholder="Select a Sensor from the selected Owner"
            ></b-form-select>
            <!-- <b-form-invalid-feedback :state="validateOwner">Your must select a Owner.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validateOwner">Looks Good.</b-form-valid-feedback>-->
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
import { DataPublisher, DataReciever } from '@/lib/';
import { Reciever, Owner } from '@/namespaces';
import { any } from 'bluebird';
@Component({
  components: {},
  props: {
    recieverId: String,
  },
})
export default class AddRecieverRequest extends Vue {
  @Reciever.Action('requestAccess') requestAccess!: any;
  @Reciever.Getter('getRecieverById') getRecieverByID!: any;
  @Owner.Getter('getOwner') getOwner!: any;
  @Owner.Getter('getOwnerById') getOwnerById!: any;
  @Owner.Getter('getPublisherOfOwner') getPublisherOfOwner!: any;
  form = {
    startDate: '',
    endDate: '',
    peer: '',
    sensor: '',
  };
  show = true;
  async onSubmit(evt: Event) {
    evt.preventDefault();
    const request = {
      recieverId: this.$props.recieverId,
      start: this.form.startDate.replace(/-/g, ''),
      end: this.form.endDate.replace(/-/g, ''),
      peer: this.form.peer,
      publisherId: this.form.sensor,
    };
    await this.requestAccess(request);
  }
  onReset(evt: Event) {
    evt.preventDefault();
    this.form = {
      startDate: '',
      endDate: '',
      peer: '',
      sensor: '',
    };
  }
  get sensorList() {
    return this.getPublisherOfOwner(this.form.peer);
  }
  get peerList() {
    const list = this.getOwner.map(e => e.id);
    return list;
  }
  get validateOwner() {
    return this.form.peer.length > 0;
  }
  get validateDate() {
    const start = parseInt(this.form.startDate.replace(/-/g, ''));
    const end = parseInt(this.form.endDate.replace(/-/g, ''));
    return end >= start;
  }
  get formValid() {
    return this.validateOwner && this.validateDate;
  }

  get reciever(): DataReciever {
    return this.getRecieverByID(this.$props.recieverId);
  }
  mounted() {}
}
</script>
