<script lang="ts">
  import type { PageData } from "./$types.js";
  import Navbar from '$lib/Navbar.svelte';
  import Footer from '$lib/Footer.svelte';
  import { page } from '$app/stores';

  let email: string | null = null;

  page.subscribe((p) => {
    if (p.url.searchParams.has('email')) {
      email = p.url.searchParams.get('email');
    }
  });
  console.log(email);
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  overflow: hidden; 
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative; 
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

.submenu {
  display: none;
}

.sidebar a:hover .submenu {
  display: block;
}

.submenu a {
  display: block;
  padding: 10px 40px;
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-size: 16px; 
}

.main-content {
  margin-left: 250px;
  padding: 80px 20px 20px 20px; 
  background-color: transparent; 
  box-sizing: border-box;
  overflow-y: auto; 
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
  left: 60.2%;
  width: 86.5%; 
  height: auto; 
  transform: translateX(-50%); 
  z-index: 1; 
}

footer {
  position: relative;
  z-index: 2; 
  margin-top: 0; 
}
</style>

<Navbar />

<div class="container">
  <div class="content">
    <nav class="sidebar">
      <a href="#">
        Property Issuance
        <div class="submenu">
          <a href="#">Issue New Property</a>
          <a href="#">Update Existing Property</a>
        </div>
      </a>
      <a href="#">
        Public Map
        <div class="submenu">
          <a href="#">Explore Properties</a>
          <a href="#">View Property Details</a>
        </div>
      </a>
    </nav>

    <div class="main-content">
      <div class="content-wrapper">
        <h1>Dashboard</h1>
        <p>Welcome</p>
        <p>{email}!</p>
      </div>
    </div>
  </div>
</div>

<img src="https://i.imgur.com/O2YqJJZ.png" alt="Decorative border" class="footer-image" />

<Footer />
