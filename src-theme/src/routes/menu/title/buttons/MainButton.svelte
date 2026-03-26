<script lang="ts">
    import { subtleFade, subtleFly } from "../../../../lib/transitions";
    import {createEventDispatcher} from "svelte";
    import { setForceFastTransitions } from "../../../../lib/transitions/config";

    export let title: string;
    export let icon: string;
    export let index: number;

    let hovered = false;

    const dispatch = createEventDispatcher();

    function handleClick() {
        // ensure transitions become fast immediately so outros don't stagger
        try {
            setForceFastTransitions(true);
        } catch (e) {}

        // also disable CSS transitions globally for a short window so CSS-based
        // animations (background-position, etc.) don't add ~200ms pauses
        try {
            document.documentElement.classList.add('lb-fast-transitions');
        } catch (e) {}

        // restore after a short window in case navigation doesn't happen
        setTimeout(() => {
            try { setForceFastTransitions(false); } catch (e) {}
            try { document.documentElement.classList.remove('lb-fast-transitions'); } catch (e) {}
        }, 500);

        hovered = false;
        dispatch("click");
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="main-button" on:mouseenter={() => hovered = true} on:mouseleave={() => hovered = false} on:click={handleClick}
     out:subtleFly|global={{duration: 160, y: -10, delay: index * 15, baseOpacity: 0.9}}
     in:subtleFly|global={{duration: 160, y: -10, delay: index * 15, baseOpacity: 0.9}}>
    <div class="icon">
        {#if !hovered}
            <img transition:subtleFade={{duration: 140, base: 0.85}} src="img/menu/icon-{icon}.svg" alt={icon}>
        {:else}
            <img transition:subtleFade={{duration: 140, base: 0.85}} src="img/menu/icon-{icon}-hover.svg" alt={icon}>
        {/if}
    </div>

    <div class="title">{title}</div>

    <div class="wrapped-content">
        <slot parentHovered={hovered}/>
    </div>
</div>

<style lang="scss">
  @use "../../../../colors.scss" as *;

  .main-button {
    background-color: rgba($menu-base-color, 0.68);
    width: 590px;
    padding: 25px 35px;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    column-gap: 25px;

    background: linear-gradient(to left, rgba($menu-base-color, .68) 50%, $accent-color 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    will-change: background-position;
    transition: background-position .2s ease-out;

    &:hover {
      background-position: left bottom;

      .icon {
        background-color: $menu-text-color;
      }
    }
  }

  .icon {
    background-color: $accent-color;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    transition: ease background-color 0.2s;
    position: relative;

    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .title {
    font-size: 26px;
    color: $menu-text-color;
    font-weight: 600;
  }
</style>
