import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import OpenLock from '@/views/OpenLock.vue';
import Vuetify from 'vuetify/lib';
import Vue from "vue";

describe('OpenLock.vue', () => {
  let wrapper = {};

  beforeEach(() => {
    Vue.use(Vuetify);

    wrapper = shallowMount(OpenLock, {
      Vue,
      attachToDocument: true
    });
  });
  
  it('has a mounted hook', () => {
    expect(OpenLock.mounted).to.be.a('function')
  });

  it('has a info how to hold the phone', () => { 
    expect(wrapper.find('.info_hold').text()).to.equal("Hold your phone next to a lock")
  });

  it('has a footer', () => {
    expect(wrapper.find('.footer').exists()).to.equal(true)
  });

  it('has 3 circles for animation', () => {
    expect(wrapper.findAll('.circle')).to.have.lengthOf(3);
  });

});
