<template>
    <div id="breadcrumb">
        <label @click="backBasisInfo">{{title[0]}}</label>
        <span>/</span>
        <label>{{title[1]}}</label>
    </div>
</template>
<script>
export default {
    props: ['title'],
    methods: {
        backBasisInfo() {
            this.$router.go(-1);
        }
    },
};
</script>
<style>
#breadcrumb {
  height: 45px;
  width: 100%;
  line-height: 45px;
  font-size: 18px;
}
#breadcrumb :nth-child(1) {
  cursor: pointer;
}
#breadcrumb :nth-child(3) {
  color: #878789;
}
</style>
