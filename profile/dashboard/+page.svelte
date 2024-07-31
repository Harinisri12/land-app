<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import Navbar from '$lib/Navbar.svelte';
  import Footer from '$lib/Footer.svelte';

  // Supabase client setup
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = 'https://vnxssnraatizgesaxnxd.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueHNzbnJhYXRpemdlc2F4bnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2Mjg4MTUsImV4cCI6MjAzNzIwNDgxNX0.eAXWdTlFhjuqiP9svB952PepS6SJJnGJBEVFLMxb0LQ';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let email: string | null = null;
  const landAuthority: string[] = [
    'keerthana.birelli@gmail.com',
    'kittu.birelli@gmail.com',
    'sales@timechainlabs.io',
    'authorize@example.com'
  ];

  // Function to handle logout
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redirects to the home page using href
  }

  // Check authority function
  function checkAuthority(event: Event) {
    const mouseEvent = event as MouseEvent;
    if (email && !landAuthority.includes(email)) {
      mouseEvent.preventDefault();
      alert("Only land authorities can issue and update the property");
    }
  }

  // Subscribe to page store to get the email parameter
  onMount(() => {
    const links = document.querySelectorAll('.check-authority');
    links.forEach(link => {
      link.addEventListener('click', checkAuthority);
    });
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('email')) {
      email = urlParams.get('email');
    }
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .content {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }

  .sidebar {
    width: 250px;
    background-color: #e5e7eb;
    color: white;
    position: fixed;
    top: 60px;
    bottom: 0;
    left: 0;
    padding-top: 20px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .sidebar a {
    display: block;
    padding: 15px 20px;
    color: rgb(0, 0, 0);
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
  }

  .sidebar a:hover {
    background-color: #d1d5db;
  }

  .submenu a {
    display: block;
    padding: 10px 40px;
    color: rgb(0, 0, 0);
    text-decoration: none;
    font-size: 16px;
  }

  .submenu {
    display: none;
  }

  .sidebar a:hover .submenu {
    display: block;
  }

  .main-content {
    margin-left: 250px;
    padding: 80px 20px 20px 20px;
    background-color: transparent;
    box-sizing: border-box;
    overflow: hidden;
    flex-grow: 1;
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
    position: relative;
  }

  h1 {
    font-size: 48px;
    font-weight: bold;
    color: #2c3e50;
  }

  p {
    font-size: 24px;
    color: #2c3e50;
  }

  .footer-image {
    position: absolute;
    bottom: -80px;
    left: 50%;
    width: 100%;
    height: auto;
    transform: translateX(-50%);
    z-index: -1;
  }

  .footer-container {
    position: relative;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
</style>

<Navbar />

<div class="container">
  <div class="content">
    <nav class="sidebar">
      <a href="#" class="check-authority">
        Property Issuance
        <div class="submenu">
          <a href="/dashboard/propertyIssuance" class="check-authority">Issue New Property</a>
          <a href="/dashboard/update" class="check-authority">Update Existing Property</a>
        </div>
      </a>
      <a href="#">Public Map</a>
    </nav>

    <div class="main-content">
      <div class="content-wrapper">
        <h1 class="text-blue-400">Dashboard</h1>
        <p>Welcome</p>
        {#if email}
          <p>{email}!</p>
        {/if}
        <div class="button-group">
          <Button on:click={() => goto(`/dashboard/profile${email ? `?email=${email}` : ''}`)}>Profile</Button>
          <Button on:click={logout}>Log out</Button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="footer-container">
  <img src="https://i.imgur.com/O2YqJJZ.png" alt="Decorative border" class="footer-image" />
</div>
<Footer />
