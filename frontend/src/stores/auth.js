import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = '/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isEmployee: (state) => state.user?.role === 'employee',
    isEmployer: (state) => state.user?.role === 'employer'
  },

  actions: {
    async signup(userData) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.post(`${API_URL}/signup`, userData)
        this.user = data
        this.token = data.token
        localStorage.setItem('user', JSON.stringify(data))
        localStorage.setItem('token', data.token)
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Signup failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.post(`${API_URL}/login`, credentials)
        this.user = data
        this.token = data.token
        localStorage.setItem('user', JSON.stringify(data))
        localStorage.setItem('token', data.token)
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})
