<script lang="ts">
    import Header from "./header/Header.svelte";
    import { subtleFly } from "../../../lib/transitions";

    export let transitionDuration: number = 300; // default entrance duration in ms
</script>

<div class="menu">
    <div transition:subtleFly|global={{duration: transitionDuration, y: -60, baseOpacity: 0.92}}>
        <Header/>
    </div>

    <div class="menu-wrapper">
        <slot/>
    </div>
</div>

<style lang="scss">
  :global(.lb-fast-transitions) * {
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
  .menu {
    padding: 50px;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .menu-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    will-change: transform;
  }

  @media screen and (max-width: 1366px) {
    .menu {
      zoom: 0.8;
      height: 125vh;
    }
  }

  @media screen and (max-width: 1200px) {
    .menu {
      zoom: 0.5;
      height: 200vh;
    }
  }

  @media screen and (max-height: 1100px) {
    .menu {
      zoom: 0.8;
      height: 125vh;
    }
  }

  @media screen and (max-height: 700px) {
    .menu {
      zoom: 0.5;
      height: 200vh;
    }
  }

  @media screen and (max-height: 540px) {
    .menu {
      zoom: 0.4;
      height: 250vh;
    }
  }
</style>
