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
  let area = '';
  let state = '';
  let ownerPublicAddress = '';
  let bidAmount = '';
  let errorMessage = '';
  let states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
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
        headers: { 'woc-api-key': 'mainnet_fec64d0de8224e1caeba7164d70928f9' } // Replace with your actual API key
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
      area = decodeURIComponent(escape(decodedData[3] || ''));
      state = decodeURIComponent(escape(decodedData[4] || ''));
      ownerPublicAddress = hexStrings[5] || '';
      bidAmount = hexStrings[6] || '';

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
      errorMessage = `Error: ${error.message}`;
      return null;
    }

    if (!data) {
      errorMessage = 'No transaction found for this property ID.';
      return null;
    }

    return data.txid;
  }

  // Function to handle form submission
  async function handleSubmit() {
    errorMessage = '';
    await fetchData();
  }
</script>

<nav class="bg-gray-200 border-gray-200">
    <!-- <p>Issue New Property</p> -->
    <div class=" bg-gray-200 hidden w-full md:block md:w-auto" id="navbar-default">
      
          <ul class=" font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-200  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            <li><p>Issue New Property</p></li>
            <li class="top-right">
              <a href="/dashboard" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0" aria-current="page">Go to dashboard</a>
            </li>
            
            
          </ul>
          </div>
  </nav>

<style>
  .container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    color: black;
  }

  .container h1 {
    text-align: center;
  }

  .form-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .form-group label {
    width: 150px;
    margin-right: 10px;
    color: black;
  }

  input, select {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    color: black;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  button {
    width: 20%;
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .message {
    margin-top: 20px;
    color: #007bff;
  }

  .top-right {
     position: absolute;
     top: 0;
     right: 0;}
</style>

<div class="container">
  <h1>Update Existing Property</h1>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="propertyId">Property ID:</label>
      <input type="text" id="propertyId" bind:value={propertyId} placeholder="Enter Property ID" />
    </div>
    <div class="form-group">
      <label for="latitude">Latitude:</label>
      <input type="text" id="latitude" bind:value={latitude} />
    </div>
    <div class="form-group">
      <label for="longitude">Longitude:</label>
      <input type="text" id="longitude" bind:value={longitude} />
    </div>
    <div class="form-group">
      <label for="area">Area:</label>
      <input type="text" id="area" bind:value={area} />
    </div>
    <div class="form-group">
      <label for="state">State:</label>
      <select id="state" bind:value={state}>
        <option value="" disabled>Select a state</option>
        {#each states as state}
          <option value={state}>{state}</option>
        {/each}
      </select>
    </div>
    <div class="form-group">
      <label for="ownerPublicAddress">Owner Public Address:</label>
      <input type="text" id="ownerPublicAddress" bind:value={ownerPublicAddress} />
    </div>
    <div class="form-group">
      <label for="bidAmount">Bid Amount:</label>
      <input type="number" id="bidAmount" bind:value={bidAmount} />
    </div>
    <div class="button-container">
      <button type="submit">Update</button>
    </div>
    {#if errorMessage}
      <p class="message">{errorMessage}</p>
    {/if}
  </form>
</div>
