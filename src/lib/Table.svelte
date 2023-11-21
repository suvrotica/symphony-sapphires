<script>
	/**
	 * @type {{id: string, name: string, email: string, image: string, createdAt: string}[]}
	 */
	export let users;
	/**
	 * @type {number}
	 */
	export let duration;

	/**
	 * @param {string | number | Date} timestamp
	 * @param {undefined} [timeOnly]
	 */
	function timeAgo(timestamp, timeOnly) {
		if (!timestamp) return 'never';
		return `${Date.now() - new Date(timestamp).getTime()}${timeOnly ? '' : ' ago'}`;
	}
	function refreshPage() {
		location.reload();
	}
</script>

<div>
	<table>
		<caption>User Details</caption>
		<thead>
			<tr>
				<th scope="col">Image</th>
				<th scope="col">Name</th>
				<th scope="col">Email</th>
				<th scope="col">Joined</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user (user.id)}
				<tr>
					<td>
						<img src={user.image} alt={`Image of ${user.name}`} width="48" height="48" />
					</td>
					<td>{user.name}</td>
					<td>{user.email}</td>
					<td>{timeAgo(user.createdAt)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
