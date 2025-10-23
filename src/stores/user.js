import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    uid: null,
    nome: null,
    email: null,
    perfil: null,
    loading: true,
  }),
  actions: {
    setUser(user) {
      this.uid = user.uid
      this.nome = user.nome
      this.email = user.email
      this.perfil = user.perfil
      this.loading = false
    },
    clearUser() {
      this.uid = null
      this.nome = null
      this.email = null
      this.perfil = null
      this.loading = false
    },
  }
})
