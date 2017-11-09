<template>
  <div class="tasks">
    <h1 class="tasks__title">Assign tasks</h1>
    <ul class="tasks__list">
      <li 
        v-for="(task, index) in tasks"
        :key="task.id"
        @click="selectUser(task.id)"
        class="tasks__list-task"
      >
        <div class="tasks__task-info">
          <span
            class="task__list-user"
            :data-char="getChar(task.userId)"
            :data-user-id="task.userId"
            :style="getBg(task.userId)"
          ></span>
          <span class="task__list-title">{{ task.title }}</span>
        </div>
        <div class="task__list-users" v-if="task.id == active">
          <span 
            v-for="user in users"
            :key="user.id"
            v-if="task.userId != user.id"
            @click="childClick"
            class="task__list-user"
            :data-task-index="index"
            :style="getBg(user.id)"
            :data-user-id="user.id"
            :data-char="getChar(user.id)"
          ></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';
import Bus from '../eventBus';

export default {
  name: 'TaskList',
  props: ['tasks', 'users'],
  data() {
    return {
      active: '',
    };
  },
  methods: {
    /*
    * When you click on a new user that is listed under a task,
    * it will add that user to the click task, also animate the user icon
    * to the position where the old user avatar was.
    */
    childClick(event) {
      const that = event.target;
      const curCircle = that.parentNode.parentNode.querySelector('.task__list-user');
      // Get the current user of the task, also needed for checking if it comes from main blob.
      const oldUserId = parseInt(curCircle.dataset.userId, 10);
      const newUserId = parseInt(that.dataset.userId, 10);

      // Get all of his brothers, because they need to be animated out.
      const brothers = that.parentNode.children;
      // Get the index of the clicked element so we can skip it when animating out.
      const thatIndex = Array.prototype.indexOf.call(brothers, that);
      const taskIndex = that.dataset.taskIndex;

      const curCircleCords = curCircle.getBoundingClientRect();
      const curCircleSize = curCircle.clientWidth;
      // Get this for absolute position calculation
      const relativeParent = document.querySelector('.tasks').getBoundingClientRect();
      that.style.position = 'absolute';
      let flag = true;

      // Animate the clicked user to the old user avatar position.
      Velocity(that, {
        top: `${curCircleCords.top - relativeParent.top}px`,
        left: `${curCircleCords.left - relativeParent.left}px`,
        width: `${curCircleSize}px`,
        height: `${curCircleSize}px`,
        fontSize: '10px',
      }).then(() => {
        // We check if the user there was a user on the task,
        // if there isn't one the `oldUserId` which is a parseInt will
        // return a NaN. If this is true then it will mean that the increment
        // comes from the main blob not another user.
        if (!isNaN(oldUserId)) {
          flag = false;
          Bus.$emit('decrement', oldUserId);
        }
        Bus.$emit('increment', newUserId, flag);

        curCircle.dataset.char = that.dataset.char;
        curCircle.setAttribute('style', this.getBg(newUserId));
        that.style.opacity = 0;

        for (let i = 0; i < brothers.length; i += 1) {
          // Skip the one that is already included
          // Also be careful no to overflow if the last item clicked
          if (i === thatIndex && i < brothers.length - 1) { i += 1; }
          Velocity(brothers[i], {
            top: '50px',
            opacity: 0,
          }, { delay: `${i * 200}ms` })
          .then(() => {
            if (i === brothers.length - 1) {
              this.active = '';
              this.tasks[taskIndex].userId = newUserId;
            }
          });
        }
      });
    },
    // When you click on task at it's user (if it exists) to
    // active data so, the div with users will render
    selectUser(id) {
      this.active = id;
    },
    // Simple helper function to get the background and border by userID
    getBg(usrId) {
      let css = '';
      if (usrId != null) {
        const user = this.users.find(item => item.id === usrId);
        css = `background-image: linear-gradient(${user.gradient}); border-color: ${user.color}`;
      }
      return css;
    },
    // Get the fist letter of the username by userID
    getChar(usrId) {
      let char = '';
      if (usrId) {
        const user = this.users.find(item => item.id === usrId).username;
        char = user.charAt(0);
      }
      return char;
    },
  },
};
</script>

<style lang="scss">

.tasks {
  position: absolute;
  bottom: 20px;
  left: 10px;
  right: 10px;
  
  margin: 10px;
  padding: 10px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);

  border-radius: 8px;

  background-color: #fafafa;
  box-sizing: border-box;
  overflow: hidden;

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;

    background-image: linear-gradient(to top, #fafafa 50%, rgba(#fafafa, 0));

    pointer-events: none;
    z-index: 3;
    content: '';
  }

  &__title {
    margin-bottom: 1.2em;
    font-size: 20px;
    text-align: left;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: left;

    max-height: 290px;
    overflow-y: auto;


    &::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
  }

  &__task-info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

$size: 22px;

.task__list {
  &-user {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    width: $size;
    height: $size;
    margin-right: 10px;
    font-size: 10px;

    border: 1px solid #999;
    border-radius: 50%;

    &::before {
      color: #fff;
      content: attr(data-char);
    }
  }
}

@keyframes slideIn {
  0% {
    transform: translate3d(0,-100%,0);
    visibility: hidden
  }
  to { transform: translateZ(0); visibility: visible }
}

@keyframes slideOut {
  0% { transform: translateZ(0); visibility: visible }
  to {
    transform: translate3d(0,-100%,0);
    visibility: hidden
  }
}

.task__list-users {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;

  .task__list-user {
    position: relative;
    height: 48px;
    width: 48px;
    animation: slideIn .4s ease-in-out forwards;
    visibility: hidden;

    font-size: 18px;

    @for $i from 1 to 10 { &:nth-child(#{$i}) { animation-delay: #{$i / 4}s; }}

  }
  &--remove .task__list-user { animation: slideOut .4s ease-in-out forwards; }
}
</style>

