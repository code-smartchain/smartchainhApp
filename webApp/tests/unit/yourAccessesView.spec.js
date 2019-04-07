import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import YourAccesses from '@/views/YourAccesses.vue';

describe('YourAccesses.vue', () => {
  it('has a mounted hook', () => {
    expect(YourAccesses.mounted).to.be.a('function')
  });
  
  it('displays the shared Accesses', () => {
    const wrapper = mount(YourAccesses, { attachToDocument: true });
    
    console.log(wrapper)

    const access = {
      device_id: 'test device',
      device_type: 'test device type',
      device_name: 'test device name',
      public_key: 'test public key',
      description: 'test description',
      transaction_hash: '',
      time_restriction: '',
    }

    wrapper.setData({ accesses: [access] })

    expect(wrapper.findAll('.access')).to.have.lengthOf(1);
  });

  it('has a footer', () => {
    const wrapper = mount(YourAccesses, { attachToDocument: true });

    expect(wrapper.find('.footer').exists()).to.equal(true)
  });

});
