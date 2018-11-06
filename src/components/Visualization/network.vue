<template>
<div ref="container"></div>
</template>

<script>
import vis from 'vis';
import 'vis/dist/vis.min.css';

export default{
    props: {
        nodes: {required:true},
        edges: {required:true}
    },
    data(){return {
        options: {
            width: '100%',
            height: '100%',
        },
        container: '',
        network: '',
        data: ''
    }},
    mounted(){
        this.container = this.$refs.container;
        this.data = {nodes:new vis.DataSet(this.nodes),edges: new vis.DataSet(this.edges)};
        this.networl = new vis.Network(this.container, this.data, this.options);
    },
}
</script>
<style scoped>
div {
    width: 100%;
    height: 100%;
}
</style>