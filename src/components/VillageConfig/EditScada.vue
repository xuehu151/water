<template>
    <div class="sewage-scada-main">
        <div class='pos-label'></div>
        <div class="sewage-scada-wrapper">
            <iframe src="" frameborder="0" id="sewage-scada"></iframe>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                village_id: 0,
                scada_type: 0,
                allData: {
                    lanyueSrc: 'http://121.42.253.149:18822/scada',
                    ajaxComplated: {},
                    scada_list: [],
                    //新增组态
                    parentDataAdd: {
                        type: 1,
                        system: 1,
                        scada_config: {
                            data_list: [],
                            anchor_list: []
                        }
                    },
                    //编辑组态
                    parentDataEdit: {
                        type: 2,
                        scada_id: '',
                        scada_config: {
                            data_list: [],
                            anchor_list: []
                        }
                    }
                }
            };
        },
        methods: {
            async getScadaList () {
                const res = await this.$http('/scadas',{
                    data: {'opts': {where: {village_id: this.village_id, type: this.scada_type}}}
                });
                this.scada_list = res.result.rows;
            },
            init () {
                this.getData();
                this.searchAnchor();
            },
            async getData () {
                this.allData.ajaxComplated.data = false;
                const res = await this.$http('/datasInfo',{
                    data: {'opts': {where: {village_id: this.village_id}}}
                });
                this.createParentMessage(res.result.rows);
                this.getMessageFromChild();
            },
            createParentMessage (data) {
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        let datas = {};
                        if (data[i].data_unit == 'm³/h') {
                            data[i].data_unit = 'm3/h';
                        }
                        datas.label_id = data[i].pub_data_id;
                        datas.label_name = data[i].pub_data_name;
                        datas.label_value = data[i].value;
                        datas.label_unit = data[i].pub_data_unit;
                        datas.status = data[i].status;

                        datas.port_type = data[i].pub_port_type;
                        datas.high_battery = data[i].pub_high_battery;
                        datas.low_battery = data[i].pub_low_battery;
                        if(this.scada_list && this.scada_list.length === 0) {
                            this.allData.parentDataAdd.scada_config.data_list.push(datas);
                        }else if (this.scada_list && this.scada_list.length === 1){
                            this.allData.parentDataEdit.scada_config.data_list.push(datas);
                        }
                    }
                }
                this.allData.ajaxComplated.data = true;
                this.postMessageToChild();
            },
            async searchAnchor () {
                this.allData.ajaxComplated.anchor = false;
                 const res = await this.$http('/scadas',{
                    data: {'opts': {where: {village_id: this.village_id}}}
                });
                this.createParentAnchor(res.result.rows);
            },
            createParentAnchor (data) {
                if (data && data.length > 0) {
                    for(let i = 0;i < data.length;i++){
                        let datas = {};
                        datas.label_id = data[i].scada_models_id;
                        datas.label_name = data[i].scada_name;
                        if (this.scada_list && this.scada_list.length === 0) {
                            this.allData.parentDataAdd.scada_config.anchor_list.push(datas);
                        } else if (this.scada_list && this.scada_list.length === 1){
                            this.allData.parentDataEdit.scada_config.anchor_list.push(datas);
                        }
                    }
                }
                this.allData.ajaxComplated.anchor = true;
                this.postMessageToChild();
            },
            canPostMessageToChild () {
                let res = true;
                for (let key in this.allData.ajaxComplated) {
                    if ( !this.allData.ajaxComplated[key] ) {
                        res = false;
                    }
                }
                return res;
            },
            postMessageToChild () {
                if ( !this.canPostMessageToChild() ) {return;}
                const alldata = this.allData;
                const scada = document.getElementById('sewage-scada');
                scada.setAttribute('src',alldata.lanyueSrc);
                scada.onload = () => {
                    if(this.scada_list && this.scada_list.length === 0) {
                        scada.contentWindow.postMessage(alldata.parentDataAdd, '*');
                    } else if (this.scada_list && this.scada_list.length === 1) {
                        alldata.parentDataEdit.scada_id = this.scada_list[0].pub_scada_id;
                        scada.contentWindow.postMessage(alldata.parentDataEdit, '*');
                    }
                };
            },
            getMessageFromChild () {
                window.onmessage = ev => {
                    if (ev.data.code === 200) {
                        let sentData = {
                            pub_scada_id: ev.data.data._id,
                            village_id: this.village_id,
                            type: 2
                        };
                        this.$http.post('/scadas',sentData);
                    }
                    
                };
            }
        },
        mounted () {

            //this.init();
            const url = window.location.href;
            const village_id = url.slice(url.length - 1);
            this.village_id = village_id;
            this.scada_type = Number(sessionStorage.getItem('scada_type'));
            this.getScadaList();
            this.init();
        }
    };
</script>

<style>
    .sewage-scada-main{
        width: 100%;
        height: calc(100% - 80px);
        background-color: #f2f2f4;
        overflow: hidden;
    }
    .pos-label{
        width: 95%;
        height: 45px;
        margin: auto;
        font-size: 16px;
        line-height: 70px;
        color:#000;
    }
 
    .sewage-scada-main > .sewage-scada-wrapper{
        height: calc(100% - 45px);
        width: 98%;
        margin: auto;
        border-radius: 15px;
    }
    #sewage-scada{
         width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }

</style>

