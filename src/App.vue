<template>
	<h1>Lets Hunt!</h1>
	<div>
		<button @click="hunting = !hunting; if (hunting) failures = 0" style="margin-right: 20px">
			{{ !hunting ? "Start Hunting" : "Stop Hunting" }}
		</button>
	</div>
	<h1>Content Decoding Failure x{{ failures }}</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useFetch } from "@vueuse/core";

export default defineComponent ({
	data() {
		return {
			"hunting": false,
			"failures": 0 
		};
	},
	mounted() {
		setInterval(() => {
			if (this.hunting)
				void this.bug_hunt();
		},10);
	},
	methods: {
		bug_hunt() {
			useFetch("http://localhost:5000/hunt", {
				"method": "GET"
			} as RequestInit, { timeout: 600000 }
			).then(res => {
				if (res.error.value) this.failures += 1;
			});
		}
	}
});
</script>
