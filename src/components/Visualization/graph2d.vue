<template>
<div ref="container"></div>
</template>

<script>
import vis from 'vis';
import 'vis/dist/vis.css';
//import '../../styles/vis.css'

export default{
    props: {
        start: {required: true},
        end: {required: true},
        items: {required:true}
    },
    data(){return {
        options: {
            start: '',
            end: '',
            width: '100%',
            height: '100%',
            interpolation: false
        },
        dataset: '',
        container: '',
        graph: ''
    }},
    mounted(){
        this.options.start=this.start;
        this.options.end=this.end
        this.container = this.$refs.container;
        this.dataset = new vis.DataSet(this.items);
        this.graph = new vis.Graph2d(this.container, this.dataset, this.options);
    },
    methods:{
        addDataPoint: function(point){
            return this.dataset.add(point);
        },
        reloadData: function(newData){
            if(!this.dataset){
                this.dataset=new vis.DataSet(newData);
                this.graph=new vis.Graph2d(this.container,this.dataset,this.options);
            } else{
                this.dataset.clear();
                this.dataset.add(newData);
            }
        }
    }
}
</script>
<style scoped>
div {
    width: 100%;
    height: 100%;
}
</style>
<style>
.vis-time-axis .vis-text {
    color: #bebebe !important;
}
.vis-y-axis.vis-major{
    color: #6e6e6e !important;
}
</style>