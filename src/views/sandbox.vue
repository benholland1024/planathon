<template>
    <div>
        <div id="theGraph"><network v-bind:nodes="nodes" v-bind:edges="edges" ref="graph"></network ></div>
        <input type="button" value="add" @click="add()">
        <input type="button" value="remove" @click="remove()">
        <br>
        <input type="text" id="id1">
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
                {id: 5, label: 'Node 5'},
                {id: 6, label: 'Node 6'}
            ],
            edges: [
                {from: 1, to: 2},
                {from: 3, to: 1},
                {from: 4, to: 2},
                {from: 5, to: 2},
                {from: 6, to: 1}
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
            remove: function(){
                this.$refs.graph.removeTask(document.getElementById("id1").value)
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