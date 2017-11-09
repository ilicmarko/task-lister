<template>
  <div class="graph">
   <div class="blobs">
     <transition-group 
        appear 
        @after-appear="appeared" 
        name="list" 
        class="blob__tasks" tag="div"
      >
     <div 
        class="blob"
        v-for="(user, index) in users"
        :key="user.id"
        :data-index="index"
        :data-value="user.tasks"
        :data-user-id="user.id"
        :style="gradient(user.gradient)"
      >
        {{ user.tasks }}
      </div>
    </transition-group>
    <div class="spawn-drop"></div>
    <div class="blob blob--main blob--skew">{{ freeTasks }}</div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
        <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        <feBlend in="SourceGraphic" in2="goo" />
        </filter>
    </defs>
    </svg>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';
import { getXY } from '../helper';
import Bus from '../eventBus';

export default {
  name: 'Graph',
  props: ['users', 'tasks'],
  data() {
    return {
      freeTasks: this.tasks.filter(user => user.userId === null).length,
      colors: ['#7ACE4C', '#EB5757', '#FFBB44', '#5A78F0'],
    };
  },
  created() {
    Bus.$on('increment', (id, flag) => {
      this.increment(id, flag);
    });

    Bus.$on('decrement', (id) => {
      this.decrement(id);
    });
  },
  methods: {
    // Print out a gradient
    gradient(gradient) {
      return `background-image: linear-gradient(${gradient})`;
    },
    // Find the blob by it's user-id and decrement it
    decrement(id) {
      // Find the actual blob with it's user-id attribute
      const elem = document.querySelector(`.blob[data-user-id="${id}"]`);
      const idx = elem.dataset.index;
      const elemCords = elem.getBoundingClientRect();
      const dropContainer = document.querySelector('.spawn-drop');
      const relativeParent = document.getElementById('app').getBoundingClientRect();

      // Create a water drop, then place it behind the actual blob
      const dropSize = 20;
      const drop = document.createElement('div');
      drop.classList.add('drop');
      drop.style.top = `${(elemCords.top - relativeParent.top) + ((elemCords.height / 2) - (dropSize / 2))}px`;
      drop.style.left = `${(elemCords.left - relativeParent.left) + ((elemCords.width / 2) - (dropSize / 2))}px`;
      dropContainer.appendChild(drop);

      // Animate the drop
      Velocity(drop, {
        top: `${elemCords.top + elemCords.height + 100}px`,
      }, { duration: 1000 }).then(() => drop.remove());

      this.users[idx].tasks -= 1;
    },
    // Find the blob by its user-id and then increment it.
    // @parm global is there to check if the increment comes from
    // a free task (main blob) or from another blob.
    // If global == true then decrement the main blob.
    increment(id, global) {
      const elem = document.querySelector(`.blob[data-user-id="${id}"]`);
      const idx = elem.dataset.index;
      const value = elem.dataset.value;
      const mainBlob = document.querySelector('.blob--main');

      // Get the new sizes, because when a blob is incremented
      // it's size should also grow.
      const orgSize = this.getSize(value);
      const incrementSize = 40 / orgSize.maxTask;
      const newSize = orgSize.size + incrementSize;

      // Animate to a new size
      Velocity(elem, {
        width: newSize,
        height: newSize,
        fontSize: orgSize.fontSize + 1,
        scaleX: 1.2,
        scaleY: 0.9,
      }, { duration: 300 });

      // There is a scale animation which needs to be restarted
      Velocity(elem, {
        scaleX: 1,
        scaleY: 1,
      }, { duration: 300 });

      this.users[idx].tasks += 1;

      // If the increment comes from the main blob
      if (global) {
        this.freeTasks -= 1; // @FIXME

        // Animate the contraction.
        Velocity(mainBlob, {
          scaleX: 0.8,
          scaleY: 1.3,
        }, { duration: 300 });

        // Reset the contraction
        Velocity(mainBlob, {
          scaleX: 1,
          scaleY: 1,
        }, { duration: 300 });
      }
    },
    // Calculate the new size and font-size based on the old one
    getSize(value) {
      // Find the user that is the biggest (has most tasks), this will be 100%
      // scale down all other tasks accordingly.

      // eslint-disable-next-line prefer-spread
      const maxTask = Math.max.apply(Math, this.users.map(v => v.tasks));
      return {
        size: ((40 / maxTask) * value) + 40,
        fontSize: ((13 / maxTask) * value) + 21,
        maxTask,
      };
    },
    // When the blob appears move it to it's position
    appeared(el) {
      const idx = parseInt(el.dataset.index, 10) + 1;
      const cords = getXY(idx, this.users.length);
      const value = el.dataset.value;
      const mainBlob = document.querySelector('.blob--main');

      const { size, fontSize } = this.getSize(value);

      Velocity(el, {
        top: `${cords.y}px`,
        left: `${cords.x}px`,
        width: size,
        height: size,
        marginLeft: '-37.5px',
        fontSize: `${fontSize}px`,
        'background-image': `linear-gradient(${this.users[idx - 1].gradient})`,
      },
        {
          duration: 3000,
          complete: () => {
            mainBlob.classList.remove('blob--skew');
          },
        });
    },
  },
};
</script>

<style lang="scss">
@import '../assets/css/vars';
@import '../assets/css/functions';

.blobs{
  filter:url('#goo');
  position:absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-weight: 300;
  text-shadow: 0 0 5px rgba(#000, .2);
}


@mixin animatetoPosition($animation-name, $r, $theta, $i) {
    $x: $r * sin($theta);
    $y: $r * cos($theta);

    @keyframes #{$animation-name} {
        0% {
            transform:scale(1.1) translate(0, 0);
        }
        50%{
            background-color: $water;
            transform:scale(0.6) translate(0, $r);
        }

        100%{
            background-color: nth($colors, $i);
            transform:scale(0.5) translate($x, $y);
        }
    }
}

$items: 4;

$r: 300px;
$deg: -60deg; // This is the start angle, basically this will determine start point.
$degSpace: 120deg / ($items - 1);

@for $i from 1 through $items {
    @include animatetoPosition('blob-user-#{$i}', $r, $deg, $i);
    $deg: $deg + $degSpace;
}

@mixin make-blob($size, $bg-color, $font-size) {
    position: absolute;
    top: 50px;
    left: 50%;

    display: flex;
    justify-content: center;
    align-items: center;
    width: $size;
    height: $size;
    margin-left: -1 * $size / 2;
    //transform: translateX(-50%);

    border-radius: 50%;

    background-color: $bg-color;

    color: #fff;
    font-size: $font-size;
    text-align: center;

    &--main { background-image: linear-gradient(120deg, #89f7fe, #66a6ff); }

    &--skew {
      animation: skewing 2s 3s ease-in-out infinite;
    }
}


@keyframes skewing {
  0% { transform: skewX(6deg); }
  10% { transform: skewX(-6deg); }
  20% { transform: skewX(4deg); }
  30% { transform: skewX(-4deg); }
  40% { transform: skewX(2deg); }
  50% { transform: skewX(-6deg); }
  55% { transform: skewX(6deg); }
  60% { transform: skewX(-5deg); }
  65% { transform: skewX(5deg); }
  70% { transform: skewX(-4deg); }
  75% { transform: skewX(4deg); }
  80% { transform: skewX(-3deg); } 
  85% { transform: skewX(3deg); }
  90% { transform: skewX(-2deg); } 
  95% { transform: skewX(2deg); }
  100%   { transform: skewX(1deg),; }
}

.blob {
  @include make-blob(150px, $water, 50px);
  animation-duration: 4s;
  animation-timing-function: cubic-bezier(0.770, 0.000, 0.175, 1.000);
  animation-fill-mode: both;
}

.drop {
  position: absolute;

  width: 20px;
  height: 20px;
  
  z-index: -1;

  &::before {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    border-radius: 50% 0 50% 50%;
    transform: rotate(-45deg);
    background-color: $water;
    content: '';
  }

  animation: drop 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
  transform-origin: 50% 0;
}

@keyframes drop {
  0% { transform: scaleY(1); }
  30% { transform: scale3d(1.25,.75,1); }
  40% { transform: scale3d(.75,1.25,1); }
  50% { transform: scale3d(1.15,.85,1); }
  65% { transform: scale3d(.95,1.05,1); }
  75% { transform: scale3d(1.05,.95,1); }
  to { transform: scaleY(1); }
}
</style>

