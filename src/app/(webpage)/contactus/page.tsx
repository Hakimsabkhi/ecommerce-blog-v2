export const dynamic = 'force-dynamic'; // Ensure the page is dynamically rendered

import Contactusbanner from '@/components/contactusbanner';
import Milanotorino from '@/components/milanotorino';
import React from 'react';

// Fetch company data from the API
async function fetchCompanyData() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/websiteinfo/getwebsiteinfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', 
      next: { revalidate: 0 },// Fetch fresh data on every request
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} - ${res.statusText}`);
      return null; // Return null if the request fails
    }

    const data = await res.json();
    return data; // Parse and return the JSON data
  } catch (error) {
    console.error('Unexpected Error Fetching Company Data:', error);
    return null; // Handle unexpected errors
  }
}

const Page = async () => {
  const companyData = await fetchCompanyData();

  return (
    <div>
      <Contactusbanner companyData={companyData} />
      <Milanotorino />
    </div>
  );
};

export default Page;
