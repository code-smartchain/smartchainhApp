import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import YourAccesses from '../../src/views/YourAccesses.vue';
import { connect } from "@holochain/hc-web-client";
import Vuetify from 'vuetify/lib';
import Vue from "vue";

const $holochain = connect("ws:localhost:8887");

describe('YourAccesses.vue', () => {
  let wrapper = {};

  beforeEach(() => {
    Vue.use(Vuetify);

    wrapper = shallowMount(YourAccesses, {
      Vue,
      mocks: { $holochain },
      attachToDocument: true
    });
  });

  it('has a mounted hook', () => {
    expect(YourAccesses.mounted).to.be.a('function')
  });
  
  it('displays the shared Accesses', () => {
    const access = {
      access: {
        device_id: 'test device',
        device_type: 'test device type',
        device_name: 'test device name',
        public_key: 'test public key',
        description: 'test description',
        transaction_hash: '',
        time_restriction: '',
      },
      lock: {
        device_id: 'test device'
      }
    }

    wrapper.setData({ accesses: [access] })

    expect(wrapper.findAll('.access')).to.have.lengthOf(1);
  });

  it('has a footer', () => {
    expect(wrapper.find('.footer').exists()).to.equal(true)
  });

});
