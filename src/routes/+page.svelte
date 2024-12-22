<script lang="ts">
	import Footer from '$lib/components/navigation/Footer.svelte';
	import Hero from '$lib/components/navigation/Hero.svelte';
    // import { createClient } from "@supabase/supabase-js";

    // export const supabase = createClient(
    //     "https://uyqjlzjcrniklqwqzwek.supabase.co",
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cWpsempjcm5pa2xxd3F6d2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTI0NDQsImV4cCI6MjA0OTU2ODQ0NH0.rd4i_sbarTEWz9eS93V0dP3mFHuH5CVLD8V_jR1DO70"
    // )

    // async function getUser() {
    //     console.log(await supabase.auth.getUser())
    // }
</script>

<div class="flex h-screen w-screen flex-col">
	<!-- Hero -->
	<Hero />

	<!-- Login -->
	<section class="h-full grow">
		<form method="POST">
			<button>Sign In Server</button>
		</form>
        <!-- <button on:click={getUser}>Get User</button> -->
	</section>

	<!-- Footer -->
	<Footer />
</div>
