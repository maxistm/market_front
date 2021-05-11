
<template>
    <div>
          <b-navbar type="light" variant="light">
            <b-navbar-nav>
            <b-nav-item v-on:click="update">Update</b-nav-item>

            <!-- Navbar dropdowns -->
            <b-nav-item-dropdown  :text="selTicket" right>
                <b-dropdown-item v-for="item in tickets" :key=item v-on:click="selectTicket(item)">{{item}} </b-dropdown-item>
            </b-nav-item-dropdown>
              <b-nav-item>
                <b-form-datepicker id="date_from" size="sm" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                locale="ru"
                v-model="startDate" class="mb-2"></b-form-datepicker>
            </b-nav-item>
            <b-nav-item>
                <b-form-datepicker id="date_to" size="sm" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                locale="ru"
                v-model="stopDate" class="mb-2"></b-form-datepicker>
            </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <trading-vue :data="chart" :width="this.width" :height="this.height"
                :color-back="colors.colorBack"
                :color-grid="colors.colorGrid"
                :color-text="colors.colorText" :titleTxt="this.selTicket">
        </trading-vue>
        <div>Console:  {{message}} </div>
    </div>
</template>

<script>
import TradingVue from './templates/TradingVue.vue'
import Data from '../data/data.json'
import DataCube from '../src/helpers/datacube.js'
import Buttons from './templates/Buttons.vue'
import axios from 'axios'

export default {
    name: 'app',
    components: {
        Buttons,
        TradingVue
    },
    methods: {
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight-95
        },
        setConsole(message){
            this.message = message
            setTimeout(() => {
                this.message = ''   
            }, 10000)
        },
        selectTicket(ticket){
            
            if (this.startDate >= this.stopDate) {
                console.log('Error date:')
                this.setConsole('Error: date_from > date_to')
                return
            }
            console.log(ticket)
            this.selTicket = ticket+'_1m'
            axios
                .post('http://localhost:5000/api/get/'+ticket,
                    {
                        ticket: ticket,
                        startDate: this.startDate,
                        stopDate: this.stopDate
                    },{
                    headers: { 
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    }
                })
                .then(response => {
                    this.info = response.data.bpi
                    console.log(response.data)
                    this.chart = new DataCube({chart: {
                        tf: '1m',
                        data: response.data['ohlcv']
                    }})
                    //this.chart.set('chart.tf', '1m') 
                    this.setConsole(response.data.length)
                    //#console.log(response.data)
                    
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));

        },
        update() {
            axios
                .get('http://localhost:5000/api/reload', {
                    headers: { 
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    }
                })
                .then(response => {
                    //this.info = response.data.bpi
                    //result = response.data
                    this.tickets = response.data.tickets
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() => (this.loading = false))
            
            },
        getTickets() {
            axios
                .get('http://localhost:5000/api/get_tickets', {
                    headers: { 
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    }
                })                
                .then(response => {
                    this.info = response.data.bpi
                    console.log(response)
                    this.setConsole(response.data)
                    this.tickets = response.data
                    //this.chart = new DataCube(response.data);
                    //#console.log(response.data)
                    //console.log(response)
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false))
        },
         onContext(ctx) {
            // The date formatted in the locale, or the `label-no-date-selected` string
            //this.formatted = ctx.selectedFormatted
            // The following will be an empty string until a valid date is entered
            //this.selected = ctx.selectedYMD
            }
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        window.dc = this.chart
        
    },
    beforeCreate() {
        
            
    },
    beforeMount() {
        this.getTickets()   

        this.stopDate = new Date
        this.startDate = new Date
        this.startDate.setDate(this.startDate.getDate() -32);
        this.stopDate = this.stopDate.toISOString().slice(0,10)
        this.startDate = this.startDate.toISOString().slice(0,10)
        //this.startDate = this.startDate.toDateString()

    },

    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            data_o: {},
            chart: new DataCube(this.data_o),
            width: window.innerWidth,
            height: window.innerHeight-95,
            colors: {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
            },
            tickets: ['MSFT','GOOGL','EBAY'],
            selTicket: 'MSFT_1m',
            startDate: '',
            stopDate: '',
            message: ''


        };
    }
};
</script>

<style>
html,
body {
    /*background-color: rgb(243, 233, 233);*/
    margin: 0;
    padding: 0;
    overflow: hidden;
}
</style>
