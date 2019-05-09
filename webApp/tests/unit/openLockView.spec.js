import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import OpenLock from '@/views/OpenLock.vue';
import Vuetify from 'vuetify/lib';
import Vue from "vue";

describe('OpenLock.vue', () => {
  let wrapper = {};

  beforeEach(() => {
    Vue.use(Vuetify);

    const root = {
      data() {
        return {
          accesses: []
        }
      }
    }

    wrapper = shallowMount(OpenLock, {
      Vue,
      parentComponent: root,
      attachToDocument: true
    });
  });
  
  it('has a mounted hook', () => {
    expect(OpenLock.mounted).to.be.a('function')
  });

  it('has a info how to hold the phone', () => { 
    expect(wrapper.find('.info_hold').text()).to.equal("Hold your phone next to a lock")
  });

  it('has a info to open the lock when a lock is close', () => {
    wrapper.setData({ connected: true })
    expect(wrapper.find('.info_hold').text()).to.equal("Tap to open lock")
  })

  it('has a scanning animation', () => {
    expect(wrapper.find('.scanningAnimation').exists()).to.equal(true)
    expect(wrapper.findAll('.circle')).to.have.lengthOf(3);
  });

  it('has a openLock button when a lock is close', () => {
    expect(wrapper.find('.openButton').exists()).to.equal(true)
  })

  it('has a footer', () => {
    expect(wrapper.find('.footer').exists()).to.equal(true)
  });
});
