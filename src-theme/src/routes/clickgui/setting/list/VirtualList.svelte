<!-- Adapted from https://github.com/sveltejs/svelte-virtual-list -->
<script lang="ts">
    import {onMount, tick} from 'svelte';
    // props
    export let items: any[] = [];
    export let height: string = '100%';
    export let itemHeight: number | undefined = undefined;
    // read-only, but visible to consumers via bind:start
    export let start: number = 0;
    export let end: number = 0;
    // local state
    let height_map: number[] = [];
    let rows: HTMLCollectionOf<Element> | null = null;
    let viewport: HTMLElement | null = null;
    let contents: HTMLElement | null = null;
    let viewport_height: number = 0;
    let visible: { index: number; data: any }[] = [];
    let mounted: boolean = false;
    let top: number = 0;
    let bottom: number = 0;
    let average_height: number = 0;
    $: visible = items.slice(start, end).map((data: any, i: number) => {
        return { index: i + start, data };
    });
    // whenever `items` changes, invalidate the current heightmap
    $: if (mounted) refresh(items, viewport_height, itemHeight);
    async function refresh(items: any[], viewport_height: number, itemHeight?: number) {
        const { scrollTop } = viewport as HTMLElement;
        await tick(); // wait until the DOM is up to date
        let content_height = top - scrollTop;
        let i = start;
        while (content_height < viewport_height && i < items.length) {
            let row = rows ? rows[i - start] : undefined;
            if (!row) {
                end = i + 1;
                await tick(); // render the newly visible row
                row = rows ? rows[i - start] : undefined;
            }
            const row_height = height_map[i] = itemHeight || (row ? (row as HTMLElement).offsetHeight : 0);
            content_height += row_height;
            i += 1;
        }
        end = i;
        const remaining = items.length - end;
        average_height = (top + content_height) / end;
        bottom = remaining * average_height;
        height_map.length = items.length;

        setTimeout(() => {
            if (viewport) viewport.scrollTop = 0;
        }, 100);
    }
    async function handle_scroll() {
        const { scrollTop } = viewport as HTMLElement;
        const old_start = start;
        if (rows) {
            for (let v = 0; v < rows.length; v += 1) {
                height_map[start + v] = itemHeight || (rows[v] as HTMLElement).offsetHeight;
            }
        }
        let i = 0;
        let y = 0;
        while (i < items.length) {
            const row_height = height_map[i] || average_height;
            if (y + row_height > scrollTop) {
                start = i;
                top = y;
                break;
            }
            y += row_height;
            i += 1;
        }
        while (i < items.length) {
            y += height_map[i] || average_height;
            i += 1;
            if (y > scrollTop + viewport_height) break;
        }
        end = i;
        const remaining = items.length - end;
        average_height = y / end;
        while (i < items.length) height_map[i++] = average_height;
        bottom = remaining * average_height;
        // prevent jumping if we scrolled up into unknown territory
        if (start < old_start) {
            await tick();
            let expected_height = 0;
            let actual_height = 0;
            for (let i = start; i < old_start; i +=1) {
                if (rows && rows[i - start]) {
                    expected_height += height_map[i];
                    actual_height += itemHeight || (rows[i - start] as HTMLElement).offsetHeight;
                }
            }
            const d = actual_height - expected_height;
            if (viewport) viewport.scrollTo(0, scrollTop + d);
        }
        // TODO if we overestimated the space these
        // rows would occupy we may need to add some
        // more. maybe we can just call handle_scroll again?
    }
    // trigger initial refresh
    onMount(() => {
        rows = contents ? contents.getElementsByTagName('svelte-virtual-list-row') : null;
        mounted = true;
    });
</script>

<style>
    svelte-virtual-list-viewport {
        position: relative;
        overflow-y: auto;
        -webkit-overflow-scrolling:touch;
        display: block;
    }
    svelte-virtual-list-contents, svelte-virtual-list-row {
        display: block;
    }
    svelte-virtual-list-row {
        overflow: hidden;
    }
</style>

<svelte-virtual-list-viewport
        bind:this={viewport}
        bind:offsetHeight={viewport_height}
        on:scroll={handle_scroll}
        style="height: {height};"
>
    <svelte-virtual-list-contents
            bind:this={contents}
            style="padding-top: {top}px; padding-bottom: {bottom}px;"
    >
        {#each visible as row (row.index)}
            <svelte-virtual-list-row>
                <slot item={row.data}>Missing template</slot>
            </svelte-virtual-list-row>
        {/each}
    </svelte-virtual-list-contents>
</svelte-virtual-list-viewport>
