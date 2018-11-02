<template>
<div ref="container"></div>
</template>

<script>
import vis from 'vis';
import 'vis/dist/vis.min.css';

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
            return this.dataset.add();
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