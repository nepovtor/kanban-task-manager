import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts and renders router view stub', () => {
    const wrapper = mount(App)
    expect(wrapper.html()).toContain('router-view-stub')
  })
})
