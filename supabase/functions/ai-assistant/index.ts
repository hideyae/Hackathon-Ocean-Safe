import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RequestBody {
  message: string;
  context?: {
    activity?: string;
    location?: string;
    oceanData?: any;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, context }: RequestBody = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const responses = generateIntelligentResponse(message, context);
    const response = responses[Math.floor(Math.random() * responses.length)];

    return new Response(
      JSON.stringify({ response }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in AI assistant:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateIntelligentResponse(message: string, context?: any): string[] {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('safe') || lowerMessage.includes('safety')) {
    return [
      'Safety should always be your top priority! Check current conditions, wear appropriate gear, and never go alone. Always inform someone of your plans.',
      'Ocean safety tips: Always check weather forecasts, be aware of rip currents, wear a life jacket, and know your swimming abilities.',
      'Remember the buddy system! Never venture into the ocean alone. Having a partner can be lifesaving in emergencies.',
    ];
  }

  if (lowerMessage.includes('wave') || lowerMessage.includes('surf')) {
    return [
      'Wave conditions vary throughout the day. Check the swell period and direction for the best surfing conditions. A longer period typically means more powerful waves.',
      'For surfing, look for offshore winds and a good swell. Beginners should stick to waves under 1.5 meters.',
      'Wave height is just one factor - also consider wave period, wind direction, and tides for optimal surfing conditions.',
    ];
  }

  if (lowerMessage.includes('wind') || lowerMessage.includes('weather')) {
    return [
      'Wind speed and direction significantly affect ocean activities. Offshore winds are ideal for surfing, while light winds are best for kayaking and swimming.',
      'Check the forecast for sudden weather changes. Storms can develop quickly over water. If you see dark clouds or hear thunder, get out of the water immediately.',
      'Wind creates waves and affects visibility. For diving, calm conditions with minimal wind are ideal.',
    ];
  }

  if (lowerMessage.includes('dive') || lowerMessage.includes('diving')) {
    return [
      'For diving, you need excellent visibility (over 20m), calm currents, and comfortable water temperature. Always dive with a certified buddy.',
      'Check your equipment before every dive. Ensure your air supply is full, your regulator works properly, and your dive computer is functioning.',
      'Never dive beyond your certification level. Respect depth limits and always perform a safety stop at 5 meters for 3 minutes.',
    ];
  }

  if (lowerMessage.includes('tide') || lowerMessage.includes('current')) {
    return [
      'Tides significantly affect ocean activities. High tide is often better for swimming and diving, while low tide exposes tide pools for exploration.',
      'Be aware of tidal currents, especially near inlets and jetties. These can be very strong and dangerous during tidal changes.',
      'Plan your activities around tide times. Some beaches are only accessible during low tide, while others are better at high tide.',
    ];
  }

  if (lowerMessage.includes('fish') || lowerMessage.includes('fishing')) {
    return [
      'Fishing is often best during tide changes and early morning or late afternoon. Check local regulations for size and bag limits.',
      'Different species prefer different conditions. Research what fish are common in your area and what conditions they prefer.',
      'Always use appropriate tackle and techniques for the species you\'re targeting. Respect catch limits and practice sustainable fishing.',
    ];
  }

  if (lowerMessage.includes('temperature') || lowerMessage.includes('cold') || lowerMessage.includes('warm')) {
    return [
      'Water temperature affects how long you can safely stay in the ocean. Below 20°C, consider wearing a wetsuit. Below 15°C, a wetsuit is essential.',
      'Hypothermia can occur even in relatively warm water if you stay in long enough. Monitor your body temperature and exit if you start shivering.',
      'Warmer water (above 25°C) is more comfortable but requires sun protection and hydration. Apply waterproof sunscreen regularly.',
    ];
  }

  if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
    return [
      'Starting a new ocean activity? Take lessons from certified instructors, start in calm conditions, and gradually build your skills and confidence.',
      'Every ocean activity has its learning curve. Don\'t rush - focus on mastering basics before advancing to challenging conditions.',
      'Join local clubs or groups for your activity. Experienced members can provide valuable guidance and safety support.',
    ];
  }

  if (lowerMessage.includes('equipment') || lowerMessage.includes('gear')) {
    return [
      'Proper equipment is essential for safety and enjoyment. Invest in quality gear appropriate for your skill level and local conditions.',
      'Always inspect your equipment before use. Check for wear, damage, or malfunction. Replace any questionable items.',
      'Rent equipment before buying if you\'re new to an activity. This helps you understand what features you need.',
    ];
  }

  return [
    'I\'m here to help with ocean safety and activity planning! Ask me about specific conditions, safety tips, or activity recommendations.',
    'Based on current conditions, I can provide personalized recommendations. What specific aspect would you like to know more about?',
    'Ocean conditions change constantly. Always check the latest data before heading out and be prepared to adjust your plans.',
    'Remember: respect the ocean, know your limits, and prioritize safety above all else.',
  ];
}
