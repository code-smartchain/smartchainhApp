import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import OpenLock from '@/components/OpenLock.vue';

describe('OpenLock.vue', () => {
  it('has a mounted hook', () => {
    expect(OpenLock.mounted).to.be.a('function')
  });

  it('has a info how to hold the phone', () => {
    const wrapper = mount(OpenLock);
    
    expect(wrapper.find('.info_hold').text()).to.equal("Hold your phone next to a lock")
  });

  it('has a footer', () => {
    const wrapper = mount(OpenLock);

    expect(wrapper.find('.footer').exists()).to.equal(true)
  });

  it('has 3 circles for animation', () => {
    const wrapper = mount(OpenLock);

    expect(wrapper.findAll('.circle')).to.have.lengthOf(3);
  });

});
