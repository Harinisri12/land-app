<script lang="ts">
  import axios from 'axios';
  import { createClient } from '@supabase/supabase-js';

  // Initialize Supabase client
  const supabaseUrl = 'https://vnxssnraatizgesaxnxd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueHNzbnJhYXRpemdlc2F4bnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2Mjg4MTUsImV4cCI6MjAzNzIwNDgxNX0.eAXWdTlFhjuqiP9svB952PepS6SJJnGJBEVFLMxb0LQ';
  const supabase = createClient(supabaseUrl, supabaseKey);

  let propertyId = '';
  let latitude = '';
  let longitude = '';
  let areaCity = '';
  let selectedState = '';
  let ownerPublicAddress = '';
  let defaultBidAmount = '';
  let errorMessage = '';
  let message = '';

  // List of states for selection
  let states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
    // Add other states here...
  ];

  // Function to fetch property details from blockchain
  const fetchData = async () => {
    if (!propertyId) return;

    try {
      const transactionId = await getTransactionIdByPropertyId(propertyId);
      if (!transactionId) {
        errorMessage = 'No transaction found for this property ID.';
        return;
      }

      const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${transactionId}`, {
        headers: { 'woc-api-key': 'mainnet_fec64d0de8224e1caeba7164d70928f9' }
      });

      const transactionData = response.data;
      const content = transactionData.vout[0];
      const final = content.scriptPubKey.asm;

      function hexToAscii(hex: string): string {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
        }
        return str;
      }

      // Decode the data based on the expected format
      const parts = final.split(' ');
      const hexStrings = parts.filter(part => /^[0-9a-fA-F]+$/.test(part));
      const decodedData = hexStrings.map(hex => hexToAscii(hex));

      // Convert data to correct formats
      latitude = decodeURIComponent(escape(decodedData[1] || ''));
      longitude = decodeURIComponent(escape(decodedData[2] || ''));
      areaCity = decodeURIComponent(escape(decodedData[3] || ''));
      selectedState = decodeURIComponent(escape(decodedData[4] || ''));
      ownerPublicAddress = hexStrings[5] || '';
      defaultBidAmount = hexStrings[6] || '';

    } catch (error) {
      console.error("Error fetching data:", error);
      errorMessage = 'Failed to fetch property details.';
    }
  };

  // Function to fetch transaction ID by Property ID
  async function getTransactionIdByPropertyId(propertyId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('txid')
      .eq('propertyId', propertyId)
      .single();

    if (error) {
      console.error('Error fetching transaction ID:', error);
      return null;
    }

    return data?.txid;
  }

  // Function to update property
  const updateProperty = async () => {
    try {
      if (!propertyId || !latitude || !longitude || !areaCity || !selectedState || !ownerPublicAddress || !defaultBidAmount) {
        errorMessage = 'All fields are required!';
        return;
      }

      // Add logic to update the property
    } catch (error) {
      console.error('Error updating property:', error);
      errorMessage = 'Failed to update property.';
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!propertyId || !latitude || !longitude || !areaCity || !selectedState || !ownerPublicAddress || !defaultBidAmount) {
      errorMessage = 'All fields are required!';
      return;
    }

    message = 'Deploying...........';

    const form = new FormData();
    form.append('propertyId', propertyId);
    form.append('latitude', latitude);
    form.append('longitude', longitude);
    form.append('areaCity', areaCity);
    form.append('state', selectedState);
    form.append('ownerPublicAddress', ownerPublicAddress);
    form.append('defaultBidAmount', defaultBidAmount);

    try {
      const response = await fetch('?/deploy', {
        method: 'POST',
        body: form
      });

      const result = await response.json();
      const final: [object, boolean, string] = JSON.parse(result.data);

      if (final[1]) {
        message = `Smart contract deployed: https://whatsonchain.com/tx/`+final[2];

        await storeTxid(propertyId, final[2],latitude, longitude );
      
      } else {
        message = `Deployment failed: ${final[2]}`;
      }
    } catch (error) {
      console.error(error);
      message = 'Failed to upload document or deploy contract.';
    }
  };

  // Function to store transaction ID
  async function storeTxid(propertyId: string, txid: string) {
    const { error } = await supabase
      .from('transactions')
      .upsert({ propertyId, txid });

    if (error) {
      console.error('Error storing transaction ID:', error);
    }
  }
</script>

<nav class="navbar">
  <div class="navbar-content">
    <ul class="navbar-menu">
      <li><p>Update Property</p></li>
      <li class="top-right">
        <a href="/dashboard" class="navbar-link" aria-current="page">Go to dashboard</a>
      </li>
    </ul>
  </div>
</nav>

<main>
  <h1 class="title">Update Existing Property</h1>

  <!-- Fetch Property Details Form -->
  <form on:submit|preventDefault={fetchData} class="form">
    <div class="form-group">
      <label for="propertyId">Property ID:</label>
      <input id="propertyId" type="text" bind:value={propertyId} placeholder="Enter Property ID" required class="form-input" />
    </div>
    <button type="submit" class="form-button">Fetch Details</button>
  </form>

  <!-- Display Property Details Form -->
  {#if propertyId}
    <form on:submit|preventDefault={handleSubmit} class="form">
      <div class="form-group">
        <label for="latitude">Latitude:</label>
        <input id="latitude" type="text" bind:value={latitude} placeholder="Latitude" class="form-input" />
      </div>
      <div class="form-group">
        <label for="longitude">Longitude:</label>
        <input id="longitude" type="text" bind:value={longitude} placeholder="Longitude" class="form-input" />
      </div>
      <div class="form-group">
        <label for="areaCity">Area/City:</label>
        <input id="areaCity" type="text" bind:value={areaCity} placeholder="Area/City" class="form-input" />
      </div>
      <div class="form-group">
        <label for="state">State:</label>
        <select id="state" bind:value={selectedState} class="form-select">
          {#each states as state}
            <option value={state}>{state}</option>
          {/each}
        </select>
      </div>
      <div class="form-group">
        <label for="ownerPublicAddress">Owner Public Address:</label>
        <input id="ownerPublicAddress" type="text" bind:value={ownerPublicAddress} placeholder="Owner Public Address" class="form-input" />
      </div>
      <div class="form-group">
        <label for="defaultBidAmount">Default Bid Amount:</label>
        <input id="defaultBidAmount" type="text" bind:value={defaultBidAmount} placeholder="Default Bid Amount" class="form-input" />
      </div>
      <button type="submit" class="form-button">Update Property</button>
    </form>
  {/if}

  <!-- Error and Message Display -->
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  {#if message}
    <p class="message">{message}</p>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  h1 {
    margin-bottom: 20px;
    color: #333;
  }

  form {
    width: 100%;
    max-width: 600px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
    color: #333;
  }

  .form-group input, 
  .form-group select {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .form-group input[type="number"] {
    -moz-appearance: textfield;
  }

  .form-group input[type="number"]::-webkit-inner-spin-button,
  .form-group input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  button {
    width: 100%;
    max-width: 200px;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .top-right {
     position: absolute;
     top: 0;
     right: 0;}

  button:hover {
    background-color: #0056b3;
  }

  .error, .message {
    text-align: center;
    margin-top: 10px;
  }

  .error {
    color: #d9534f;
  }

  .message {
    color: #5bc0de;
  }
</style>
