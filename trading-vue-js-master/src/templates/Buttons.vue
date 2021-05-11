<template>
    <div class="buttons">
  <b-navbar type="dark" variant="dark">
    <b-navbar-nav>
      <b-nav-item v-on:click="update">Update</b-nav-item>

      <!-- Navbar dropdowns -->
      <b-nav-item-dropdown text="Lang" right>
        <b-dropdown-item href="#">EN</b-dropdown-item>
        <b-dropdown-item href="#">ES</b-dropdown-item>
        <b-dropdown-item href="#">RU</b-dropdown-item>
        <b-dropdown-item href="#">FA</b-dropdown-item>
      </b-nav-item-dropdown>

      <b-nav-item-dropdown text="User" right>
        <b-dropdown-item href="#">Account</b-dropdown-item>
        <b-dropdown-item href="#">Settings</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
    </div>
</template>

<script>
    export default {
        name: 'Buttons',
        props: ['chart'],
        components: {
            
        },
        methods: {
            update() {
                console.log('update')
            }
        },
        data() {
            return { test: 999 }
        }
    }
</script>