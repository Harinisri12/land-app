<script lang="ts">
    import { page } from '$app/stores';
    import { createClient } from '@supabase/supabase-js';
    import { onMount } from 'svelte'; // Import onMount
    // Supabase client setup
    const SUPABASE_URL = 'https://vnxssnraatizgesaxnxd.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueHNzbnJhYXRpemdlc2F4bnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2Mjg4MTUsImV4cCI6MjAzNzIwNDgxNX0.eAXWdTlFhjuqiP9svB952PepS6SJJnGJBEVFLMxb0LQ';
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
    let email: string | null = null;
  let userUID: string | null = null;

  // Extract email from query parameters
  $: {
    const query = new URLSearchParams($page.url.search);
    email = query.get('email');
  }

  // Fetch current user UID based on email
  onMount(async () => {
    // Get the current user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching current user:', error);
    } else if (user) {
      userUID = user.id;
      console.log('Current User UID:', userUID);
    } else {
      console.log('No user is authenticated');
    }

    if (email) {
      // Fetch UID based on email from the Users table
      const { data, error } = await supabase
        .from('Users')
        .select('User UID')
        .eq('Email', email)
        .single(); // Use single() to get a single result

      if (error) {
        console.error('Error fetching user UID from Users table:', error);
      } else {
        userUID = data ? data['User UID'] : null;
      }
    }
  });
</script>

<style>
  /* General Styles */
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    color: #333;
  }

  h1 {
    font-size: 32px;
    color: #2c3e50; /* Dark blue */
    margin-bottom: 10px;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .profile-header {
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  .profile-header h1 {
    margin: 0;
    font-size: 28px;
    color: #007bff; /* Bright blue */
  }

  .profile-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    border-left: 5px solid #007bff; /* Blue accent */
  }

  .profile-content p {
    font-size: 18px;
    margin: 10px 0;
    color: #555;
  }

  .footer-container {
    position: relative;
    margin-top: 20px;
  }

  .footer-image {
    width: 100%;
    height: auto;
    display: block;
    margin-top: 20px;
  }
</style>

<div class="container">
  <div class="profile-header">
    <h1>Profile </h1>
  </div>
  <div class="profile-content">
    {#if email}
      <p><strong>Email:</strong> {email}</p>
      {#if userUID}
        <p><strong>User UID:</strong> {userUID}</p>
      {:else}
        <p>User UID not found</p>
      {/if}
    {:else}
      <p>No email provided</p>
    {/if}
  </div>
</div>
