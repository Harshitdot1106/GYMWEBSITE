import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User } from '@/types/user';

// Define interface matching your database schema
interface Membership {
  NAME: string;
  DURATION: string;
  PRICE: string;
  FEATURES: string;
}
interface HomePageProps {
  user: User ; // Allowing the user to be null initially
}
const PricingPlans = ({ user }: HomePageProps) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joinedMessage, setJoinedMessage] = useState<string>('');

  useEffect(() => {
    const fetchMemberships = async (): Promise<void> => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:300/api/membership');
        
        if (!response.ok) {
          throw new Error('Failed to fetch membership data');
        }
        
        const data: Membership[] = await response.json();
        setMemberships(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const handleJoin = async (membershipName: string): Promise<void> => {
     // Replace with real user email from context or auth
     const userString = localStorage.getItem('user');
     const User = userString ? JSON.parse(userString) : null;
     console.log('User:', User); // Log the user to check its structure
  const membership = membershipName;
   // Log the user object to check its structure
    console.log('User email:', User.MEMAIL); // Log the user email to check its structure
  // Log the user email to check its structure
    try {
      if (!User) {
        throw new Error('User not found');
      }
      const response = await fetch('http://localhost:300/api/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: User.MEMAIL, membership: membership }),
      });
  
      setJoinedMessage(`🎉 Member Joined the ${membershipName} Plan!`);
      setTimeout(() => setJoinedMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setJoinedMessage('❌ Failed to join membership. Please try again.');
      setTimeout(() => setJoinedMessage(''), 3000);
    }
  };
  

  // Display loading state
  if (loading) {
    return (
      <div className="h-screen bg-white flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl font-semibold">Loading membership plans...</div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="h-screen bg-white flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl font-semibold text-red-600">
            Error: {error}. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get highlight status based on membership name
  const getHighlightStatus = (name: string): boolean => {
    return name === 'GOLD'; // GOLD is the highlighted plan
  };

  // Helper function to get image based on membership name
  const getImageForMembership = (name: string): string => {
    switch (name) {
      case 'SILVER':
        return '/assets/flexi.png';
      case 'GOLD':
        return '/assets/allaccess.png';
      case 'PLATINUM':
        return '/assets/offpeak.png';
      default:
        return '/api/placeholder/64/64';
    }
  };

  // Helper function to parse features from database string
  const parseFeatures = (featuresString: string): string[] => {
    // This assumes features are stored as a single string in the database
    // You may need to adjust this based on how features are actually stored
    const mainFeature = featuresString;
    return [
      `✔ ${mainFeature}`,
      `✔ ${mainFeature === '12 Classes Per Month' ? '3 Classes Per Week' : 
          mainFeature === '20 Classes Per Month' ? '3 Classes Per Day' : 
          '5 Classes Per Week'}`,
      '✔ No joining fees'
    ];
  };

  return (
    <div className="h-screen bg-white flex">
      <Sidebar />
      <div className="overflow-y-auto p-8 w-full">
        {joinedMessage && (
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold text-center mb-6 shadow-lg transition-all duration-300">
            {joinedMessage}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mt-10">
          {memberships.map((membership) => {
            const isHighlighted = getHighlightStatus(membership.NAME);
            
            const features = parseFeatures(membership.FEATURES);

            return (
              <div
                key={membership.NAME}
                className={`bg-black text-white p-8 rounded-lg flex flex-col items-center ${
                  isHighlighted ? 'shadow-xl scale-105 p-10' : ''
                }`}
              >
                <h2 className="text-xl font-bold uppercase">{membership.NAME}</h2>
                <img 
                 
                  alt={`${membership.NAME} Icon`} 
                  className="w-16 my-4" 
                />
                <p className="text-2xl font-bold"> Rs. {membership.PRICE}</p>
                <ul className="mt-4 space-y-2 text-gray-200 text-center">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button
  onClick={() => handleJoin(membership.NAME)}
  className="mt-6 bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg"
>
  JOIN TODAY
</button>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;