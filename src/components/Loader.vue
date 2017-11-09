<template>
  <div class="loader">
    <div class="waves" :style="waveStyles">
        <div class="wave wave--back">
        <div class="water">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 32" preserveAspectRatio="none"><title>wave2</title><path d="M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z"/></svg>
        </div>
        <div class="water">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 32" preserveAspectRatio="none"><title>wave2</title><path d="M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z"/></svg>
        </div>
        </div>
        <div class="wave wave--front">
        <div class="water">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 32" preserveAspectRatio="none"><path d="M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z"/></svg>
        </div>
        <div class="water">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 32" preserveAspectRatio="none"><path d="M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z"/></svg>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style lang="scss" scoped>
@import '../assets/css/vars';


.loader,
.waves {
  height: 100%;
}

.waves {
  //transition: .4s transform ease .3s;
  transform-origin: bottom center;
  animation: pullWater 2s ease-in forwards;
}

@keyframes pullWater {
  0% { transform: scale(1, 2); }
  100% { transform: scale(1, .7)}
}

.wave {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: wave 2s linear infinite;

  &--front {
    z-index: 4;
    path { fill: #32BAFA; }
  }

  &--back {
    z-index: 3;
    animation-direction: reverse;
    path { fill: darken($water, 15); }
  }
}

.water {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $water;

    svg {
        position: absolute;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 99.9%;
    }
}

.water-block {
  background-color: $water;
}
.water:first-of-type {
    transform: translate(-100%,0);
}

@keyframes wave{
    0% {
        transform: translate3d(0,0,0);
    }
    50% {
        transform: translate3d(50%,.5em,0);
    }
    100% {
        transform: translate3d(100%,0,0);
    }
}
</style>



