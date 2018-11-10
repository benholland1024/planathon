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
        network: null,
        data: '',
        maxID: 0,
        seed: null
    }},
    mounted(){
        for(var i in this.nodes)
            if (this.nodes[i].id>this.maxID) 
                this.maxID=this.nodes[i].id

        this.container = this.$refs.container;
        this.recalculate();
    },
    methods:{
        addTask: function(taskName,parentID){
            this.maxID++;
            this.nodes.push({id:this.maxID,label:taskName});
            this.edges.push({from:this.maxID,to:parentID});
            this.recalculate();
        },
        removeTask: function(id){
            //Find the task, if it doesn't exist, return
            
            //Find any edges that connect to the task, push them into a list
            //For each item in said list, if its a "child" task, call removeTask recursively
            //remove each edges from this.edges
            //remove the node itself
        },
        reassignDependency:function(nodeID,dependencyID,newID){
            //Find the edge where t=o=nodeID and from==dependencyID and remove it.
        }

        },
        recalculate:function(){
            if(this.network!=null) for (var i in this.network.body.nodes){
                if(i.length>5) break;

                let node=null
                for(var j in this.nodes)
                    if(this.nodes[j].id===this.network.body.nodes[i].id){
                        node=this.nodes[j];
                    } 
                if (node==null) continue;

                node.x=this.network.body.nodes[i].x;
                node.y=this.network.body.nodes[i].y;
            }
            this.data = {nodes:new vis.DataSet(this.nodes),edges: new vis.DataSet(this.edges)};
            this.network = new vis.Network(this.container, this.data, this.options);
            
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