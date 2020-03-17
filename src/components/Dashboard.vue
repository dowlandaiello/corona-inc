<template>
	<p>lulw</p>
</template>

<script>
import axios from 'axios';

export default {
	name: 'Dashboard',
	props: ['api-endpoint'],
	data() {
		const infectionsByCountr = fetch(`${this.apiEndpoint}/countries`)
			.then(response => response.json())
			.then(countryData => console.log(countryData));

		return {};
	},
};
</script>
