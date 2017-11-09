<template>
  <div id="app">
    <Graph :users="users" :tasks="tasks" />
    <Loader/>
    <TaskList :tasks="tasks" :users="users" />
  </div>
</template>

<script>
import Loader from './components/Loader';
import Graph from './components/Graph';
import TaskList from './components/TaskList';
import tasksData from './tasks.json';

export default {
  name: 'app',
  components: {
    Loader,
    Graph,
    TaskList,
  },
  data() {
    return {
      users: [
        {
          id: 1,
          username: 'Maverick',
          tasks: 5,
          color: '#d4fc79',
          gradient: '120deg, #d4fc79, #96e6a1',
        },
        {
          id: 2,
          username: 'Pera',
          tasks: 10,
          color: '#a18cd1',
          gradient: '120deg, #a18cd1, #fbc2eb',
        },
        {
          id: 3,
          username: 'Jelena',
          tasks: 2,
          color: '#f6d365',
          gradient: '120deg, #f6d365, #fda085',
        },
        {
          id: 4,
          username: 'Kaca',
          tasks: 4,
          color: '#F1467A',
          gradient: '45deg, #F1467A, #FB949E',
        },
      ],
      tasks: tasksData,
    };
  },
  created() {
    // this.$http.get('https://next.json-generator.com/api/json/get/Nyf3y0jCm')
    //   .then((response) => {
    //     console.log(response.data);
    //     this.tasks = response.data;
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400');

body {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to bottom, #56CCF2 0%, #2F80ED 100%);
  height: 100vh;
}

@import './assets/css/devices.css';

.marvel-device {
  display: block !important;
  margin: 20px auto;
}

#app {
  text-align: center;
  color: #2c3e50;
  position: relative;
  height: 100%;
}
</style>
