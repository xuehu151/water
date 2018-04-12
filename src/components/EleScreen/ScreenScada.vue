<template>
    <div class="screen-scada-wrapper">
        <iframe :src="allData.lanyueSrc" frameborder="0" class="scada" @load="scadaOnload($event.currentTarget)"></iframe>
    </div>
</template>

<script>
    export default {
        props: ['villageID'],
        scada: [],
        data () {
            return {
                villages: [],
                allData: {
                    lanyueSrc: 'http://121.42.253.149:18822/scada',
                    ajaxComplated: {},
                    parentData: {
                        type: 3,
                        scada_id: '',
                        scada_config: {
                            data_list: [],
                            anchor_list: []
                        },
                        frameStyle: {
                            transparent: true,
                            borderRadius: false,
                            boxShadow: false,
                            viewTools: false
                        }
                    }
                },
                queryCorrelation: {
                    where: {
                        village_id: this.villageID,
                        type: 0
                    }
                }
            };
        },
        
        methods: {
            async getScada () {
                const res = await this.$http('/scadas',{
                    data: {'opts': this.queryCorrelation}
                });
               this.scada = res.result.rows;
            },
            async getData () {
                this.allData.ajaxComplated.data = false;
                const res = await this.$http('/datasInfo',{
                    data: {'opts': {where: {village_id: this.villageID}}}
                });
                this.createParentMessage(res.result.rows);
                //this.getMessageFromChild();
            },
            createParentMessage (data) {
                if (data && data.length > 0) {
                    for (let value of data) {
                        let datas = {};
                        if (value.data_unit === 'm³/h') {
                            value.data_unit = 'm3/h';
                        }
                        datas.label_id = value.pub_data_id;
                        datas.label_name = value.pub_data_name;
                        datas.label_value = value.value;
                        datas.label_unit = value.pub_data_unit;
                        datas.status = value.status;
                        datas.port_type = value.pub_port_type;
                        datas.high_battery = value.pub_high_battery;
                        datas.low_battery = value.pub_low_battery;

                        this.allData.parentData.scada_config.data_list.push(datas);
                    }
                }
                this.allData.ajaxComplated.data = true;
                //this.postMessageToChild();
            },
            canPostMessageToChild () {
                let res = true;
                for (let key in this.allData.ajaxComplated) {
                    if (!this.allData.ajaxComplated[key]) {
                        res = false;
                    }
                }
                return res;
            },
            // postMessageToChild () {
            //     if (!this.canPostMessageToChild()) {
            //         return;
            //     }
            //     const allData = this.allData;
            //     const scada = document.getElementsByClassName('scada')[0];
            //     // scada.setAttribute('src',allData.lanyueSrc);
            //     // scada.onload = () => {
                    
            //     // };
            // }
            scadaOnload (dom) {
                if (!this.canPostMessageToChild()) {return;}
                //const el = dom.currentTarget;
                const allData = this.allData;
                allData.parentData.scada_id = this.scada[0].pub_scada_id;
                dom.contentWindow.postMessage(allData.parentData, '*');
            }
        },
        mounted () {
            this.getScada();
            this.getData();
            
        }
    };
</script>

<style>

    .screen-scada-wrapper{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .screen-scada-wrapper > div{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 50px;
        color: #fff;
    }
    .screen-scada-wrapper> .scada{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
</style>
