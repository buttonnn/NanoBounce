<script lang="ts">
    import {fly} from "../../../../lib/transitions";
</script>

<div class="bottom-button-wrapper" transition:fly|global={{duration: 700, y: 100}}>
    <slot/>
</div>

<style lang="scss">
  .bottom-button-wrapper {
    display: flex;
    justify-content: space-between;
  }
</style>
