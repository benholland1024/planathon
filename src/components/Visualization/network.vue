<template>
<div ref="container"></div>
</template>

<script>
import vis from 'vis';
//import 'vis/dist/vis.min.css';

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
        isParentOf(childID,parentID){
            for(var i in this.edges)
                if(this.edges[i].from==childID && this.edges[i].to==parentID)
                    return true
            return false;
        },
        addTask: function(taskName,parentID){
            this.maxID++;
            this.nodes.push({id:this.maxID,label:taskName});
            this.edges.push({from:this.maxID,to:parentID});
            this.recalculate();
            return true;
        },
        removeTask: function(id){
            if(this.nodeID2Index(id)==this.nodes.length) return false; //For validation only

            let otherNodes=[];

            let i=0;

            while(i<this.edges.length)
                if(this.edges[i].to==id){
                    otherNodes.push(this.edges[i].from);
                    this.edges.splice(i,1);
                } else 
                    i++;

            for(var j in otherNodes)
                this.removeTask(otherNodes[j]);

            this.nodes.splice(this.nodeID2Index(id),1);
            this.recalculate();

            return true;
        },
        reassignDependency:function(nodeID,parentID,newParentID){
            if(this.nodeID2Index(nodeID)==this.nodes.length || this.nodeID2Index(parentID)==this.nodes.length || this.nodeID2Index(newParentID))
                return false;
            for(var i in this.edges)
                if (this.edges[i].from==nodeID)
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