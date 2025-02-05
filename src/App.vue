<template>
	<h1>Lets Hunt!</h1>
	<div>
		<button @click="hunting = !hunting; if (hunting) failures = 0" style="margin-right: 20px">
			{{ !hunting ? "Start Hunting" : "Stop Hunting" }}
		</button>
		<button @click="stop = !stop" style="margin-right: 20px">
			{{ !stop ? "Stop on Error" : "Ignore Errors" }}
		</button>
		<button @click="fastify = !fastify; if (hunting) failures = 0">
			{{ fastify ? "Use Express JS" : "Use Fastify" }}
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
			"fastify": true,
			"hunting": false,
			"stop": false,
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
		async bug_hunt() {
			await useFetch(
				this.fastify ? "http://localhost:5001/hunt" : "http://localhost:5000/hunt",
				{ "method": "GET" } as RequestInit, { timeout: 600000 }
			).then(res => {
				if (res.error.value) {
					if (this.stop) this.hunting = false;
					this.failures += 1;
					return;
				}
			});
		}
	}
});
</script>
