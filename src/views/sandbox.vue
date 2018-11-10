<template>
    <div>
        <div id="theGraph"><network v-bind:nodes="nodes" v-bind:edges="edges" ref="graph"></network ></div>
        <input type="button" value="add" @click="add()">
        <input type="button" value="reload" @click="replace()">
    </div>
</template>

<script>
    import graph2d from '@/components/Visualization/graph2d.vue';
    import network from '@/components/Visualization/network.vue';
    export default {
        data(){return {
            nodes: [
                {id: 1, label: 'Node 1'},
                {id: 2, label: 'Node 2'},
                {id: 3, label: 'Node 3'},
                {id: 4, label: 'Node 4'},
                {id: 5, label: 'Node 5'}
            ],
            edges: [
                {from: 1, to: 3},
                {from: 1, to: 2},
                {from: 2, to: 4},
                {from: 2, to: 5},
                {from: 3, to: 3}
            ]
        }},
        components: {
            graph2d,
            network
        },
        methods: {
            add: function(){
                this.$refs.graph.addTask("New",4);
            },
            replace: function(){
                this.$refs.graph.reloadData([
                    {x: '2014-06-11', y: 30},
                    {x: '2014-06-12', y: 15},
                    {x: '2014-06-13', y: 10},
                    {x: '2014-06-14', y: 30},
                    {x: '2014-06-15', y: 25},
                    {x: '2014-06-16', y: 10}
                ])
            }
        }
    }
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';
#theGraph{
    height: 500px;
}
</style>