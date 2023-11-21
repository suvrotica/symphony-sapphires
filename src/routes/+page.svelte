<script>
	import Table from '$lib/Table.svelte';
	export let data;
</script>

<main class="container">
	<Table users={data?.users} duration={data?.duration} />
</main>
