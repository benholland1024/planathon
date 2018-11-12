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
        nodeID2Index: function(id){
            //O(n) search.  TODO: Replace with O(log(n)) time binary search
            let res=0;
            while(this.nodes[res].id!=id){
                res++
                if(res==this.nodes.length) break;
            }
            return res;
        },
        addTask: function(taskName,parentID){
            this.maxID++;
            this.nodes.push({id:this.maxID,label:taskName});
            this.edges.push({from:this.maxID,to:parentID});
            this.recalculate();
            return true;
        },
        removeTask: function(id){
            let indexOfTarget=this.nodeID2Index(id);
            if(indexOfTarget==this.nodes.length) return false;

            let edgesToRemove=[];
            let otherNodes=[];

            for(i in this.edges){
                if(this.edges[i].to==id){
                    edgesToRemove.push(i)
                    otherNodes.push(this.edges[i].from);
                }
            }
            
            for(i in otherNodes)
                this.removeTask(otherNodes[i]);
            
            for(i in edgesToRemove)
                this.edges.splice(edgesToRemove[i],1);

            this.nodes.splice(indexOfTarget,1);

            return true;
        },
        reassignDependency:function(nodeID,dependencyID,newID){
            //Find the edge where t=o=nodeID and from==dependencyID and remove it.
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